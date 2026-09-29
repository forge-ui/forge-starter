import { accountDraftSchema } from "@/lib/agent/forms";
import { matchesAccount } from "./filter";
import { toolParameters } from "@/lib/semantic/schema";
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

function statusLabel(account: AdminAccount) {
  return ACCOUNT_STATUS_META[account.status].label;
}

export async function selectAccounts(filter: AccountFilter) {
  const rows = await listAdminAccounts();
  return rows.filter((account) => matchesAccount(account, filter));
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
    parameters: toolParameters(accountFilterSchema),
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
    parameters: toolParameters(accountIdSchema),
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
    id: "accounts.open",
    mode: "read",
    permission: { resource: "accounts", action: "read" },
    description: "打开指定业务账号的详情页面。用户要求打开/进入详情时调用；仅在对话中读取信息使用 accounts_get。id 必须来自真实查询和用户明确选择。",
    parameters: toolParameters(accountIdSchema),
    schema: accountIdSchema,
    async run(input) {
      const { id } = parseArgs(accountIdSchema, input);
      const account = await getAdminAccountById(id);
      if (!account) throw new Error("账号不存在");
      return { summary: `正在打开「${account.name}」详情，等待客户端确认。`, navigation: { href: `/accounts/${encodeURIComponent(id)}/`, label: `${account.name}详情` } };
    },
  },
  {
    id: "accounts.create",
    mode: "write",
    permission: { resource: "accounts", action: "create" },
    description:
      "展示对话内的新建账号表单。即使只有用户名或缺少其他字段，也立即调用，只传用户已提供的信息；未提供的字段省略，让用户在表单补齐。不要用长文字索要字段，不要编造姓名邮箱手机。用户确认后带入页面保存，不直接写库。",
    parameters: toolParameters(accountDraftSchema),
    schema: accountDraftSchema,
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
    description: "把修改后的字段填进账号管理页面的编辑表单，不直接写库。只需提供要修改的字段，未提供的字段保留原值。用户名不可改。id 用当前记录或列表返回的 id。",
    parameters: toolParameters(accountUpdateToolSchema),
    schema: accountUpdateToolSchema,
    async describe(input) {
      const data = parseArgs(accountUpdateToolSchema, input);
      const current = await getAdminAccountById(data.id);
      if (!current) throw new Error("账号不存在");
      return {
        title: `修改账号「${current.name}」`,
        body: `用户名保持 ${current.username}。\n${accountLines({
          ...current,
          ...data,
          username: current.username,
          notes: data.notes ?? current.notes,
        })}`,
        actionLabel: "填入页面表单",
      };
    },
    async fill(input) {
      const data = parseArgs(accountUpdateToolSchema, input);
      const current = await getAdminAccountById(data.id);
      if (!current) throw new Error("账号不存在");
      const merged = { ...current, ...data };
      return {
        formId: "accounts" as const,
        mode: "edit" as const,
        href: "/accounts/",
        recordId: current.id,
        expectedRevision: current.revision,
        fields: {
          name: merged.name,
          username: current.username,
          email: merged.email,
          phone: merged.phone,
          role: merged.role,
          department: merged.department,
          status: merged.status,
          notes: merged.notes ?? "",
        },
      };
    },
  },
  {
    id: "accounts.delete",
    mode: "write",
    permission: { resource: "accounts", action: "delete" },
    description: "打开账号管理页面上的删除确认，不直接删库。用户还要点页面里的删除。",
    parameters: toolParameters(accountIdSchema),
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
        expectedRevision: account.revision,
        fields: { name: account.name, username: account.username },
      };
    },
  },
  {
    id: "accounts.export",
    mode: "read",
    permission: { resource: "accounts", action: "read" },
    description: "按与列表相同的筛选生成业务账号 CSV 下载。不要在回复里粘贴表格全文。",
    parameters: toolParameters(accountFilterSchema),
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
