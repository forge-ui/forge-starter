import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

export function readModules(root) {
  const directory = resolve(root, "config/modules");
  const modules = readdirSync(directory).filter(name => name.endsWith(".json")).map(name => {
    const definition = JSON.parse(readFileSync(resolve(directory, name), "utf8"));
    if (name !== `${definition.id}.json` || !/^[a-z][a-z0-9-]*$/.test(definition.id)) throw new Error(`Invalid module: ${name}`);
    for (const value of [definition.label, definition.permissionResource, definition.knowledge?.summary, definition.knowledge?.fields, definition.knowledge?.rules, definition.knowledge?.source, definition.menu?.group]) {
      if (typeof value !== "string" || !value.trim()) throw new Error(`Incomplete manifest: ${name}`);
    }
    if (definition.permissionResource !== definition.id) throw new Error(`Permission resource must match module: ${name}`);
    if (!Number.isFinite(definition.order) || !/^\/[a-z0-9/-]+\/$/.test(definition.menu?.href ?? "")) throw new Error(`Invalid menu: ${name}`);
    if (!/^[A-Za-z]+BoldDuotone$/.test(definition.menu?.icon ?? "")) throw new Error(`Invalid icon: ${name}`);
    const source = definition.knowledge.source;
    const page = `app/(app)${definition.menu.href}page.tsx`;
    for (const path of [source, page]) if (!existsSync(resolve(root, path))) throw new Error(`Missing module source: ${path}`);
    if (definition.read?.unavailable) {
      if (typeof definition.read.unavailable !== "string" || !definition.read.unavailable.trim()) throw new Error(`Missing reader reason: ${name}`);
    } else {
      const reader = definition.read;
      if (!reader || !Array.isArray(reader.fields) || !reader.fields.length) throw new Error(`Missing reader or unavailable reason: ${name}`);
      validateReference(root, { source: reader.service, export: reader.export });
      if (reader.fields.some(field => typeof field !== "string" || sensitive(field))) throw new Error(`Sensitive read field: ${name}`);
    }
    for (const tools of definition.tools ?? []) validateReference(root, tools);
    if (definition.draft && !["resource", "specialized", "generic"].includes(definition.draft.adapter)) throw new Error(`Invalid draft adapter: ${name}`);
    if (definition.draft?.adapter === "generic") {
      validateReference(root, definition.draft.schema);
      if (!definition.read.service || !Array.isArray(definition.draft.fields) || !definition.draft.fields.length || definition.draft.fields.some(sensitive)) throw new Error(`Invalid draft fields: ${name}`);
      if (!Array.isArray(definition.draft.actions) || !definition.draft.actions.length || definition.draft.actions.some(action => !["create", "update", "delete"].includes(action))) throw new Error(`Invalid draft actions: ${name}`);
      if (!existsSync(resolve(root, definition.draft.pageAdapter ?? "")) || !definition.draft.pageAdapter?.startsWith("components/")) throw new Error(`Missing page draft adapter: ${name}`);
    }
    return definition;
  }).sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
  if (!modules.length || new Set(modules.map(module => module.id)).size !== modules.length) throw new Error("Empty or duplicate module registry");
  if (new Set(modules.map(module => module.menu.href)).size !== modules.length) throw new Error("Duplicate module route");
  const ids = new Set(modules.map(module => module.id));
  for (const entry of readdirSync(resolve(root, "app/(app)"), { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== "ref" && existsSync(resolve(root, "app/(app)", entry.name, "page.tsx")) && !ids.has(entry.name)) {
      throw new Error(`Missing module manifest: ${entry.name}`);
    }
  }
  for (const entry of readdirSync(resolve(root, "app/api"), { withFileTypes: true })) {
    if (entry.isDirectory() && existsSync(resolve(root, "lib", entry.name, "service.ts")) && !["auth", "agent"].includes(entry.name) && !ids.has(entry.name)) throw new Error(`Missing module manifest: ${entry.name}`);
  }
  return modules;
}

export const sensitive = field => /api[_-]?key|password|secret|token|credential|authorization|system[_-]?prompt/i.test(field);

function validateReference(root, reference) {
  if (!/^lib\/[a-z0-9/-]+\.ts$/.test(reference.source ?? "") || !/^[A-Za-z][A-Za-z0-9]*$/.test(reference.export ?? "") || !existsSync(resolve(root, reference.source))) throw new Error(`Invalid module reference: ${JSON.stringify(reference)}`);
}

export function generateModules(root) {
  const modules = readModules(root);
  const catalog = `import { defineModule } from "@/lib/modules/definition";\n\nexport const MODULES = [\n${modules.map(module => `  defineModule(${JSON.stringify(module)}),`).join("\n")}\n] as const;\n\nexport type RegisteredModuleId = (typeof MODULES)[number]["id"];\n`;
  const imports = [];
  const readers = [];
  const tools = [];
  const drafts = [];
  const draftImports = [];
  for (const module of modules) {
    if (module.read.service) {
      imports.push(`import { ${module.read.export} as ${module.id.replaceAll("-", "_")}Reader } from "@/${module.read.service.slice(0, -3)}";`);
      readers.push(`  ${JSON.stringify(module.id)}: ${module.id.replaceAll("-", "_")}Reader,`);
    }
    for (const [index, tool] of (module.tools ?? []).entries()) {
      const name = `${module.id.replaceAll("-", "_")}Tools${index}`;
      imports.push(`import { ${tool.export} as ${name} } from "@/${tool.source.slice(0, -3)}";`);
      tools.push(`  ...${name},`);
    }
    if (module.draft?.adapter === "generic") {
      const name = `${module.id.replaceAll("-", "_")}Schema`;
      draftImports.push(`import { ${module.draft.schema.export} as ${name} } from "@/${module.draft.schema.source.slice(0, -3)}";`);
      drafts.push(`  ${JSON.stringify(module.id)}: ${name},`);
    }
  }
  const server = `${imports.join("\n")}\nexport { moduleDraftSchemas } from "./draft-schemas.generated";\n\nexport const moduleReaders = {\n${readers.join("\n")}\n};\nexport const moduleSpecializedTools = [\n${tools.join("\n")}\n];\n`;
  const draftSchemas = `${draftImports.join("\n")}\n\nexport const moduleDraftSchemas = {\n${drafts.join("\n")}\n};\n`;
  const icons = [...new Set(modules.map(module => module.menu.icon))];
  const menu = `"use client";\n\nimport { ${icons.join(", ")} } from "@forge-ui-official/core/icons";\nexport const moduleIcons = { ${icons.join(", ")} };\n`;
  const fingerprint = moduleSourceFingerprint(root);
  return { "config/modules.generated.ts": catalog, "config/module-icons.generated.ts": menu, "lib/modules/server.generated.ts": server, "lib/modules/draft-schemas.generated.ts": draftSchemas, "lib/modules/build.generated.ts": `export const MODULE_SOURCE_BUILD_ID = ${JSON.stringify(fingerprint)};\n` };
}

export function moduleSourceFingerprint(root) {
  const entries = [];
  function walk(directory) {
    if (!existsSync(resolve(root, directory))) return;
    for (const item of readdirSync(resolve(root, directory), { withFileTypes: true })) {
      if (item.isSymbolicLink() || ["ref", "reference"].includes(item.name)) continue;
      const path = `${directory}/${item.name}`;
      if (item.isDirectory()) walk(path);
      else if (/\.(tsx?|json)$/.test(path) && !/\.generated\.tsx?$/.test(path)) entries.push([path, createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex")]);
    }
  }
  for (const directory of ["app", "lib", "components", "config", "tooling/semantic"]) walk(directory);
  for (const path of ["tsconfig.json", "pnpm-lock.yaml"]) if (existsSync(resolve(root, path))) entries.push([path, createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex")]);
  return createHash("sha256").update(JSON.stringify(entries.sort(([left], [right]) => left.localeCompare(right)))).digest("hex");
}
