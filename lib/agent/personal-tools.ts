import { z } from "zod";
import { toolParameters } from "@/lib/semantic/schema";
import type { AgentTool } from "./types";
const schema = z.object({ kind: z.enum(["profile", "security", "notifications"]) }).strict();
export const personalAgentTools: AgentTool[] = [{
  id: "personal.open", mode: "write", permission: { resource: "dashboard", action: "read" }, schema, parameters: toolParameters(schema),
  description: "打开当前用户自己的资料、修改密码或通知偏好弹窗。仅打开；修改及保存由用户在原弹窗操作。密码只能在页面填写，不进入对话。",
  async describe() { return { title: "打开个人设置", body: "仅打开本人设置，尚未修改。", actionLabel: "打开" }; },
  async fill(raw) { const {kind} = schema.parse(raw); return { formId: "personal", mode: "open", href: "", fields: { kind } }; },
}];
