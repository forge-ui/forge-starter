import { z } from "zod";
import { APP_MODULE_IDS, APP_MODULE_META } from "@/config/apps";
import type { AgentTool } from "./types";
const inputSchema = z.object({}).strict();

export const navigationTools: AgentTool[] = APP_MODULE_IDS.map((id) => ({
  id: `${id}.navigate`,
  mode: "read",
  permission: { resource: id, action: "read" },
  description: `打开${APP_MODULE_META[id].label}页面（${APP_MODULE_META[id].href}）。用户要求去此页面或先去此页面新增时调用。仅导航，不修改数据，不需要表单字段。`,
  schema: inputSchema,
  parameters: { type: "object", properties: {}, additionalProperties: false },
  async run(args) {
    inputSchema.parse(args);
    const navigation = { href: APP_MODULE_META[id].href, label: APP_MODULE_META[id].label };
    return { summary: `正在打开${navigation.label}页面，等待客户端确认。`, navigation };
  },
}));
