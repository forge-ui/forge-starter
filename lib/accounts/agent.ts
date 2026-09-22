import { getAdminAccountById, listAdminAccounts } from "@/lib/accounts/service";
import { ACCOUNT_STATUS_META, type AdminAccount } from "@/lib/accounts/types";
import { signExportToken } from "@/lib/agent/intent";
import { parseArgs } from "@/lib/agent/parse";
import {
  AGENT_EXPORT_LIMIT,
  AGENT_LIST_LIMIT,
  AGENT_TABLE_LIMIT,
  type AgentTool,
  type AgentToolOutput,
} from "@/lib/agent/types";
import {
  accountCreateSchema,
  accountFilterSchema,
  accountIdSchema,
  accountUpdateToolSchema,
  type AccountFilter,
} from "./input";

const TABLE_COLUMNS = [
  { key: "name", label: "姓名" },
  { key: "username", label: "用户名" },
  { key: "role", label: "角色" },
  { key: "status", label: "状态" },
  { key: "department", label: "部门" },
];

const FILTER_PARAMETERS = {
  type: "object",
  additionalProperties: false,
  properties: {
    query: { type: "string", description: "匹配姓名、用户名、邮箱或手机" },
    status: {
      type: "string",
      enum: ["active", "disabled", "pending", "locked"],
      description: "active 启用，disabled 停用，pending 待激活，locked 锁定",
    },
    role: {
      type: "string",
      enum: ["超级管理员", "运营", "审计", "只读"],
    },
  },
} as const;

function statusLabel(account: AdminAccount) {
  return ACCOUNT_STATUS_META[account.status].label;
}

function matches(account: AdminAccount, filter: AccountFilter) {
  if (filter.status && account.status !== filter.status) return false;
  if (filter.role && account.role !== filter.role) return false;
  const query = filter.query?.trim().toLowerCase();
  if (!query) return true;
  const hay = `${account.name} ${account.username} ${account.email} ${account.phone}`.toLowerCase();
  return hay.includes(query);
}

export async function selectAccounts(filter: AccountFilter) {
  const rows = await listAdminAccounts();
  return rows.filter((account) => matches(account, filter));
}

function tableRow(account: AdminAccount): Record<string, string> {
  return {
    id: account.id,
    name: account.name,
    username: account.username,
    role: account.role,
    status: statusLabel(account),
    department: account.department,
  };
}

function compact(account: AdminAccount) {
  return {
    id: account.id,
    name: account.name,
    username: account.username,
    email: account.email,
    phone: account.phone,
    role: account.role,
    department: account.department,
    status: statusLabel(account),
    notes: account.notes,
  };
}

function accountLines(account: {
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: AdminAccount["status"];
  notes: string;
}) {
  return [
    `姓名：${account.name}`,
    `用户名：${account.username}`,
    `邮箱：${account.email}`,
    `手机：${account.phone}`,
    `角色：${account.role}`,
    `部门：${account.department}`,
    `状态：${ACCOUNT_STATUS_META[account.status].label}`,
    account.notes ? `备注：${account.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function csvCell(value: string) {
  let text = value.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export async function buildAccountsCsv(filter: AccountFilter) {
  const matched = await selectAccounts(filter);
  const truncated = matched.length > AGENT_EXPORT_LIMIT;
  const rows = matched.slice(0, AGENT_EXPORT_LIMIT);
  const header = ["姓名", "用户名", "邮箱", "手机", "角色", "部门", "状态", "备注"];
  const lines = [
    header.join(","),
    ...rows.map((account) =>
      [
        account.name,
        account.username,
        account.email,
        account.phone,
        account.role,
        account.department,
        statusLabel(account),
        account.notes,
      ]
        .map(csvCell)
        .join(","),
    ),
  ];
  return {
    csv: `\uFEFF${lines.join("\n")}`,
    count: rows.length,
    total: matched.length,
    truncated,
  };
}

function listOutput(rows: AdminAccount[], total: number): AgentToolOutput {
  const shown = rows.slice(0, AGENT_LIST_LIMIT);
  const table = shown.slice(0, AGENT_TABLE_LIMIT).map(tableRow);
  const omitted = total - shown.length;
  return {
    summary: omitted > 0
      ? `匹配 ${total} 条，这里返回前 ${shown.length} 条。${JSON.stringify(shown.map(compact))}`
      : `匹配 ${total} 条。${JSON.stringify(shown.map(compact))}`,
    blocks: [
      {
        type: "table",
        title: total > table.length ? `账号（显示 ${table.length} / ${total}）` : `账号（${total}）`,
        columns: TABLE_COLUMNS,
        rows: table,
      },
    ],
  };
}

const accountTools: AgentTool[] = [
  {
    id: "accounts.list",
    mode: "read",
    permission: { resource: "accounts", action: "read" },
    description: "按姓名、用户名、邮箱、手机、状态或角色筛选业务账号。问人数、状态、名单时先调用，不要编造。",
    parameters: FILTER_PARAMETERS,
    schema: accountFilterSchema,
    async run(input) {
      const filter = parseArgs(accountFilterSchema, input);
      const matched = await selectAccounts(filter);
      return listOutput(matched, matched.length);
    },
  },
  {
    id: "accounts.get",
    mode: "read",
    permission: { resource: "accounts", action: "read" },
    description: "按列表返回的 id 读取一条业务账号。",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: { id: { type: "string", description: "账号 id" } },
    },
    schema: accountIdSchema,
    async run(input) {
      const { id } = parseArgs(accountIdSchema, input);
      const account = await getAdminAccountById(id);
      if (!account) throw new Error("账号不存在");
      return {
        summary: JSON.stringify(compact(account)),
        blocks: [{ type: "table", title: account.name, columns: TABLE_COLUMNS, rows: [tableRow(account)] }],
      };
    },
  },
  {
    id: "accounts.create",
    mode: "write",
    permission: { resource: "accounts", action: "create" },
    description:
      "把新建账号的字段填进账号管理页面的表单，不直接写库。用户要在弹窗里检查并点创建，页面上的校验才会执行。不会修改侧栏。部门常用：平台、安全、运营、财务、客服。",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["name", "username", "email", "phone", "role", "department", "status"],
      properties: {
        name: { type: "string" },
        username: { type: "string", description: "3–32 位小写字母、数字或下划线" },
        email: { type: "string" },
        phone: { type: "string" },
        role: { type: "string", enum: ["超级管理员", "运营", "审计", "只读"] },
        department: { type: "string" },
        status: { type: "string", enum: ["active", "disabled", "pending", "locked"] },
        notes: { type: "string" },
      },
    },
    schema: accountCreateSchema,
    async describe(input) {
      const data = parseArgs(accountCreateSchema, input);
      return {
        title: `新建账号「${data.name}」`,
        body: `${accountLines({ ...data, notes: data.notes ?? "" })}\n点按钮后填入页面表单，要在弹窗里点创建才会保存。`,
        actionLabel: "填入页面表单",
      };
    },
    async fill(input) {
      const data = parseArgs(accountCreateSchema, input);
      return {
        formId: "accounts" as const,
        mode: "create" as const,
        href: "/accounts/",
        fields: {
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          role: data.role,
          department: data.department,
          status: data.status,
          notes: data.notes ?? "",
        },
      };
    },
  },
  {
    id: "accounts.update",
    mode: "write",
    permission: { resource: "accounts", action: "update" },
    description: "把修改后的字段填进账号管理页面的编辑表单，不直接写库。用户名不可改。id 用列表返回的 id。",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["id", "name", "email", "phone", "role", "department", "status"],
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        role: { type: "string", enum: ["超级管理员", "运营", "审计", "只读"] },
        department: { type: "string" },
        status: { type: "string", enum: ["active", "disabled", "pending", "locked"] },
        notes: { type: "string" },
      },
    },
    schema: accountUpdateToolSchema,
    async describe(input) {
      const data = parseArgs(accountUpdateToolSchema, input);
      const current = await getAdminAccountById(data.id);
      if (!current) throw new Error("账号不存在");
      return {
        title: `修改账号「${current.name}」`,
        body: `用户名保持 ${current.username}。\n${accountLines({
          ...data,
          username: current.username,
          notes: data.notes ?? "",
        })}`,
        actionLabel: "填入页面表单",
      };
    },
    async fill(input) {
      const data = parseArgs(accountUpdateToolSchema, input);
      const current = await getAdminAccountById(data.id);
      if (!current) throw new Error("账号不存在");
      return {
        formId: "accounts" as const,
        mode: "edit" as const,
        href: "/accounts/",
        recordId: current.id,
        fields: {
          name: data.name,
          username: current.username,
          email: data.email,
          phone: data.phone,
          role: data.role,
          department: data.department,
          status: data.status,
          notes: data.notes ?? "",
        },
      };
    },
  },
  {
    id: "accounts.delete",
    mode: "write",
    permission: { resource: "accounts", action: "delete" },
    description: "打开账号管理页面上的删除确认，不直接删库。用户还要点页面里的删除。",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: { id: { type: "string" } },
    },
    schema: accountIdSchema,
    async describe(input) {
      const { id } = parseArgs(accountIdSchema, input);
      const account = await getAdminAccountById(id);
      if (!account) throw new Error("账号不存在");
      return {
        title: `删除账号「${account.name}」`,
        body: `将在页面上打开「${account.name}」（${account.username}）的删除确认。点页面里的删除才会执行。`,
        actionLabel: "打开删除确认",
      };
    },
    async fill(input) {
      const { id } = parseArgs(accountIdSchema, input);
      const account = await getAdminAccountById(id);
      if (!account) throw new Error("账号不存在");
      return {
        formId: "accounts" as const,
        mode: "delete" as const,
        href: "/accounts/",
        recordId: account.id,
        fields: { name: account.name, username: account.username },
      };
    },
  },
  {
    id: "accounts.export",
    mode: "read",
    permission: { resource: "accounts", action: "read" },
    description: "按与列表相同的筛选生成业务账号 CSV 下载。不要在回复里粘贴表格全文。",
    parameters: FILTER_PARAMETERS,
    schema: accountFilterSchema,
    async run(input, ctx) {
      const filter = parseArgs(accountFilterSchema, input);
      const matched = await selectAccounts(filter);
      const token = await signExportToken(ctx.userId, "accounts.export", filter);
      const filename = accountExportFilename();
      const capped = Math.min(matched.length, AGENT_EXPORT_LIMIT);
      return {
        summary: matched.length > AGENT_EXPORT_LIMIT
          ? `已生成 CSV。匹配 ${matched.length} 条，文件含前 ${capped} 条。请让用户下载，不要粘贴全文。`
          : `已生成 CSV，共 ${matched.length} 条。请让用户下载，不要粘贴全文。`,
        blocks: [
          {
            type: "download",
            href: `/api/ask-ai/export/?token=${encodeURIComponent(token)}`,
            label: matched.length > 0 ? `下载 CSV（${capped} 条）` : "下载 CSV（空表）",
            filename,
          },
        ],
      };
    },
  },
];

export const accountAgentTools = accountTools;

export function accountExportFilename() {
  return `accounts-${new Date().toISOString().slice(0, 10)}.csv`;
}
