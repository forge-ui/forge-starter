import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { z } from "zod";
import { defineModule } from "@/lib/modules/definition";
import { moduleReadTools } from "@/lib/modules/read-tools";
import { moduleDraftTools } from "@/lib/modules/draft-tools";
import { publicModuleRow } from "@/lib/modules/sanitize";
import { toolsForAccess, AGENT_TOOLS } from "@/lib/agent/registry";
import { getStarterKnowledge, STARTER_PLATFORM_ID } from "@/lib/harness/starter-knowledge";
import { retrieveKnowledge } from "@/lib/harness/knowledge";
import { MODULES } from "@/config/modules.generated";
import { readModules, generateModules, moduleSourceFingerprint } from "../../scripts/modules.mjs";

const fake = defineModule({
  id: "widgets", label: "零件仓库", order: 100, permissionResource: "widgets",
  menu: { href: "/widgets/", icon: "WidgetBoldDuotone", group: "main" },
  knowledge: { summary: "零件仓库管理精密零件库存。", fields: "编号、名称、库存。", rules: "读取库存需授权。", source: "app/(app)/widgets/page.tsx" },
  read: { service: "lib/widgets/service.ts", export: "listWidgets", fields: ["id", "name", "stock", "nested"], sensitiveFields: ["privateNote"] },
  draft: { adapter: "generic", schema: { source: "lib/widgets/input.ts", export: "inputSchema" }, fields: ["name"], actions: ["create", "update", "delete"], pageAdapter: "components/widget-form-dialog.tsx" },
});
const recordId = "00000000-0000-4000-8000-000000000001";
const access = { roleCode: "reader", roleName: "只读", permissionCodes: ["widgets:read"], allowedModules: [], isSuperAdmin: false };

test("a manifest supplies retrievable knowledge, tools and permission filtering", async () => {
  let requester = "";
  const tools = moduleReadTools([fake], { widgets: async context => {
    requester = context.userId;
    return [{ id: recordId, name: "齿轮", stock: 3, api_key: "hidden", nested: { password: "hidden", accessToken: "hidden", privateNote: "hidden", stock: 2 } }];
  } });
  assert.equal(toolsForAccess(access, tools).length, 1);
  assert.equal(toolsForAccess({ ...access, permissionCodes: [] }, tools).length, 0);
  const tool = tools[0];
  assert.equal(tool.mode, "read");
  if (tool.mode !== "read") return;
  const output = await tool.run({}, { userId: "current-user" });
  assert.equal(requester, "current-user");
  assert.doesNotMatch(JSON.stringify(output), /hidden|api_key|password|accessToken|privateNote/);
  assert.equal(JSON.parse(output.summary).records[0].nested.stock, 2);
  const knowledge = getStarterKnowledge("manifest-test", [...MODULES, fake]);
  const request = { query: "零件仓库", platformId: STARTER_PLATFORM_ID, buildId: "manifest-test", allowedCapabilityIds: ["widgets.navigate", "widgets.list"] };
  assert.ok(retrieveKnowledge(knowledge, request).entries.some(entry => entry.id === "widgets.features"));
  assert.ok(!retrieveKnowledge(knowledge, { ...request, allowedCapabilityIds: [] }).entries.some(entry => entry.id === "widgets.features"));
});

test("recursive redaction covers normalized secret names and arrays", () => {
  assert.deepEqual(publicModuleRow({ name: "安全", nested: [{ APIKey: "no", apiKey: "no", credential: "no", authorization: "no", secret: "no", ok: true }], hidden: true }, ["name", "nested"]), { name: "安全", nested: [{ ok: true }] });
});

test("generic drafts use shared schema and never execute a writer", async () => {
  const tools = moduleDraftTools([fake], { widgets: z.object({ name: z.string().min(1), apiKey: z.string().optional() }) }, { widgets: async () => [{ id: recordId, revision: 4, updatedAt: "2026-11-05" }] });
  assert.deepEqual(toolsForAccess(access, tools), []);
  const tool = tools.find(tool => tool.id === "widgets.update")!;
  assert.equal(tool.mode, "write");
  if (tool.mode !== "write") return;
  await assert.rejects(tool.fill({ id: recordId, fields: { apiKey: "no" } }));
  const fill = await tool.fill({ id: recordId, fields: { name: "齿轮" } });
  assert.equal(fill.expectedRevision, 4);
  assert.equal(fill.fields.name, '"齿轮"');
  assert.equal(fill.mode, "edit");
  await assert.rejects(tool.fill({ id: "00000000-0000-4000-8000-000000000002", fields: {} }));
  const withoutVersion = moduleDraftTools([fake], { widgets: z.object({ name: z.string() }) }, { widgets: async () => [{ id: recordId }] }).find(tool => tool.id === "widgets.update")!;
  if (withoutVersion.mode === "write") await assert.rejects(withoutVersion.fill({ id: recordId, fields: {} }), /缺少记录版本/);
});

test("registry preserves unique tool identities", () => {
  assert.equal(new Set(AGENT_TOOLS.map(tool => tool.id)).size, AGENT_TOOLS.length);
});

function fixture() {
  const root = mkdtempSync(resolve(tmpdir(), "forge-module-"));
  const write = (path: string, content: string) => { mkdirSync(dirname(resolve(root, path)), { recursive: true }); writeFileSync(resolve(root, path), content); };
  for (const module of MODULES) {
    write(`config/modules/${module.id}.json`, readFileSync(`config/modules/${module.id}.json`, "utf8"));
    write(module.knowledge.source, "export {};\n");
    write(`app/(app)${module.menu.href}page.tsx`, "export {};\n");
    if ("service" in module.read) write(module.read.service, "export {};\n");
    for (const tool of module.tools ?? []) write(tool.source, "export {};\n");
  }
  write("tsconfig.json", "{}"); write("pnpm-lock.yaml", "{}");
  return { root, write };
}

test("checks reject missing manifests and empty knowledge; scaffolding registers automatically", () => {
  const { root, write } = fixture();
  try {
    write("app/(app)/widgets/page.tsx", "export {};");
    assert.throws(() => readModules(root), /Missing module manifest: widgets/);
    rmSync(resolve(root, "app/(app)/widgets"), { recursive: true });
    execFileSync(process.execPath, [resolve("scripts/new-module.mjs"), "widgets", "零件仓库"], { cwd: root });
    assert.ok(readModules(root).some(module => module.id === "widgets"));
    assert.match(readFileSync(resolve(root, "lib/modules/server.generated.ts"), "utf8"), /widgetsReader/);
    const generated = generateModules(root);
    for (const [path, content] of Object.entries(generated)) assert.equal(readFileSync(resolve(root, path), "utf8"), content);
    const before = moduleSourceFingerprint(root);
    write("lib/widgets/service.ts", "export const changed = true;");
    assert.notEqual(moduleSourceFingerprint(root), before);
    assert.throws(() => execFileSync(process.execPath, [resolve("scripts/generate-modules.mjs"), "--check"], { cwd: root, stdio: "pipe" }));
    assert.throws(() => execFileSync(process.execPath, [resolve("scripts/new-module.mjs"), "widgets"], { cwd: root, stdio: "pipe" }));
    write("config/modules/widgets.json", JSON.stringify({ ...fake, knowledge: { ...fake.knowledge, summary: "" } }));
    assert.throws(() => readModules(root), /Incomplete manifest/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
