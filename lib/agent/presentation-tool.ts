import { z } from "zod";
import { presentationRequestSchema, PRESENTATION_TOOL_DESCRIPTION } from "./presentation";
import type { AgentTool } from "./types";

export const presentationTools: AgentTool[] = [{
  id: "assistant.present", mode: "read", permission: { resource: "dashboard", action: "read" },
  description: PRESENTATION_TOOL_DESCRIPTION,
  schema: presentationRequestSchema,
  parameters: z.toJSONSchema(presentationRequestSchema),
  async run(args) {
    const { blocks } = presentationRequestSchema.parse(args);
    return { summary: "已展示交互内容；清单是用户自查，差异和推荐待核对，尚未执行业务修改。", blocks };
  },
}];
