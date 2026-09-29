import { z } from "zod";
import { presentationRequestSchema } from "./presentation";
import type { AgentTool } from "./types";

export const presentationTools: AgentTool[] = [{
  id: "assistant.present", mode: "read", permission: { resource: "dashboard", action: "read" },
  description: "把本轮已查询的事实、业务解释或待核对建议展示为交互组件。checklist用户自查清单；recommendation方案推荐；insights分析卡；diff待核对差异；code只读JSON/配置示例及差异（不能读写仓库或执行）；flow业务流程；commands可搜索的后续问题；context引用依据。按需要选择1至4个组件，不铺组件画廊。业务数据必须先查询，不编造事实/来源/统计，不包含密码密钥。选择对象请用ask_user，multiple=true支持多选。此工具只展示，绝不执行写入；组件回调是新请求，写入仍走已登记工具和页面确认。",
  schema: presentationRequestSchema,
  parameters: z.toJSONSchema(presentationRequestSchema),
  async run(args) {
    const { blocks } = presentationRequestSchema.parse(args);
    return { summary: "已展示交互内容；清单是用户自查，差异和推荐待核对，尚未执行业务修改。", blocks };
  },
}];
