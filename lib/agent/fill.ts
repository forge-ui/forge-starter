import type { Receipt } from "@/lib/semantic/operations";
import type { AgentFormFill } from "./types";
import { toast } from "@/lib/toast";

export const AGENT_FILL_EVENT = "forge-starter:agent-fill";
export const AGENT_PAGE_DONE_EVENT = "forge-starter:agent-page-done";
export const AGENT_PAGE_CANCEL_EVENT = "forge-starter:agent-page-cancel";
export const AGENT_TASK_CHANGED_EVENT = "forge-starter:agent-task-changed";
const STORAGE_KEY = "forge-starter:agent-fill";
const CONTINUE_KEY = "forge-starter:agent-continue";

export type AgentContinuation = {
  sessionId: string;
  operationId?: string;
  receipt?: Receipt;
  question: string;
  modelId?: string;
  mode: AgentFormFill["mode"];
};

export type AgentPageCancellation = { sessionId: string; operationId: string };

/** Retire only the page effect acknowledged by this session, never another draft. */
export function cancelAgentPageOperation(target: AgentPageCancellation) {
  if (typeof window === "undefined" || !target.sessionId || !target.operationId) return;
  const pending = readContinuation();
  if (pending?.sessionId === target.sessionId && pending.operationId === target.operationId) {
    window.sessionStorage.removeItem(CONTINUE_KEY);
  }
  try {
    const fill = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "null") as AgentFormFill | null;
    if (fill?.operationId === target.operationId) window.sessionStorage.removeItem(STORAGE_KEY);
  } catch { /* A malformed or unrelated command is not ours to discard. */ }
  window.dispatchEvent(new CustomEvent<AgentPageCancellation>(AGENT_PAGE_CANCEL_EVENT, { detail: target }));
}

export function discardAgentCommand(commandId: string) {
  if (typeof window === "undefined") return;
  try { const fill = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "null"); if (fill?.commandId === commandId) window.sessionStorage.removeItem(STORAGE_KEY); } catch { window.sessionStorage.removeItem(STORAGE_KEY); }
}

export function queueAgentFormFill(fill: AgentFormFill) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fill));
  window.dispatchEvent(new CustomEvent(AGENT_FILL_EVENT, { detail: fill }));
}

export function peekAgentFormFill(formId: AgentFormFill["formId"]): AgentFormFill | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const fill = JSON.parse(raw) as AgentFormFill;
    if (fill.formId !== formId) return null;
    return fill;
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function consumeAgentFormFill(formId: AgentFormFill["formId"]) {
  const fill = peekAgentFormFill(formId);
  if (!fill || typeof window === "undefined") return null;
  window.sessionStorage.removeItem(STORAGE_KEY);
  return fill;
}

export function queueAgentContinuation(item: AgentContinuation) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CONTINUE_KEY, JSON.stringify(item));
}

/** Notify the conversation only after the server has acknowledged cancellation. */
export async function requestAgentOperationCancellation(operationId: string): Promise<boolean> {
  if (typeof window === "undefined" || !operationId) return false;
  try {
    const response = await fetch(`/api/ask-ai/operations/${operationId}/`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: "cancelled" }),
    });
    const payload = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
    if (!response.ok || !payload?.ok) throw new Error(payload?.error || "取消未同步，请稍后重试");
    window.dispatchEvent(new CustomEvent(AGENT_TASK_CHANGED_EVENT, { detail: { operationId } }));
    return true;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "取消未同步，请稍后重试");
    return false;
  }
}

export function abandonAgentContinuation(operationId?: string) {
  if (typeof window === "undefined") return;
  const pending = readContinuation();
  if (operationId && pending?.operationId !== operationId) return;
  if (pending?.operationId) {
    const target = { sessionId: pending.sessionId, operationId: pending.operationId };
    void requestAgentOperationCancellation(target.operationId).then(cancelled => {
      if (cancelled) cancelAgentPageOperation(target);
    });
  } else window.sessionStorage.removeItem(CONTINUE_KEY);
}

export function readContinuation(): AgentContinuation | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(CONTINUE_KEY);
  if (!raw) return null;
  try {
    const item = JSON.parse(raw) as AgentContinuation;
    if (!item.sessionId || !item.question || !item.mode) return null;
    return item;
  } catch {
    window.sessionStorage.removeItem(CONTINUE_KEY);
    return null;
  }
}

/** 页面自己的保存或删除成功后，让同一条 Ask AI 会话继续未做完的查询或导出。 */
export function notifyAgentPageDone(mode: AgentFormFill["mode"], receipt?: Receipt) {
  const pending = readContinuation();
  if (!pending || pending.mode !== mode || typeof window === "undefined") return;
  if (pending.operationId && receipt?.operationId !== pending.operationId) return;
  window.sessionStorage.removeItem(CONTINUE_KEY);
  if (receipt) pending.receipt = receipt;
  window.dispatchEvent(new CustomEvent(AGENT_PAGE_DONE_EVENT, { detail: pending }));
}

/** Reload recovery consults the server; a client event alone never proves a commit. */
export async function recoverAgentContinuation() {
  const pending = readContinuation();
  if (!pending?.operationId) return;
  const response = await fetch(`/api/ask-ai/operations/${pending.operationId}/`);
  if (!response.ok) return;
  const data = await response.json();
  if (["committed", "verified"].includes(data.operation?.state) && data.operation.receipt) notifyAgentPageDone(pending.mode, data.operation.receipt);
  else if (data.operation?.expired || data.operation?.state === "cancelled") cancelAgentPageOperation({ sessionId: pending.sessionId, operationId: pending.operationId });
}
