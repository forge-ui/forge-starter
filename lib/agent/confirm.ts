import { registerOperation, semanticEnabled } from "@/lib/semantic/operations";
import { sameContext, type PageContext } from "@/lib/semantic/context";
import { hasPermission, type AccessContext } from "@/lib/rbac/access";
import { readAgentIntent, spendAgentIntent } from "./intent";
import { agentToolById } from "./registry";
import type { AgentToolOutput } from "./types";
import { assertActiveHarness } from "@/lib/harness/starter-operations";

export async function executeConfirmedIntent(
  token: string,
  userId: string,
  access: AccessContext,
  page?: PageContext,
): Promise<AgentToolOutput> {
  const intent = await readAgentIntent(token, userId);
  const tool = agentToolById(intent.toolId);
  if (!tool || tool.mode !== "write") throw new Error("确认单无效");
  if (!hasPermission(access, tool.permission.resource, tool.permission.action)) {
    throw new Error("没有权限执行此操作");
  }
  if (intent.binding?.harness) await assertActiveHarness(intent.binding.harness, userId, tool.id);
  if (intent.binding?.page && !sameContext(intent.binding.page, page)) throw new Error("页面上下文已变化，请重新提出操作");
  const fill = await tool.fill(intent.args);
  if (intent.binding?.revision !== undefined && fill.expectedRevision !== intent.binding.revision) throw new Error("记录已变化，请重新核对");
  if ((semanticEnabled() || intent.binding?.harness) && ["create", "edit", "delete"].includes(fill.mode)) {
    await registerOperation(intent.jti, userId, tool.id, fill.recordId, intent.binding?.harness);
    fill.operationId = intent.jti;
  } else spendAgentIntent(intent.jti);
  fill.commandId = crypto.randomUUID();
  const summary = fill.mode === "delete"
    ? "已生成页面删除指令，等待页面接收。"
    : "已生成页面操作指令，等待页面接收。";
  return { summary, fill };
}
