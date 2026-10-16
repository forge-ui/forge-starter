import type { AgentFormFill } from "./types";
import { notifyAgentPageDone } from "./fill";
import { publicLocalApp } from "./app-fields";
import type { Receipt } from "@/lib/semantic/operations";
export async function notifyLocalAppDone(fill: AgentFormFill, entityId: string, row: Record<string, unknown> | null) {
  if (!fill.operationId) { notifyAgentPageDone(fill.mode); return; }
  const res = await fetch("/api/ask-ai/local-result/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ operationId: fill.operationId, entityId, record: row ? publicLocalApp(row) : null }) });
  const result = await res.json() as { error?: string; receipt?: Receipt };
  if (!res.ok || !result.receipt) throw new Error(result.error ?? "应用已保存，但助手回执未同步，请重试同步");
  notifyAgentPageDone(fill.mode, result.receipt);
}
