/** Pure declarations: safe to import at build time and in the browser. */
export const APPLICATION_BUILD_ID = process.env.NEXT_PUBLIC_SEMANTIC_BUILD_ID ?? "local-test";
export const CONTRACT_VERSION = "forge.application/v1";
export type ModuleId = "accounts" | "models" | "roles" | "menus" | "permissions" | "settings" | "dashboard";
export const moduleContracts = {
  accounts: {
    entity: "adminAccount", table: "admin_accounts", tableSymbol: "adminAccounts",
    label: "业务账号", route: "/accounts/",
    pages: ["accounts.list", "accounts.detail"],
    fields: ["id", "name", "username", "email", "phone", "role", "department", "status", "notes", "revision"],
    actions: ["accounts.list", "accounts.get", "accounts.open", "accounts.create", "accounts.update", "accounts.delete", "accounts.export", "accounts.filter"],
    sources: {
      table: "lib/db/schema.ts", input: "lib/accounts/input.ts", service: "lib/accounts/service.ts",
      api: "app/api/accounts/route.ts", itemApi: "app/api/accounts/[id]/route.ts",
      page: "app/(app)/accounts/page.tsx", detail: "app/(app)/accounts/[id]/page.tsx",
      form: "components/account-form-dialog.tsx", store: "components/accounts-store.tsx", tools: "lib/accounts/agent.ts",
    },
  },
  roles: { entity: "role", table: "rbac_roles", tableSymbol: "rbacRoles", label: "角色", route: "/roles/", pages: ["roles.list"], fields: ["id", "name", "code", "updatedAt"], actions: ["roles.list", "roles.open", "roles.create", "roles.update", "roles.delete"], sources: { table: "lib/db/schema.ts", service: "lib/roles/service.ts", api: "app/api/roles/route.ts", page: "app/(app)/roles/page.tsx", form: "components/role-form-dialog.tsx", store: "components/roles-store.tsx", tools: "lib/agent/resource-tools.ts" } },
  menus: { entity: "menu", table: "rbac_menus", tableSymbol: "rbacMenus", label: "菜单", route: "/menus/", pages: ["menus.list"], fields: ["id", "name", "code", "updatedAt"], actions: ["menus.list", "menus.open", "menus.create", "menus.update", "menus.delete"], sources: { table: "lib/db/schema.ts", service: "lib/menus/service.ts", api: "app/api/menus/route.ts", page: "app/(app)/menus/page.tsx", form: "components/menu-form-dialog.tsx", store: "components/menus-store.tsx", tools: "lib/agent/resource-tools.ts" } },
  permissions: { entity: "permission", table: "rbac_permissions", tableSymbol: "rbacPermissions", label: "权限", route: "/permissions/", pages: ["permissions.list"], fields: ["id", "name", "code", "updatedAt"], actions: ["permissions.list", "permissions.open", "permissions.create", "permissions.update", "permissions.delete"], sources: { table: "lib/db/schema.ts", service: "lib/permissions/service.ts", api: "app/api/permissions/route.ts", page: "app/(app)/permissions/page.tsx", form: "components/permission-form-dialog.tsx", store: "components/permissions-store.tsx", tools: "lib/agent/resource-tools.ts" } },
  models: {
    entity: "aiModel", table: "ai_models", tableSymbol: "aiModels", label: "模型", route: "/models/",
    pages: ["models.workspace"],
    fields: ["id", "name", "provider", "modelName", "status", "isDefault"],
    actions: ["models.list", "models.open", "models.filter", "models.create", "models.update", "models.delete", "models.probe"],
    sources: {
      table: "lib/db/schema.ts", service: "lib/models/service.ts", api: "app/api/models/route.ts",
      page: "app/(app)/models/page.tsx", form: "components/model-form-dialog.tsx",
      store: "components/models-store.tsx", tools: "lib/models/agent.ts",
    },
  },
} as const;

export function moduleForPage(pageId: string): ModuleId | undefined {
  if (pageId === "dashboard.home") return "dashboard";
  if (pageId === "settings.apps") return "settings";
  return (Object.keys(moduleContracts) as Array<keyof typeof moduleContracts>).find((id) =>
    (moduleContracts[id].pages as readonly string[]).includes(pageId));
}

/** Public projection intentionally excludes source paths and private fields. */
export const publicApplication = Object.fromEntries(Object.entries(moduleContracts).map(([id, c]) => [id, {
  entity: c.entity, label: c.label, route: c.route, pages: c.pages, fields: c.fields, actions: c.actions,
}]));
