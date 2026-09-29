import { presentationBlockSchema } from "./agent/presentation";
import { isChoiceBlock } from "@/lib/agent/intent-policy";
import { agentFormBlockSchema } from "@/lib/agent/forms";
import type { PageContext } from "@/lib/semantic/context";
import { parseAgentNavigation, type AgentNavigation } from "@/lib/agent/navigation";
import type { AskAiRequest, AskAiResponse, AskAiSessionItem } from "@forge-ui-official/core";
import type { AgentBlock, AgentFormFill } from "@/lib/agent/types";
import { ASK_AI_FALLBACK_SUMMARY, type AskAiAccountSnapshot } from "@/lib/ask-ai-demos";
import type { AskAiModelOption, AskAiRuntimePublic, AskAiRuntimeSource } from "@/lib/ask-ai-types";
import type { Input, Interaction, RunStatus } from "@/lib/harness/types";

export {
  ASK_AI_DEMOS,
  ASK_AI_DEMO_SESSIONS,
  ASK_AI_SUGGESTIONS,
  matchAskAiDemo,
} from "@/lib/ask-ai-demos";
export { ASK_AI_ENV_MODEL_ID, type AskAiModelOption, type AskAiRuntimePublic, type AskAiRuntimeSource } from "@/lib/ask-ai-types";

export type AskAiRuntimeStatus = AskAiRuntimePublic;

export type AskAiHarnessReply = NonNullable<Input["reply"]>;
export type AskAiHarnessRef = { id: string; revision: number };
export type AskAiHarnessState = AskAiHarnessRef & {
  status: RunStatus;
  pending?: Interaction;
  events: Array<{ kind: string; label: string; at: string }>;
};
export type AskAiHarnessRequest = {
  requestId: string;
  runId?: string;
  expectedRevision?: number;
  reply?: AskAiHarnessReply;
};
export type AskAiSavedRun = AskAiHarnessState & { title: string; turns: AskAiTurn[] };
export class AskAiRequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export const ASK_AI_RUNTIME_EVENT = "forge-starter:ask-ai-runtime";
const ASK_AI_MODEL_STORAGE_KEY = "forge-starter:ask-ai-model";

export type AskAiClientResult = AskAiResponse & {
  navigation?: AgentNavigation;
  live: boolean;
  model?: string;
  failed?: boolean;
  snapshot?: AskAiAccountSnapshot;
  blocks?: AgentBlock[];
  fill?: AgentFormFill;
  harness?: AskAiHarnessState;
};

export type AskAiTurn = {
  id: string;
  question: string;
  pending: boolean;
  result: AskAiClientResult | null;
};

export const ASK_AI_PLACEHOLDER = "说出目标，例如：查找账号、分析权限或导出数据";

export const ASK_AI_LANDING_TITLE = "说出要查询或操作的目标";

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
  if (status.suggestions?.length === 0) return "当前页面暂无快捷建议，可以直接描述你要了解或处理的目标。";
  if (status.configured) {
    const title = status.name || status.model || "已接模型";
    const model = status.model && status.name && status.model !== status.name ? `（${status.model}）` : "";
    return `已接「${title}」${model}。说出要查询或操作的目标，写入前会请你确认。`;
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
  error?: string;
}) {
  const model = input.model || input.runtime?.model;
  if (input.pending) return model ? `${model} · 正在提问` : "正在提问";
  if (input.failed) {
    if (input.error?.includes("未登录")) return "未登录";
    return model ? `模型报错 · ${model}` : "模型报错";
  }
  if (input.live || (input.landing && input.runtime?.configured)) {
    const name = model || input.runtime?.name || "模型";
    if (input.snapshotReady) return `${name} · 已读账号表`;
    return `${name} · 已接模型`;
  }
  if (input.runtime?.configured) return "应用工具 · 本轮无需调用模型";
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

export async function fetchAskAiRuntime(page?: string): Promise<AskAiRuntimeStatus> {
  const response = await fetch(`/api/ask-ai/${page ? `?${new URLSearchParams({ page })}` : ""}`);
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
    suggestions: Array.isArray(payload.suggestions)
      ? payload.suggestions.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map(item => item.trim()).slice(0, 4)
      : undefined,
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
    typeof fill.formId === "string"
    && (["create", "edit", "delete", "open", "filter"].includes(String(fill.mode)))
    && typeof fill.href === "string"
    && Boolean(fill.fields)
    && typeof fill.fields === "object"
  );
}

function isAgentBlock(value: unknown): value is AgentBlock {
  if (!value || typeof value !== "object") return false;
  const block = value as Record<string, unknown>;
  if (presentationBlockSchema.safeParse(block).success) return true;
  if (block.type === "choice") return isChoiceBlock(value);
  if (block.type === "form") return agentFormBlockSchema.safeParse(block).success;
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

function parseHarness(value: unknown): AskAiHarnessState | undefined {
  if (!value || typeof value !== "object") return;
  const state = value as Record<string, unknown>;
  if (typeof state.id !== "string" || !Number.isInteger(state.revision)
    || !["running", "waiting-user", "waiting-external", "completed", "cancelled", "failed"].includes(String(state.status))) return;
  const pending = state.pending as Interaction | undefined;
  const validPending = pending && typeof pending.id === "string" && typeof pending.title === "string"
    && ["question", "external"].includes(pending.kind) && typeof pending.allowText === "boolean"
    && (pending.multiple === undefined || typeof pending.multiple === "boolean")
    && Array.isArray(pending.options) && pending.options.every(option => typeof option.id === "string" && typeof option.label === "string");
  return {
    id: state.id,
    revision: state.revision as number,
    status: state.status as RunStatus,
    pending: validPending ? pending : undefined,
    events: Array.isArray(state.events) ? state.events.filter((event): event is AskAiHarnessState["events"][number] =>
      Boolean(event && typeof event === "object" && typeof event.kind === "string" && typeof event.label === "string" && typeof event.at === "string")) : [],
  };
}

function parseResult(payload: Record<string, unknown>): AskAiClientResult {
  return {
    text: typeof payload.text === "string" ? payload.text : "",
    navigation: parseAgentNavigation(payload.navigation),
    links: Array.isArray(payload.links) ? payload.links.filter((link): link is { label: string; href: string } =>
      Boolean(link && typeof link.label === "string" && typeof link.href === "string" && link.href.startsWith("/") && !link.href.startsWith("//"))) : undefined,
    live: Boolean(payload.live),
    model: typeof payload.model === "string" ? payload.model : undefined,
    failed: payload.failed === true,
    snapshot: payload.snapshot as AskAiAccountSnapshot | undefined,
    blocks: Array.isArray(payload.blocks) ? payload.blocks.filter(isAgentBlock) : [],
    fill: isAgentFormFill(payload.fill) ? payload.fill : undefined,
    harness: parseHarness(payload.harness),
  };
}

/** Restore server checkpoints; historical page effects must never be replayed. */
export async function fetchAskAiRuns(): Promise<AskAiSavedRun[]> {
  const response = await fetch("/api/ask-ai/runs/", { cache: "no-store" });
  const payload = await response.json().catch(() => null) as { ok?: boolean; error?: string; runs?: unknown[] } | null;
  if (!response.ok || !payload?.ok || !Array.isArray(payload.runs)) {
    throw new AskAiRequestError(payload?.error || "会话恢复失败，请重试", response.status);
  }
  return payload.runs.flatMap(value => {
    if (!value || typeof value !== "object") return [];
    const run = value as Record<string, unknown>;
    const harness = parseHarness(run);
    if (!harness || !Array.isArray(run.exchanges)) return [];
    const exchanges = run.exchanges as Array<{ id?: string; question?: string; output?: { text?: string; data?: Record<string, unknown> } }>;
    const turns = exchanges.filter(exchange => typeof exchange.id === "string" && typeof exchange.question === "string" && exchange.output).map((exchange, index, list): AskAiTurn => ({
      id: exchange.id!, question: exchange.question!, pending: false,
      result: parseResult({ ...exchange.output!.data, text: exchange.output!.text ?? "", ...(index === list.length - 1 ? { harness } : {}) }),
    }));
    return [{ ...harness, title: typeof run.title === "string" ? run.title : "恢复的对话", turns }];
  });
}

/** 走 /api/ask-ai。`modelId` 对应模型管理里启用的条目；没传则用默认模型，再退 ASK_AI_LLM_*。 */
export async function sendAskAi(
  question: string,
  request: AskAiRequest,
  modelId?: string,
  history?: Array<{ role: "user" | "assistant"; content: string }>,
  context?: string,
  page?: PageContext,
  continuationOperationId?: string,
  harness?: AskAiHarnessRequest,
): Promise<AskAiClientResult> {
  const response = await fetch("/api/ask-ai/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      context,
      page,
      continuationOperationId,
      harness,
      modelId: modelId || undefined,
      history: historyPayload(history),
    }),
    signal: request.signal,
  });
  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok || !payload?.ok || typeof payload.text !== "string") {
    throw new AskAiRequestError(typeof payload?.error === "string" ? payload.error : ASK_AI_FALLBACK_SUMMARY, response.status);
  }
  return parseResult(payload);
}

export async function confirmAskAi(intent: string, page?: PageContext): Promise<AskAiClientResult> {
  const response = await fetch("/api/ask-ai/confirm/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intent, page }),
  });
  const payload = (await response.json().catch(() => null)) as
    | {
        ok?: boolean;
        error?: string;
        text?: string;
        live?: boolean;
        blocks?: unknown[];
        fill?: unknown;
        harness?: unknown;
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
    harness: parseHarness(payload.harness),
  };
}

/** @deprecated 用 sendAskAi */
export const sendAskAiDemo = sendAskAi;
