// Generate read-only modules from the OpenAPI 3 description of an existing backend.
//   pnpm module:openapi <spec.yaml|spec.json|https://…>                  # print the module plan
//   pnpm module:openapi <spec> --yes [--only orders,customers]           # write the modules
// Each collection path with GET becomes a module: types, a service that calls the backend at
// EXTERNAL_API_BASE_URL, read-only API routes, a manifest (menu, knowledge, Ask AI reader) and a
// page skeleton. Writes stay out: the plan lists them for forge-starter-new-page to wire with receipts.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { generateModules, sensitive } from "./modules.mjs";

const ENVELOPE_KEYS = ["items", "data", "rows", "list", "records", "results", "content"];
const PAGINATION_PARAMS = /^(page|pageNum|pageNo|pageIndex|page_size|pageSize|size|limit|offset|cursor|per_page|perPage)$/;
const RESERVED_IDS = new Set(["api", "auth", "agent", "ref", "settings", "external-api", "modules"]);
const MAX_READ_FIELDS = 12;
export const CLIENT_PATH = "lib/external-api/client.ts";

export async function loadSpec(source) {
  let text;
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`下载接口描述失败：HTTP ${response.status}`);
    text = await response.text();
  } else {
    text = readFileSync(source, "utf8");
  }
  const spec = text.trimStart().startsWith("{") ? JSON.parse(text) : parseYaml(text);
  if (!/^3\./.test(String(spec?.openapi ?? ""))) throw new Error("只支持 OpenAPI 3.x。Swagger 2.0 先用 swagger2openapi 转换。");
  return spec;
}

function resolveRef(spec, schema, seen = new Set()) {
  if (!schema || typeof schema !== "object") return {};
  if (schema.$ref) {
    if (!schema.$ref.startsWith("#/")) throw new Error("不支持外部 $ref：" + schema.$ref);
    if (seen.has(schema.$ref)) return {};
    const target = schema.$ref.slice(2).split("/").reduce((node, key) => node?.[key.replaceAll("~1", "/").replaceAll("~0", "~")], spec);
    if (!target) throw new Error("找不到 $ref：" + schema.$ref);
    return resolveRef(spec, target, new Set([...seen, schema.$ref]));
  }
  if (schema.allOf) {
    const parts = schema.allOf.map(part => resolveRef(spec, part, seen));
    return { type: "object", properties: Object.assign({}, ...parts.map(part => part.properties ?? {})), required: parts.flatMap(part => part.required ?? []) };
  }
  return schema;
}

function typeOf(schema) {
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  return { type: types.find(type => type && type !== "null"), nullable: schema.nullable === true || types.includes("null") };
}

function tsType(spec, raw) {
  const schema = resolveRef(spec, raw);
  const { type, nullable } = typeOf(schema);
  let result = "unknown";
  if (Array.isArray(schema.enum) && schema.enum.every(value => typeof value === "string")) result = schema.enum.map(value => JSON.stringify(value)).join(" | ");
  else if (type === "string") result = "string";
  else if (type === "integer" || type === "number") result = "number";
  else if (type === "boolean") result = "boolean";
  else if (type === "array") {
    const item = tsType(spec, schema.items ?? {});
    result = /[|]/.test(item) ? `Array<${item}>` : `${item}[]`;
  } else if (type === "object" || schema.properties) result = "Record<string, unknown>";
  return nullable ? `${result} | null` : result;
}

function jsonSchema(spec, operation) {
  const responses = operation?.responses ?? {};
  const status = ["200", "201", "2XX", "default"].find(code => responses[code]) ?? Object.keys(responses).find(code => code.startsWith("2"));
  const content = resolveRef(spec, responses[status])?.content ?? {};
  const type = Object.keys(content).find(name => /json/.test(name));
  return type ? resolveRef(spec, content[type].schema) : null;
}

function collectionShape(spec, schema) {
  if (!schema) return null;
  if (typeOf(schema).type === "array") return { envelope: null, item: resolveRef(spec, schema.items) };
  const properties = schema.properties ?? {};
  const key = ENVELOPE_KEYS.find(name => properties[name] && typeOf(resolveRef(spec, properties[name])).type === "array")
    ?? Object.keys(properties).find(name => typeOf(resolveRef(spec, properties[name])).type === "array");
  return key ? { envelope: key, item: resolveRef(spec, resolveRef(spec, properties[key]).items) } : null;
}

function itemShape(spec, schema, fieldNames) {
  if (!schema) return { envelope: null };
  const properties = schema.properties ?? {};
  if (fieldNames.some(name => properties[name])) return { envelope: null };
  const key = ["data", "item", "result", "record"].find(name => properties[name] && typeOf(resolveRef(spec, properties[name])).type !== "array");
  return { envelope: key ?? null };
}

function fieldsOf(spec, schema) {
  const required = new Set(schema?.required ?? []);
  return Object.entries(schema?.properties ?? {}).filter(([name]) => /^[A-Za-z_$][\w$]*$/.test(name)).map(([name, raw]) => {
    const property = resolveRef(spec, raw);
    return { name, type: tsType(spec, raw), required: required.has(name), description: String(property.description ?? property.title ?? "").split("\n")[0].trim() };
  });
}

const kebab = value => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s.]+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
const pascal = id => id.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join("");
const hasCjk = value => /[一-鿿]/.test(value ?? "");
const isParam = segment => /^\{.+\}$/.test(segment);

function labelFor(spec, operation, id) {
  if (hasCjk(operation["x-label"])) return operation["x-label"];
  const tag = operation.tags?.[0];
  const tagDescription = spec.tags?.find(item => item.name === tag)?.description;
  for (const candidate of [tag, tagDescription, operation.summary]) {
    if (hasCjk(candidate)) return candidate.split(/[\n，。,.]/)[0].replace(/(列表|查询|获取|分页)+$/g, "").trim() || id;
  }
  return tag || id;
}

function taken(root, id) {
  return RESERVED_IDS.has(id) || [`config/modules/${id}.json`, `lib/${id}`, `app/api/${id}`, `app/(app)/${id}`].some(path => existsSync(resolve(root, path)));
}

export function planModules(spec, root) {
  const paths = spec.paths ?? {};
  const modules = [];
  const skipped = [];
  for (const [path, entry] of Object.entries(paths)) {
    const segments = path.split("/").filter(Boolean);
    if (!entry?.get || !segments.length || isParam(segments.at(-1))) continue;
    if (segments.some(isParam)) {
      skipped.push({ path, reason: "嵌套资源暂不生成，在父资源的详情页里接" });
      continue;
    }
    const id = kebab(segments.at(-1));
    if (!/^[a-z][a-z0-9-]{1,47}$/.test(id)) {
      skipped.push({ path, reason: `无法生成合法模块 id（${id || "空"}）` });
      continue;
    }
    if (modules.some(module => module.id === id)) {
      skipped.push({ path, reason: `模块 id ${id} 和 ${modules.find(module => module.id === id).path} 重复` });
      continue;
    }
    if (taken(root, id)) {
      skipped.push({ path, reason: `模块 ${id} 已存在或是保留名` });
      continue;
    }
    const shape = collectionShape(spec, jsonSchema(spec, entry.get));
    if (!shape?.item?.properties) {
      skipped.push({ path, reason: "GET 响应里找不到对象数组，无法确定字段" });
      continue;
    }
    const fields = fieldsOf(spec, shape.item);
    const itemPath = Object.keys(paths).find(candidate => {
      const parts = candidate.split("/").filter(Boolean);
      return parts.length === segments.length + 1 && isParam(parts.at(-1)) && parts.slice(0, -1).join("/") === segments.join("/");
    });
    const itemEntry = itemPath ? paths[itemPath] : null;
    const idField = fields.find(field => field.name === "id")?.name ?? fields.find(field => itemPath && field.name === itemPath.split("/").at(-1).slice(1, -1))?.name ?? fields[0]?.name;
    const queryParams = [...(entry.parameters ?? []), ...(entry.get.parameters ?? [])].map(parameter => resolveRef(spec, parameter)).filter(parameter => parameter.in === "query");
    const createBody = entry.post?.requestBody ? resolveRef(spec, Object.values(resolveRef(spec, entry.post.requestBody).content ?? {})[0]?.schema) : null;
    const writes = [entry.post && "create", (itemEntry?.put || itemEntry?.patch) && "update", itemEntry?.delete && "delete"].filter(Boolean);
    const readFields = fields.filter(field => !sensitive(field.name) && !/Record<|\[\]|Array</.test(field.type)).slice(0, MAX_READ_FIELDS).map(field => field.name);
    if (!readFields.length) {
      skipped.push({ path, reason: "没有可供 Ask AI 读取的普通字段（全是嵌套对象、数组或敏感字段）" });
      continue;
    }
    modules.push({
      id,
      symbol: pascal(id),
      label: labelFor(spec, entry.get, id),
      path,
      itemPath: itemEntry?.get ? itemPath : null,
      envelope: shape.envelope,
      itemEnvelope: itemEntry?.get ? itemShape(spec, jsonSchema(spec, itemEntry.get), fields.map(field => field.name)).envelope : null,
      fields,
      idField,
      readFields: readFields.includes(idField) || !idField ? readFields : [idField, ...readFields.slice(0, MAX_READ_FIELDS - 1)],
      hiddenFields: fields.filter(field => sensitive(field.name)).map(field => field.name),
      pagination: queryParams.filter(parameter => PAGINATION_PARAMS.test(parameter.name)).map(parameter => parameter.name),
      requiredQuery: queryParams.filter(parameter => parameter.required && !PAGINATION_PARAMS.test(parameter.name)).map(parameter => parameter.name),
      writes,
      createFields: createBody ? fieldsOf(spec, createBody).length : 0,
    });
  }
  return { modules, skipped, server: spec.servers?.[0]?.url ?? null };
}

export function pageRoles(module) {
  const roles = ["列表：collection 表格，对照 accounts 和 /ref/list-table"];
  if (module.itemPath) roles.push(module.fields.length > 8 ? "详情：全页详情，抄 accounts/[id]" : "详情：详情弹窗，对照 /ref/detail-modal + ?id=");
  if (module.writes.includes("create")) roles.push(module.createFields > 10 ? "新建：整页表单 form-page" : "新建：表单弹窗 form-modal");
  return roles;
}

export function renderPlan(plan) {
  const lines = ["# 从接口描述生成模块", ""];
  if (plan.server) lines.push(`接口地址（servers[0]）：${plan.server}，写进 .env 的 EXTERNAL_API_BASE_URL。`, "");
  for (const module of plan.modules) {
    lines.push(`## ${module.label}（${module.id}）`, "");
    lines.push(`- 读取：GET ${module.path}${module.envelope ? `（取响应的 ${module.envelope}）` : ""}${module.itemPath ? `；详情 GET ${module.itemPath}` : ""}`);
    lines.push(`- 字段：${module.fields.map(field => field.name).join("、")}`);
    lines.push(`- Ask AI 可读字段：${module.readFields.join("、")}${module.hiddenFields.length ? `；已排除敏感字段 ${module.hiddenFields.join("、")}` : ""}`);
    if (module.pagination.length) lines.push(`- 分页参数 ${module.pagination.join("、")}：生成的读取只取默认第一页，页面阶段接分页`);
    if (module.requiredQuery.length) lines.push(`- 注意：列表接口有必填参数 ${module.requiredQuery.join("、")}，生成的读取没带，要手动补进 service`);
    lines.push(`- 页面角色：${pageRoles(module).join("；")}`);
    lines.push(`- 写入：${module.writes.length ? `接口有 ${module.writes.join("、")}，本次不生成，按 docs/module-template.md 在页面阶段接确认和回执` : "接口没有写操作"}`);
    lines.push("");
  }
  if (plan.skipped.length) lines.push("## 跳过", "", ...plan.skipped.map(item => `- ${item.path}：${item.reason}`), "");
  return lines.join("\n");
}

const comment = (module, method, path) => `// Generated by pnpm module:openapi from ${method} ${path}; edit freely.\n`;

function renderTypes(module) {
  const body = module.fields.filter(field => !module.hiddenFields.includes(field.name)).map(field => `${field.description ? `  /** ${field.description.replaceAll("*/", "")} */\n` : ""}  ${field.name}${field.required ? "" : "?"}: ${field.type};`).join("\n");
  const hidden = module.hiddenFields.length ? `// Sensitive fields dropped by the service before anything leaves the server: ${module.hiddenFields.join(", ")}.\n` : "";
  return `${comment(module, "GET", module.path)}${hidden}export type ${module.symbol}Record = {\n${body}\n};\n`;
}

function renderService(module) {
  const type = `${module.symbol}Record`;
  const list = module.envelope
    ? `  const body = await externalApi<{ ${JSON.stringify(module.envelope)}?: ${type}[] }>(${JSON.stringify(module.path)});\n  const rows = body[${JSON.stringify(module.envelope)}];`
    : `  const rows = await externalApi<${type}[]>(${JSON.stringify(module.path)});`;
  const hidden = module.hiddenFields.length > 0;
  const visible = value => hidden ? `visible(${value})` : value;
  const lines = [
    comment(module, "GET", module.path) + `import { ExternalApiError, externalApi } from "@/lib/external-api/client";`,
    `import type { ${type} } from "./types";`,
    "",
    ...(hidden ? [
      `const HIDDEN_FIELDS = new Set(${JSON.stringify(module.hiddenFields)});`,
      `const visible = (row: ${type}) => Object.fromEntries(Object.entries(row).filter(([key]) => !HIDDEN_FIELDS.has(key))) as ${type};`,
      "",
    ] : []),
    `export async function list${module.symbol}(): Promise<${type}[]> {`,
    list,
    `  if (!Array.isArray(rows)) throw new ExternalApiError(${JSON.stringify(`外部接口 GET ${module.path} 没有返回列表`)}, 502);`,
    hidden ? "  return rows.map(visible);" : "  return rows;",
    "}",
  ];
  if (module.itemPath) {
    const path = "`" + module.itemPath.replace(/\{[^}]+\}/, "${encodeURIComponent(id)}") + "`";
    lines.push(
      "",
      `export async function get${module.symbol}ById(id: string): Promise<${type} | null> {`,
      "  try {",
      module.itemEnvelope
        ? `    const body = await externalApi<{ ${JSON.stringify(module.itemEnvelope)}?: ${type} }>(${path});\n    const row = body[${JSON.stringify(module.itemEnvelope)}];\n    return row ? ${visible("row")} : null;`
        : `    return ${visible(`await externalApi<${type}>(${path})`)};`,
      "  } catch (error) {",
      "    if (error instanceof ExternalApiError && error.status === 404) return null;",
      "    throw error;",
      "  }",
      "}",
    );
  }
  return lines.join("\n") + "\n";
}

function renderRoutes(module) {
  const id = JSON.stringify(module.id);
  const routes = {
    [`app/api/${module.id}/route.ts`]: `${comment(module, "GET", module.path)}import { apiError, jsonOk } from "@/lib/auth/http";\nimport { requirePermission } from "@/lib/rbac/access";\nimport { list${module.symbol} } from "@/lib/${module.id}/service";\n\nexport async function GET() {\n  const auth = await requirePermission(${id}, "read");\n  if (!auth.ok) return auth.response;\n  try {\n    return jsonOk({ rows: await list${module.symbol}() });\n  } catch (error) {\n    return apiError(error);\n  }\n}\n`,
  };
  if (module.itemPath) {
    routes[`app/api/${module.id}/[id]/route.ts`] = `${comment(module, "GET", module.itemPath)}import { apiError, jsonError, jsonOk } from "@/lib/auth/http";\nimport { requirePermission } from "@/lib/rbac/access";\nimport { get${module.symbol}ById } from "@/lib/${module.id}/service";\n\ntype Ctx = { params: Promise<{ id: string }> };\n\nexport async function GET(_request: Request, ctx: Ctx) {\n  const auth = await requirePermission(${id}, "read");\n  if (!auth.ok) return auth.response;\n  try {\n    const { id } = await ctx.params;\n    const row = await get${module.symbol}ById(id);\n    if (!row) return jsonError(${JSON.stringify(`${module.label}不存在`)}, 404);\n    return jsonOk({ row });\n  } catch (error) {\n    return apiError(error);\n  }\n}\n`;
  }
  return routes;
}

function renderPage(module) {
  return `import { PageTitleToolbar } from "@forge-ui-official/core";\n\nexport default function ModulePage() {\n  return (\n    <div className="space-y-5">\n      <PageTitleToolbar title={${JSON.stringify(module.label)}} />\n      <p className="text-fg-grey-700">${`已接入外部接口 GET ${module.path}（只读，数据在 /api/${module.id}/）。按 forge-starter-new-page 做${pageRoles(module).map(role => role.split("：")[0]).join("、")}页面。`}</p>\n    </div>\n  );\n}\n`;
}

function renderManifest(module, order) {
  const fieldText = module.fields.map(field => field.description ? `${field.description}（${field.name}）` : field.name).join("、");
  return {
    id: module.id,
    label: module.label,
    order,
    permissionResource: module.id,
    menu: { href: `/${module.id}/`, icon: "WidgetBoldDuotone", group: "main" },
    knowledge: {
      summary: `${module.label}：读取外部接口 GET ${module.path}${module.itemPath ? ` 和 GET ${module.itemPath}` : ""}，只读。`,
      fields: `${fieldText}。`,
      rules: [
        "数据来自 EXTERNAL_API_BASE_URL 指向的外部接口，以接口实时返回为准，不能编造记录。",
        module.pagination.length ? `只读取接口默认返回的第一页（分页参数 ${module.pagination.join("、")} 尚未接入），回答总数时要说明这一点。` : "",
        module.writes.length ? `接口支持 ${module.writes.join("、")}，但还没有接入页面保存与回执，不能声称已写入。` : "接口没有写操作。",
      ].filter(Boolean).join(""),
      source: `app/(app)/${module.id}/page.tsx`,
    },
    read: { service: `lib/${module.id}/service.ts`, export: `list${module.symbol}`, fields: module.readFields },
    entries: { create: false, detail: false, edit: false },
  };
}

export const CLIENT_SOURCE = `// Server-only client for the existing backend described by OpenAPI (pnpm module:openapi).
// EXTERNAL_API_BASE_URL is the spec's server URL; EXTERNAL_API_TOKEN, when set, is sent as a Bearer token.
const TIMEOUT_MS = 15_000;

export class ExternalApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export async function externalApi<T>(path: string): Promise<T> {
  const base = process.env.EXTERNAL_API_BASE_URL?.trim();
  if (!base) throw new ExternalApiError("未配置 EXTERNAL_API_BASE_URL，无法读取外部接口", 503);
  const headers: Record<string, string> = { accept: "application/json" };
  const token = process.env.EXTERNAL_API_TOKEN?.trim();
  if (token) headers.authorization = \`Bearer \${token}\`;
  let response: Response;
  try {
    response = await fetch(new URL(path.replace(/^\\//, ""), base.endsWith("/") ? base : \`\${base}/\`), { headers, cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    throw new ExternalApiError(\`外部接口无法访问：\${error instanceof Error ? error.message : String(error)}\`, 502);
  }
  // Keep the backend's auth failures apart from this app's session: never surface them as 401.
  if (response.status === 401 || response.status === 403) throw new ExternalApiError("外部接口拒绝了凭据，检查 EXTERNAL_API_TOKEN", 502);
  if (response.status === 404) throw new ExternalApiError("外部接口没有这条记录", 404);
  if (!response.ok) throw new ExternalApiError(\`外部接口出错（HTTP \${response.status}）\`, 502);
  return (await response.json()) as T;
}
`;

export function renderFiles(plan) {
  const files = {};
  plan.modules.forEach((module, index) => {
    Object.assign(files, {
      [`config/modules/${module.id}.json`]: `${JSON.stringify(renderManifest(module, 100 + index), null, 2)}\n`,
      [`lib/${module.id}/types.ts`]: renderTypes(module),
      [`lib/${module.id}/service.ts`]: renderService(module),
      ...renderRoutes(module),
      [`app/(app)/${module.id}/page.tsx`]: renderPage(module),
    });
  });
  return files;
}

if (process.argv[1] && import.meta.url.endsWith("/" + basename(process.argv[1]))) {
  const args = process.argv.slice(2);
  const onlyIndex = args.indexOf("--only");
  const only = onlyIndex >= 0 ? args[onlyIndex + 1]?.split(",").filter(Boolean) : null;
  if (onlyIndex >= 0 && !only?.length) {
    console.error("--only 后面要跟模块 id，用逗号分隔");
    process.exit(1);
  }
  const [source] = args.filter((arg, index) => !arg.startsWith("--") && !(onlyIndex >= 0 && index === onlyIndex + 1));
  if (!source) {
    console.error("用法：pnpm module:openapi <openapi.yaml|openapi.json|URL> [--only id,id] [--yes]");
    process.exit(1);
  }
  const root = process.cwd();
  try {
    const plan = planModules(await loadSpec(source), root);
    if (only) {
      const unknown = only.filter(id => !plan.modules.some(module => module.id === id));
      if (unknown.length) throw new Error(`--only 里的模块不在计划中：${unknown.join("、")}`);
      plan.modules = plan.modules.filter(module => only.includes(module.id));
    }
    console.log(renderPlan(plan));
    if (!plan.modules.length) process.exit(plan.skipped.length ? 1 : 0);
    if (!process.argv.includes("--yes")) {
      console.log("确认后加 --yes 生成；只要部分模块用 --only id,id。");
      process.exit(0);
    }
    const files = renderFiles(plan);
    if (!existsSync(resolve(root, CLIENT_PATH))) files[CLIENT_PATH] = CLIENT_SOURCE;
    for (const path of Object.keys(files)) if (existsSync(resolve(root, path))) throw new Error(`拒绝覆盖已有文件：${path}`);
    const written = [];
    try {
      for (const [path, content] of Object.entries(files)) {
        mkdirSync(dirname(resolve(root, path)), { recursive: true });
        writeFileSync(resolve(root, path), content, { flag: "wx" });
        written.push(path);
      }
      for (const [path, content] of Object.entries(generateModules(root))) writeFileSync(resolve(root, path), content);
    } catch (error) {
      for (const path of written.reverse()) rmSync(resolve(root, path));
      for (const module of plan.modules) for (const dir of [`lib/${module.id}`, `app/api/${module.id}`, `app/(app)/${module.id}`]) rmSync(resolve(root, dir), { recursive: true, force: true });
      throw new Error(`生成失败，已撤回写入的文件：${error instanceof Error ? error.message : error}`);
    }
    console.log(`已生成 ${plan.modules.length} 个只读模块并注册菜单、权限资源和 Ask AI 读取。在 .env 里设 EXTERNAL_API_BASE_URL（需要时加 EXTERNAL_API_TOKEN），再按上面的页面角色用 forge-starter-new-page 做页面。`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
