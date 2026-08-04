export type AccountStatus = "active" | "disabled" | "pending" | "locked";

export type AccountRole = "超级管理员" | "运营" | "审计" | "只读";

export type AdminAccount = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: AccountRole;
  department: string;
  status: AccountStatus;
  loginCount: number;
  lastLogin: string;
  created: string;
  avatarUrl: string;
  notes: string;
};

export type AccountInput = {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: AccountRole;
  department: string;
  status: AccountStatus;
  notes: string;
};

export const ACCOUNT_STATUS_META: Record<
  AccountStatus,
  { label: string; color: "green" | "red" | "yellow" | "grey" | "blue" }
> = {
  active: { label: "启用", color: "green" },
  disabled: { label: "停用", color: "red" },
  pending: { label: "待激活", color: "yellow" },
  locked: { label: "锁定", color: "grey" },
};

export const ACCOUNT_ROLES: AccountRole[] = ["超级管理员", "运营", "审计", "只读"];

export const ACCOUNT_DEPARTMENTS = ["平台", "安全", "运营", "财务", "客服"] as const;

export function avatarUrlFor(seed: string) {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;
}

export function isAccountStatus(value: string): value is AccountStatus {
  return value === "active" || value === "disabled" || value === "pending" || value === "locked";
}

export function isAccountRole(value: string): value is AccountRole {
  return (ACCOUNT_ROLES as string[]).includes(value);
}

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatAccountDate(date: Date) {
  return `${String(date.getDate()).padStart(2, "0")} ${monthLabels[date.getMonth()]} ${date.getFullYear()}`;
}
