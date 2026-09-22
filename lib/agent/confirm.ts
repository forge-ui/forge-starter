import { hasPermission, type AccessContext } from "@/lib/rbac/access";
import { readAgentIntent, spendAgentIntent } from "./intent";
import { agentToolById } from "./registry";
import type { AgentToolOutput } from "./types";

export async function executeConfirmedIntent(
  token: string,
  userId: string,
  access: AccessContext,
): Promise<AgentToolOutput> {
  const intent = await readAgentIntent(token, userId);
  const tool = agentToolById(intent.toolId);
  if (!tool || tool.mode !== "write") throw new Error("确认单无效");
  if (!hasPermission(access, tool.permission.resource, tool.permission.action)) {
    throw new Error("没有权限执行此操作");
  }
  spendAgentIntent(intent.jti);
  const fill = await tool.fill(intent.args);
  const summary = fill.mode === "delete"
    ? "已打开页面上的删除确认，尚未删除。"
    : "已把字段交到页面表单，尚未保存。";
  return { summary, fill };
}
