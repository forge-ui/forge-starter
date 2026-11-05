import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateModules } from "./modules.mjs";

const [id, label = id] = process.argv.slice(2);
if (!id || !/^[a-z][a-z0-9-]{1,47}$/.test(id)) throw new Error("用法：pnpm module:new <小写模块id> [中文名称]");
const root = process.cwd();
const symbol = id.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join("");
const manifest = {
  id, label, order: 100, permissionResource: id,
  menu: { href: `/${id}/`, icon: "WidgetBoldDuotone", group: "main" },
  knowledge: { summary: `${label}模块骨架；数据服务尚未实现。`, fields: "编号、名称。", rules: "当前仅提供开发骨架，未实现的查询必须报错，不能声称已有真实数据；写入需完成页面确认、回执、If-Match与事务适配后才能启用。", source: `app/(app)/${id}/page.tsx` },
  read: { service: `lib/${id}/service.ts`, export: `list${symbol[0].toUpperCase()}${symbol.slice(1)}`, fields: ["id", "name"] },
  entries: { create: false, detail: false, edit: false },
};
const files = {
  [`config/modules/${id}.json`]: `${JSON.stringify(manifest, null, 2)}\n`,
  [`lib/${id}/input.ts`]: 'import { z } from "zod";\n\nexport const inputSchema = z.object({ name: z.string().min(1).max(200) }).strict();\n',
  [`lib/${id}/service.ts`]: `export async function ${manifest.read.export}(): Promise<Array<{ id: string; name: string }>> {\n  throw new Error("${id}: 数据服务尚未实现，请先完成 PostgreSQL schema 与迁移");\n}\n`,
  [`app/api/${id}/route.ts`]: `import { requirePermission } from "@/lib/rbac/access";\nimport { jsonError, jsonOk } from "@/lib/auth/http";\nimport { ${manifest.read.export} } from "@/lib/${id}/service";\n\nexport async function GET() {\n  const auth = await requirePermission(${JSON.stringify(id)}, "read");\n  if (!auth.ok) return auth.response;\n  try {\n    return jsonOk({ rows: await ${manifest.read.export}() });\n  } catch {\n    return jsonError("数据服务尚未实现", 503);\n  }\n}\n`,
  [`app/(app)/${id}/page.tsx`]: `import { PageTitleToolbar } from "@forge-ui-official/core";\n\nexport default function ModulePage() {\n  return (\n    <div className="space-y-5">\n      <PageTitleToolbar title={${JSON.stringify(label)}} />\n      <p className="text-fg-grey-700">模块骨架已登记，请先完成数据服务，再按页面角色接入列表、表单和保存回执。</p>\n    </div>\n  );\n}\n`,
};
for (const path of Object.keys(files)) if (existsSync(resolve(root, path))) throw new Error(`拒绝覆盖已有文件：${path}`);
for (const [path, content] of Object.entries(files)) {
  mkdirSync(dirname(resolve(root, path)), { recursive: true });
  writeFileSync(resolve(root, path), content, { flag: "wx" });
}
for (const [path, content] of Object.entries(generateModules(root))) {
  mkdirSync(dirname(resolve(root, path)), { recursive: true });
  writeFileSync(resolve(root, path), content);
}
console.log(`已创建 ${id} 开发骨架并自动注册菜单、知识、读取工具与权限资源。未实现持久化或写入，请按 docs/module-template.md 完成。`);
