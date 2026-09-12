export type RbacStatus = "active" | "disabled";

export const RBAC_STATUS_META: Record<
  RbacStatus,
  { label: string; color: "green" | "red" }
> = {
  active: { label: "启用", color: "green" },
  disabled: { label: "停用", color: "red" },
};

export const RBAC_RESOURCES = [
  "dashboard",
  "accounts",
  "approvals",
  "settings",
  "roles",
  "menus",
  "permissions",
] as const;

export type RbacResource = (typeof RBAC_RESOURCES)[number];

export const RBAC_RESOURCE_META: Record<RbacResource, { label: string }> = {
  dashboard: { label: "工作台" },
  accounts: { label: "账号" },
  approvals: { label: "审批" },
  settings: { label: "应用" },
  roles: { label: "角色" },
  menus: { label: "菜单" },
  permissions: { label: "权限" },
};

export const RBAC_ACTIONS = ["read", "create", "update", "delete"] as const;

export type RbacAction = (typeof RBAC_ACTIONS)[number];

export const RBAC_ACTION_META: Record<RbacAction, { label: string }> = {
  read: { label: "查看" },
  create: { label: "新建" },
  update: { label: "编辑" },
  delete: { label: "删除" },
};

const CODE_RE = /^[a-z][a-z0-9_:-]{1,47}$/;

export function isRbacStatus(value: string): value is RbacStatus {
  return value === "active" || value === "disabled";
}

export function isRbacResource(value: string): value is RbacResource {
  return (RBAC_RESOURCES as readonly string[]).includes(value);
}

export function isRbacAction(value: string): value is RbacAction {
  return (RBAC_ACTIONS as readonly string[]).includes(value);
}

export function normalizeRbacCode(value: string) {
  return value.trim().toLowerCase();
}

export function assertRbacCode(value: string, label = "编码") {
  const code = normalizeRbacCode(value);
  if (!CODE_RE.test(code)) {
    throw new Error(`${label}需 2–48 位，以小写字母开头，仅含小写字母、数字、_ : -`);
  }
  return code;
}

export function formatRbacDate(date: Date) {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function uniqueConstraintMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("rbac_roles_code") || message.includes("rbac_permissions_code") || message.includes("rbac_menus_code")) {
    return "编码已被占用";
  }
  if (message.includes("_code_uidx") || message.includes("duplicate") || message.includes("unique")) {
    return "编码已被占用";
  }
  return fallback;
}
