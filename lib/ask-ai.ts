import type { AskAiRequest, AskAiResponse, AskAiSessionItem } from "@forge-ui-official/core";
import type { AgentBlock, AgentFormFill } from "@/lib/agent/types";
import { ASK_AI_FALLBACK_SUMMARY, type AskAiAccountSnapshot } from "@/lib/ask-ai-demos";
import type { AskAiModelOption, AskAiRuntimePublic, AskAiRuntimeSource } from "@/lib/ask-ai-types";

export {
  ASK_AI_DEMOS,
  ASK_AI_DEMO_SESSIONS,
  ASK_AI_SUGGESTIONS,
  matchAskAiDemo,
} from "@/lib/ask-ai-demos";
export { ASK_AI_ENV_MODEL_ID, type AskAiModelOption, type AskAiRuntimePublic, type AskAiRuntimeSource } from "@/lib/ask-ai-types";

export type AskAiRuntimeStatus = AskAiRuntimePublic;

export const ASK_AI_RUNTIME_EVENT = "forge-starter:ask-ai-runtime";
const ASK_AI_MODEL_STORAGE_KEY = "forge-starter:ask-ai-model";

export type AskAiClientResult = AskAiResponse & {
  live: boolean;
  model?: string;
  failed?: boolean;
  snapshot?: AskAiAccountSnapshot;
  blocks?: AgentBlock[];
  fill?: AgentFormFill;
};

export type AskAiTurn = {
  id: string;
  question: string;
  pending: boolean;
  result: AskAiClientResult | null;
};

export const ASK_AI_PLACEHOLDER = "问数据、填账号、导出，或点一条示范问题";

export const ASK_AI_LANDING_TITLE = "先问这几件？";

export function createAskAiSession(title = "新对话"): AskAiSessionItem {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `ask-${Date.now()}`;
  return { id, title };
}

export function titleAskAiSession(title: string) {
  const next = title.trim().replace(/\s+/g, " ");
  return next.slice(0, 24) || "新对话";
}

export function filterAskAiSessions(sessions: AskAiSessionItem[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return sessions;
  return sessions.filter((item) => item.title.toLowerCase().includes(needle));
}

export function askAiLandingCopy(status: AskAiRuntimeStatus | null) {
  if (!status) return "正在确认可用模型…";
  if (status.configured) {
    const title = status.name || status.model || "已接模型";
    const model = status.model && status.name && status.model !== status.name ? `（${status.model}）` : "";
    return `已接「${title}」${model}。可以问账号、角色和权限。写入会先填进页面表单，由页面自己的保存按钮处理。`;
  }
  return ASK_AI_FALLBACK_SUMMARY;
}

export function askAiStatusLabel(input: {
  live?: boolean;
  failed?: boolean;
  pending?: boolean;
  landing?: boolean;
  model?: string;
  snapshotReady?: boolean;
  runtime?: AskAiRuntimeStatus | null;
}) {
  const model = input.model || input.runtime?.model;
  if (input.pending) return model ? `${model} · 正在提问` : "正在提问";
  if (input.failed) return model ? `模型报错 · ${model}` : "模型报错";
  if (input.live || (input.landing && input.runtime?.configured)) {
    const name = model || input.runtime?.name || "模型";
    if (input.snapshotReady) return `${name} · 已读账号表`;
    return `${name} · 已接模型`;
  }
  if (input.snapshotReady) return "本地规则 · 已读账号表";
  return "本地规则 · 未接模型";
}

export function notifyAskAiRuntimeChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ASK_AI_RUNTIME_EVENT));
}

export function readStoredAskAiModelId() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ASK_AI_MODEL_STORAGE_KEY)?.trim() || "";
}

export function writeStoredAskAiModelId(id: string) {
  if (typeof window === "undefined") return;
  if (!id) {
    window.localStorage.removeItem(ASK_AI_MODEL_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(ASK_AI_MODEL_STORAGE_KEY, id);
}

export function pickAskAiModelId(current: string, runtime: AskAiRuntimeStatus) {
  const ids = runtime.models.map((item) => item.id);
  if (current && ids.includes(current)) return current;
  const stored = readStoredAskAiModelId();
  if (stored && ids.includes(stored)) return stored;
  return runtime.selectedId || ids[0] || "";
}

export function askAiPromptModels(runtime: AskAiRuntimeStatus | null) {
  return runtime?.models.map((item) => ({ id: item.id, label: item.label })) ?? [];
}

function emptyRuntime(): AskAiRuntimeStatus {
  return { configured: false, source: "none", models: [] };
}

export async function fetchAskAiRuntime(): Promise<AskAiRuntimeStatus> {
  const response = await fetch("/api/ask-ai/");
  const payload = (await response.json().catch(() => null)) as
    | (Partial<AskAiRuntimePublic> & { ok?: boolean })
    | null;
  if (!response.ok || !payload?.ok) {
    return emptyRuntime();
  }
  const source: AskAiRuntimeSource =
    payload.source === "model" || payload.source === "env" ? payload.source : "none";
  const models = Array.isArray(payload.models) ? payload.models.filter(isAskAiModelOption) : [];
  return {
    configured: Boolean(payload.configured) && source !== "none" && models.length > 0,
    source,
    selectedId: typeof payload.selectedId === "string" ? payload.selectedId : models[0]?.id,
    model: payload.model,
    name: payload.name,
    provider: payload.provider,
    models,
  };
}

function isAskAiModelOption(value: unknown): value is AskAiModelOption {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<AskAiModelOption>;
  return Boolean(item.id && item.label);
}

function isAgentFormFill(value: unknown): value is AgentFormFill {
  if (!value || typeof value !== "object") return false;
  const fill = value as Record<string, unknown>;
  return (
    fill.formId === "accounts"
    && (fill.mode === "create" || fill.mode === "edit" || fill.mode === "delete")
    && typeof fill.href === "string"
    && Boolean(fill.fields)
    && typeof fill.fields === "object"
  );
}

function isAgentBlock(value: unknown): value is AgentBlock {
  if (!value || typeof value !== "object") return false;
  const block = value as Record<string, unknown>;
  if (block.type === "confirm") {
    return typeof block.intent === "string" && typeof block.title === "string" && typeof block.body === "string";
  }
  if (block.type === "download") {
    return typeof block.href === "string" && typeof block.label === "string" && typeof block.filename === "string";
  }
  if (block.type === "table") {
    return typeof block.title === "string" && Array.isArray(block.columns) && Array.isArray(block.rows);
  }
  return false;
}

function historyPayload(history?: Array<{ role: "user" | "assistant"; content: string }>) {
  return (history ?? [])
    .slice(-8)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 2000),
    }))
    .filter((item) => item.content.length > 0);
}

/** 走 /api/ask-ai。`modelId` 对应模型管理里启用的条目；没传则用默认模型，再退 ASK_AI_LLM_*。 */
export async function sendAskAi(
  question: string,
  request: AskAiRequest,
  modelId?: string,
  history?: Array<{ role: "user" | "assistant"; content: string }>,
  context?: string,
): Promise<AskAiClientResult> {
  const response = await fetch("/api/ask-ai/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      context,
      modelId: modelId || undefined,
      history: historyPayload(history),
    }),
    signal: request.signal,
  });
  const payload = (await response.json().catch(() => null)) as
    | {
        ok?: boolean;
        error?: string;
        text?: string;
        live?: boolean;
        model?: string;
        snapshot?: AskAiAccountSnapshot;
        links?: Array<{ label: string; href: string }>;
        blocks?: unknown[];
      }
    | null;
  if (!response.ok || !payload?.ok || !payload.text?.trim()) {
    throw new Error(payload?.error || ASK_AI_FALLBACK_SUMMARY);
  }
  return {
    text: payload.text,
    links: payload.links,
    live: Boolean(payload.live),
    model: payload.model,
    snapshot: payload.snapshot,
    blocks: Array.isArray(payload.blocks) ? payload.blocks.filter(isAgentBlock) : [],
  };
}

export async function confirmAskAi(intent: string): Promise<AskAiClientResult> {
  const response = await fetch("/api/ask-ai/confirm/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intent }),
  });
  const payload = (await response.json().catch(() => null)) as
    | {
        ok?: boolean;
        error?: string;
        text?: string;
        live?: boolean;
        blocks?: unknown[];
        fill?: unknown;
      }
    | null;
  if (!response.ok || !payload?.ok || !payload.text?.trim()) {
    throw new Error(payload?.error || "无法打开页面表单");
  }
  return {
    text: payload.text,
    live: Boolean(payload.live),
    blocks: Array.isArray(payload.blocks) ? payload.blocks.filter(isAgentBlock) : [],
    fill: isAgentFormFill(payload.fill) ? payload.fill : undefined,
  };
}

/** @deprecated 用 sendAskAi */
export const sendAskAiDemo = sendAskAi;
