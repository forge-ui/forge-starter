import { z } from "zod";
import { APP_MODULE_IDS, APP_MODULE_META } from "@/config/apps";
import type { AgentTool } from "./types";
const inputSchema = z.object({}).strict();

export const navigationTools: AgentTool[] = APP_MODULE_IDS.map((id) => ({
  id: `${id}.navigate`,
  mode: "read",
  permission: { resource: id, action: "read" },
  description: `打开${APP_MODULE_META[id].label}页面（${APP_MODULE_META[id].href}）。用户明确要求仅前往此页面或先去页面时调用。用户直接要求创建角色/菜单/权限/模型/应用时，改用该模块的create_form打开新建表单，不能用导航代替。仅导航，不修改数据。`,
  schema: inputSchema,
  parameters: { type: "object", properties: {}, additionalProperties: false },
  async run(args) {
    inputSchema.parse(args);
    const navigation = { href: APP_MODULE_META[id].href, label: APP_MODULE_META[id].label };
    return { summary: `正在打开${navigation.label}页面，等待客户端确认。`, navigation };
  },
}));
