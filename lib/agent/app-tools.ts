import { z } from "zod";
import { appDraftSchema, localAppSnapshot } from "./app-fields";
import { encodeResourceFields } from "./resource-fields";
import { toolParameters } from "@/lib/semantic/schema";
import type { AgentTool } from "./types";
const empty = z.object({}).strict();
export const appAgentTools: AgentTool[] = [{
  id: "settings.list", mode: "read", permission: { resource: "settings", action: "read" }, schema: empty, parameters: toolParameters(empty),
  description: "查询当前浏览器本地应用注册表（并非服务器应用库）。返回真实名称、id、类型和模块。", async run(_, ctx) {
    const rows = ctx.page?.localApps;
    if (!rows) return { summary: "请先打开应用管理，读取本地应用配置。", navigation: { href: "/settings/apps/", label: "应用管理" } };
    return { summary: JSON.stringify({ storage: "browser-local", records: rows.map(row => ({ ...row, snapshot: localAppSnapshot(row) })) }), blocks: [{ type: "table", title: "当前浏览器的应用", columns: [{key:"name",label:"应用"},{key:"id",label:"编号"},{key:"kind",label:"类型"}], rows: rows.map(row => ({ id: row.id, name: row.name, kind: row.kind ?? "", snapshot: localAppSnapshot(row) })) }] };
  },
}, ...(["create", "update", "delete"] as const).map((action): AgentTool => {
  const schema = action === "create" ? z.object({ fields: appDraftSchema }).strict() : action === "update" ? z.object({ id: z.string().min(1).max(120), expected: z.string().min(1).max(8000), fields: appDraftSchema }).strict() : z.object({ id: z.string().min(1).max(120), expected: z.string().min(1).max(8000) }).strict();
  return { id: `settings.${action}`, mode: "write", permission: { resource: "settings", action: "update" }, schema, parameters: toolParameters(schema),
    description: `${action === "create" ? "新建" : action === "update" ? "编辑" : "删除"}当前浏览器本地应用。已有目标先settings.list，使用真实id和snapshot填expected。只准备草稿，确认后交页面保存；不建立SSO或服务端应用。`,
    async describe(raw) { const args = schema.parse(raw); return { title: `${action === "create" ? "新建" : action === "update" ? "编辑" : "删除"}应用`, body: `仅影响当前浏览器的应用配置。${"id" in args ? `目标编号：${args.id}。` : ""}${"fields" in args ? Object.entries(args.fields).map(([key, value]) => `${({name:"名称",subtitle:"副标题",kind:"应用类型",href:"入口地址",openMode:"打开方式",authMode:"认证方式",modules:"菜单模块"} as Record<string,string>)[key]}：${Array.isArray(value) ? value.join("、") : ({link:"外部链接",external:"外部系统",internal:"内部应用",same_tab:"当前标签页",new_tab:"新标签页"} as Record<string,string>)[String(value)] ?? String(value)}`).join("；") : ""}。请在页面核对${action === "delete" ? "删除" : "并保存"}。`, actionLabel: "确认并带入页面" }; },
    async fill(raw) { const args = schema.parse(raw); return { formId: "settings", mode: action === "update" ? "edit" : action, href: "/settings/apps/", recordId: "id" in args ? args.id : undefined, expectedUpdatedAt: "expected" in args ? args.expected : undefined, fields: encodeResourceFields("fields" in args ? args.fields : {}) }; },
  };
})];
