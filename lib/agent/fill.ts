import type { AgentFormFill } from "./types";

export const AGENT_FILL_EVENT = "forge-starter:agent-fill";
export const AGENT_PAGE_DONE_EVENT = "forge-starter:agent-page-done";
const STORAGE_KEY = "forge-starter:agent-fill";
const CONTINUE_KEY = "forge-starter:agent-continue";

export type AgentContinuation = {
  sessionId: string;
  question: string;
  modelId?: string;
  mode: AgentFormFill["mode"];
};

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

export function abandonAgentContinuation() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(CONTINUE_KEY);
}

function readContinuation(): AgentContinuation | null {
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
export function notifyAgentPageDone(mode: AgentFormFill["mode"]) {
  const pending = readContinuation();
  if (!pending || pending.mode !== mode || typeof window === "undefined") return;
  window.sessionStorage.removeItem(CONTINUE_KEY);
  window.dispatchEvent(new CustomEvent(AGENT_PAGE_DONE_EVENT, { detail: pending }));
}
