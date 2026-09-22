import type { AgentFormFill } from "./types";

export const AGENT_FILL_EVENT = "forge-starter:agent-fill";
const STORAGE_KEY = "forge-starter:agent-fill";

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
