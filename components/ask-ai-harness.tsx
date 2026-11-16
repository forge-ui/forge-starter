"use client";

import { Button, type ThinkingRow } from "@forge-ui-official/core";
import { ChoiceCard } from "@forge-ui-official/agent";
import { siteConfig } from "@/config/site";
import type { AskAiHarnessRef, AskAiHarnessReply, AskAiHarnessState } from "@/lib/ask-ai";

export type ReplyToHarness = (run: AskAiHarnessRef, reply: AskAiHarnessReply) => void;

const TOOL_KINDS = new Set(["tool", "tool-error", "verified"]);
/** Older runs stored a plain answer as a tool event with this label. */
const PLAIN_ANSWER_LABEL = "整理回答或请求选择";
/** The answer body already shows these. The trace keeps the work that led there. */
const TRACE_SKIP = new Set(["understanding", "message", "completed"]);

export type AskAiToolReceipt = {
  summary: string;
  items: Array<{ id: string; kind: "run" | "read"; label: string; chip: string }>;
};

function turnEvents(state: AskAiHarnessState) {
  let turnStart = 0;
  state.events.forEach((event, index) => {
    if (event.kind === "understanding") turnStart = index;
  });
  return state.events.slice(turnStart);
}

/** Steps for ThinkingTrace. No synthetic row is added for plain answers. */
export function askAiTraceRows(state: AskAiHarnessState | undefined): ThinkingRow[] {
  if (!state) return [];
  const rows = turnEvents(state)
    .filter(event => !TRACE_SKIP.has(event.kind) && !TOOL_KINDS.has(event.kind) && event.label !== PLAIN_ANSWER_LABEL)
    .map(event => ({ primary: event.label }));
  return rows;
}

/** Real tool calls for ToolChips. Plain answers are not calls. */
export function askAiToolReceipt(state: AskAiHarnessState | undefined): AskAiToolReceipt | null {
  if (!state) return null;
  const items: AskAiToolReceipt["items"] = [];
  let messageCount = 0;
  let toolCallCount = 0;
  turnEvents(state).forEach((event, index) => {
    if (event.kind === "presentation" || event.label === "整理交互内容") return;
    const plainAnswer = event.label === "整理回答或请求选择" || event.kind === "message" || (event.kind === "tool" && event.label === PLAIN_ANSWER_LABEL);
    if (plainAnswer) {
      messageCount += 1;
      return;
    }
    if (!TOOL_KINDS.has(event.kind)) return;
    if (event.kind === "tool") toolCallCount += 1;
    items.push({
      id: `${state.id}-tool-${index}`,
      kind: event.kind === "verified" ? "read" : "run",
      label: event.label,
      chip: event.kind === "tool-error" ? "未完成" : event.kind === "verified" ? "已核实" : "已调用",
    });
  });
  if (!items.length) return null;
  return {
    items,
    summary: messageCount > 0 ? `${toolCallCount} 个工具调用，${messageCount} 条消息` : `${toolCallCount} 个工具调用`,
  };
}

/** Renders the shared protocol only; resource IDs and business forms stay in adapters. */
export function AskAiHarness({ state, disabled, onReply }: {
  state: AskAiHarnessState;
  disabled: boolean;
  onReply: ReplyToHarness;
}) {
  const pending = state.pending;
  const waiting = state.status === "waiting-user" || state.status === "waiting-external";
  if (!waiting || !pending) return null;
  const cancel = () => onReply(state, { interactionId: pending.id, cancel: true });
  if (pending.kind === "question") {
    return (
      <ChoiceCard
        title={pending.title}
        options={pending.options.map(option => ({ id: option.id, label: option.label, description: option.description ? `${option.description} · ID：${option.id}` : `ID：${option.id}` }))}
        multiple={pending.multiple}
        allowText={pending.allowText}
        disabled={disabled}
        onAnswer={answer => onReply(state, { interactionId: pending.id, ...("text" in answer ? { text: answer.text.slice(0, 2000) } : answer) })}
        onCancel={cancel}
      />
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs leading-5 text-fg-grey-700">下一步：核对上方内容，在页面确认后继续。</p>
      <Button variant="tertiary" size="sm" color={siteConfig.accent} disabled={disabled} onClick={cancel}>取消任务</Button>
    </div>
  );
}
