import type { RbacAction, RbacResource } from "./constants";

export type SeedPermissionSpec = {
  name: string;
  code: string;
  resource: RbacResource;
  action: RbacAction;
  description: string;
};

export type SeedRoleSpec = {
  name: string;
  code: string;
  description: string;
  grant: (code: string) => boolean;
};

const SPECS: Omit<SeedPermissionSpec, "code">[] = [
  { resource: "dashboard", action: "read", name: "查看工作台", description: "打开工作台与指标" },
  { resource: "accounts", action: "read", name: "查看账号", description: "浏览账号列表与详情" },
  { resource: "accounts", action: "create", name: "新建账号", description: "创建业务账号" },
  { resource: "accounts", action: "update", name: "编辑账号", description: "修改业务账号" },
  { resource: "accounts", action: "delete", name: "删除账号", description: "删除业务账号" },
  { resource: "settings", action: "read", name: "查看应用", description: "打开应用管理" },
  { resource: "settings", action: "update", name: "配置应用", description: "新建或编辑内部/外部应用" },
  { resource: "roles", action: "read", name: "查看角色", description: "浏览角色与授权" },
  { resource: "roles", action: "create", name: "新建角色", description: "创建角色" },
  { resource: "roles", action: "update", name: "编辑角色", description: "修改角色与权限绑定" },
  { resource: "roles", action: "delete", name: "删除角色", description: "删除角色" },
  { resource: "menus", action: "read", name: "查看菜单", description: "浏览菜单目录" },
  { resource: "menus", action: "create", name: "新建菜单", description: "登记自定义菜单" },
  { resource: "menus", action: "update", name: "编辑菜单", description: "修改菜单目录项" },
  { resource: "menus", action: "delete", name: "删除菜单", description: "删除自定义菜单" },
  { resource: "permissions", action: "read", name: "查看权限", description: "浏览权限点" },
  { resource: "permissions", action: "create", name: "新建权限", description: "登记权限点" },
  { resource: "permissions", action: "update", name: "编辑权限", description: "修改权限点" },
  { resource: "permissions", action: "delete", name: "删除权限", description: "删除权限点" },
];

export const SEED_PERMISSIONS: SeedPermissionSpec[] = SPECS.map((item) => ({
  ...item,
  code: `${item.resource}:${item.action}`,
}));

export const SEED_ROLES: SeedRoleSpec[] = [
  {
    name: "超级管理员",
    code: "super_admin",
    description: "全部权限，用于基础后台运维",
    grant: () => true,
  },
  {
    name: "运营",
    code: "operator",
    description: "账号与应用日常操作，不含 RBAC 写权限",
    grant: (code) =>
      code === "dashboard:read"
      || code.startsWith("accounts:")
      || code === "settings:read"
      || code === "settings:update",
  },
  {
    name: "审计",
    code: "auditor",
    description: "只读查看全部模块，用于合规核对",
    grant: (code) => code.endsWith(":read"),
  },
  {
    name: "只读",
    code: "readonly",
    description: "工作台与账号只读",
    grant: (code) => code === "dashboard:read" || code === "accounts:read",
  },
];

export const SEED_ROLE_CODES = SEED_ROLES.map((role) => role.code);

const ROLE_ALIASES: Record<string, string> = {
  admin: "super_admin",
  super_admin: "super_admin",
  管理员: "super_admin",
  operator: "operator",
  运营: "operator",
  auditor: "auditor",
  审计: "auditor",
  readonly: "readonly",
  只读: "readonly",
};

/** Demo / 注册：用户名（或邮箱本地部分）映射到种子角色；未识别则超级管理员。 */
export function resolveLoginRoleCode(login: string): string {
  const raw = login.trim().toLowerCase();
  const local = raw.includes("@") ? raw.split("@")[0] ?? raw : raw;
  return ROLE_ALIASES[local] ?? ROLE_ALIASES[raw] ?? "super_admin";
}

export function seedRoleName(code: string): string {
  return SEED_ROLES.find((role) => role.code === code)?.name ?? code;
}

export function seedPermissionCodesForRole(roleCode: string): string[] {
  const spec = SEED_ROLES.find((role) => role.code === roleCode);
  if (!spec) return seedPermissionCodesForRole("super_admin");
  return SEED_PERMISSIONS.filter((perm) => spec.grant(perm.code)).map((perm) => perm.code);
}

export function isSuperAdminRole(roleCode: string) {
  return roleCode === "super_admin";
}
