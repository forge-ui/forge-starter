import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_APP_ENTRIES, modulesForApp } from "@/config/apps";
import { MODULES } from "@/config/modules.generated";
import { defineModule } from "@/lib/modules/definition";
import { hasPermission, withAuthenticatedAccess, type AccessContext } from "@/lib/rbac/access";
import { toolsForAccess } from "@/lib/agent/registry";

const emptyAccess: AccessContext = { roleCode: "viewer", roleName: "查看者", permissionCodes: [], allowedModules: [], isSuperAdmin: false };
const module = { ...MODULES.find(entry => entry.id === "accounts")!, access: "authenticated" as const };

test("authenticated modules grant only read consistently to clients, APIs and agent tools", () => {
  const access = withAuthenticatedAccess(emptyAccess, [module]);
  assert.deepEqual(access.allowedModules, ["accounts"]);
  assert.deepEqual(access.permissionCodes, ["accounts:read"]);
  assert.equal(hasPermission(access, "accounts", "read"), true);
  for (const action of ["create", "update", "delete"] as const) assert.equal(hasPermission(access, "accounts", action), false);
  assert.equal(hasPermission(access, "models", "read"), false);
  const tools = toolsForAccess(access);
  assert.ok(tools.some(tool => tool.id === "accounts.navigate"));
  assert.ok(tools.some(tool => tool.permission.resource === "accounts" && tool.permission.action === "read"));
  assert.ok(tools.every(tool => tool.permission.resource === "accounts" && tool.permission.action === "read"));
  assert.deepEqual(emptyAccess.permissionCodes, []);
  assert.deepEqual(withAuthenticatedAccess(access, [module]), access);
});

test("normal module grants and existing write privileges remain unchanged", () => {
  assert.deepEqual(withAuthenticatedAccess(emptyAccess, MODULES), emptyAccess);
  const original = { ...emptyAccess, permissionCodes: ["accounts:update", "models:read"], allowedModules: ["models" as const] };
  const access = withAuthenticatedAccess(original, [module]);
  assert.equal(hasPermission(access, "accounts", "update"), true);
  assert.equal(hasPermission(access, "accounts", "delete"), false);
  assert.deepEqual(access.allowedModules, ["models", "accounts"]);
  assert.throws(() => defineModule({ ...module, access: "public" } as unknown as typeof module), /访问策略无效/);
});

test("authenticated modules override explicit internal app selections, not external links", () => {
  const app = { ...DEFAULT_APP_ENTRIES[0]!, hostConfigured: true, modules: ["models" as const] };
  assert.deepEqual(modulesForApp(app, ["accounts"]), ["models", "accounts"]);
  assert.deepEqual(modulesForApp(app, []), ["models"]);
  assert.deepEqual(modulesForApp({ ...app, kind: "external" }, ["accounts"]), []);
  assert.deepEqual(modulesForApp({ ...app, kind: "link" }, ["accounts"]), []);
});
