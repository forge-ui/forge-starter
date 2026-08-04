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

function avatar(seed: string) {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;
}

export function createAccountId() {
  return `acc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function buildAccount(input: AccountInput, existing?: AdminAccount): AdminAccount {
  const now = new Date();
  const created =
    existing?.created
    ?? `${String(now.getDate()).padStart(2, "0")} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][now.getMonth()]} ${now.getFullYear()}`;
  return {
    id: existing?.id ?? createAccountId(),
    name: input.name.trim(),
    username: input.username.trim().toLowerCase(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    role: input.role,
    department: input.department,
    status: input.status,
    loginCount: existing?.loginCount ?? 0,
    lastLogin: existing?.lastLogin ?? "—",
    created,
    avatarUrl: existing?.avatarUrl ?? avatar(input.username || input.email),
    notes: input.notes.trim(),
  };
}

export const INITIAL_ACCOUNTS: AdminAccount[] = [
  {
    id: "1",
    name: "陈晓",
    username: "chenxiao",
    email: "chenxiao@forge.admin",
    phone: "138 0000 1001",
    role: "超级管理员",
    department: "平台",
    status: "active",
    loginCount: 124,
    lastLogin: "今天 09:12",
    created: "12 Jan 2024",
    avatarUrl: avatar("chenxiao"),
    notes: "平台主管理员，拥有全部权限。",
  },
  {
    id: "2",
    name: "李敏",
    username: "limin",
    email: "limin@forge.admin",
    phone: "139 0000 1002",
    role: "运营",
    department: "运营",
    status: "active",
    loginCount: 86,
    lastLogin: "昨天 18:40",
    created: "03 Mar 2024",
    avatarUrl: avatar("limin"),
    notes: "负责内容与活动配置。",
  },
  {
    id: "3",
    name: "王强",
    username: "wangqiang",
    email: "wangqiang@forge.admin",
    phone: "137 0000 1003",
    role: "审计",
    department: "安全",
    status: "pending",
    loginCount: 0,
    lastLogin: "—",
    created: "18 Nov 2025",
    avatarUrl: avatar("wangqiang"),
    notes: "待激活，邮件邀请已发送。",
  },
  {
    id: "4",
    name: "赵丽",
    username: "zhaoli",
    email: "zhaoli@forge.admin",
    phone: "136 0000 1004",
    role: "只读",
    department: "财务",
    status: "disabled",
    loginCount: 12,
    lastLogin: "12 天前",
    created: "21 Jul 2024",
    avatarUrl: avatar("zhaoli"),
    notes: "已停用，保留历史审计访问记录。",
  },
  {
    id: "5",
    name: "周凯",
    username: "zhoukai",
    email: "zhoukai@forge.admin",
    phone: "135 0000 1005",
    role: "运营",
    department: "客服",
    status: "locked",
    loginCount: 45,
    lastLogin: "3 天前",
    created: "09 Sep 2024",
    avatarUrl: avatar("zhoukai"),
    notes: "多次失败登录后锁定。",
  },
  {
    id: "6",
    name: "孙悦",
    username: "sunyue",
    email: "sunyue@forge.admin",
    phone: "134 0000 1006",
    role: "审计",
    department: "安全",
    status: "active",
    loginCount: 58,
    lastLogin: "今天 08:05",
    created: "15 Feb 2025",
    avatarUrl: avatar("sunyue"),
    notes: "安全审计只读+导出。",
  },
  {
    id: "7",
    name: "吴迪",
    username: "wudi",
    email: "wudi@forge.admin",
    phone: "133 0000 1007",
    role: "只读",
    department: "运营",
    status: "active",
    loginCount: 21,
    lastLogin: "本周",
    created: "01 Jun 2025",
    avatarUrl: avatar("wudi"),
    notes: "报表只读账号。",
  },
  {
    id: "8",
    name: "郑浩",
    username: "zhenghao",
    email: "zhenghao@forge.admin",
    phone: "132 0000 1008",
    role: "超级管理员",
    department: "平台",
    status: "active",
    loginCount: 210,
    lastLogin: "1 小时前",
    created: "20 Jan 2023",
    avatarUrl: avatar("zhenghao"),
    notes: "备用超管。",
  },
];
