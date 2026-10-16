import assert from "node:assert/strict";
import { test } from "node:test";
import { APP_MODULE_IDS } from "../../config/apps";
import { SYSTEM_FEATURES, systemFeatureContext } from "../../lib/agent/system-features";
import { AGENT_TOOLS, toolsForAccess } from "../../lib/agent/registry";
import { parseAgentNavigation, executeAgentNavigation } from "../../lib/agent/navigation";
import { retrieveStarterKnowledge } from "../../lib/harness/starter-knowledge";
import type { AccessContext } from "../../lib/rbac/access";
import { routeDialogue } from "../../lib/agent/dialogue";
import { pageEntryTools, FORM_ENTRY_MODULES } from "../../lib/agent/page-entry-tools";

const access: AccessContext = { roleCode: "test", roleName: "Test", isSuperAdmin: false, allowedModules: ["roles"], permissionCodes: ["roles:read", "roles:create"] };

test("every menu module has sourced product knowledge and an available entrance", () => {
  assert.deepEqual(Object.keys(SYSTEM_FEATURES).sort(), [...APP_MODULE_IDS].sort());
  const ids = AGENT_TOOLS.map(tool => tool.id);
  for (const id of APP_MODULE_IDS) {
    const found = retrieveStarterKnowledge({ query: SYSTEM_FEATURES[id].summary, allowedCapabilityIds: ids, maxEntries: 50, maxChars: 100000 });
    assert(found.entries.some(entry => entry.id === `${id}.features`), id);
    assert(ids.includes(`${id}.navigate`));
  }
});

test("system inventory respects module access and distinguishes page support from tools", () => {
  const context = JSON.parse(systemFeatureContext(toolsForAccess(access).map(tool => tool.id)));
  assert.deepEqual(context.modules.map((module: { id: string }) => module.id), ["roles"]);
  assert.match(context.modules[0].summary, /新建.*编辑.*删除/);
  assert(context.modules[0].assistantTools.includes("roles.create"));
  assert(!context.modules[0].assistantTools.includes("roles.delete"));
});

test("preparing role creation requires read and create and never writes", async () => {
  for (const permissionCodes of [["roles:read"], ["roles:create"]]) assert(!toolsForAccess({ ...access, permissionCodes }).some(tool => tool.id === "roles.create"));
  const tool = toolsForAccess(access).find(tool => tool.id === "roles.create");
  assert(tool?.mode === "write");
  const fill = await tool.fill({ fields: { name: "审计员", code: "audit_test" } });
  assert.equal(fill.mode, "create");
  assert.equal(fill.href, "/roles/");
  assert.equal(JSON.parse(fill.fields.name), "审计员");
});

test("form entrance whitelist rejects arbitrary or destructive query parameters", () => {
  for (const href of ["/roles/?delete=1", "/roles/?create=1&admin=true", "/roles/?edit=guessed", "/settings/apps/?edit=10000000-0000-4000-8000-000000000001", "/roles/?create=0"]) assert.equal(parseAgentNavigation({ href }), undefined);
});

test("all supported new-form tools survive JSON transport and keep writes on the page", async () => {
  for (const module of FORM_ENTRY_MODULES) {
    const tool = pageEntryTools.find(tool => tool.id === `${module}.create_form`);
    assert(tool?.mode === "read");
    const result = await tool.run({}, { userId: "test" });
    assert(parseAgentNavigation(JSON.parse(JSON.stringify(result.navigation))), module);
    assert.equal(result.fill, undefined);
    assert.equal(result.blocks, undefined);
  }
});

test("legacy router no longer rejects system introductions, app creation or role creation", async () => {
  for (const question of ["这个系统有哪些功能", "帮我新建一个应用", "帮我创建一个角色"]) {
    assert.deepEqual(await routeDialogue({ question, userId: "test", access }), {});
  }
});

test("same-page form navigation dispatches query even though pathname is unchanged", async () => {
  let pushed = "";
  const text = await executeAgentNavigation({ href: "/roles/?create=1", label: "角色" }, {
    push(href) { pushed = href; }, getPath: () => "/roles/", signal: new AbortController().signal,
  });
  assert.equal(pushed, "/roles/?create=1");
  assert.equal(text, "已打开角色页面。"); // A route receipt must not claim a saved role.
});
