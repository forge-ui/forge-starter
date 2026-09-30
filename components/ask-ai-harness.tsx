"use client";

import { useState } from "react";
import { AgentTaskRows, ApprovalCard, Button, DescriptionItem, StatusBadge, TextField, ToolChips } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import type { AskAiHarnessRef, AskAiHarnessReply, AskAiHarnessState } from "@/lib/ask-ai";
import { askAiTaskStatus, isAgentTaskRow } from "@/lib/ask-ai-progress";

export type ReplyToHarness = (run: AskAiHarnessRef, reply: AskAiHarnessReply) => void;

const TOOL_KINDS = new Set(["tool", "tool-error", "verified"]);
/** Older runs stored a plain answer as a tool event with this label. */
const PLAIN_ANSWER_LABEL = "整理回答或请求选择";

/** Engine bookkeeping for every turn. Real queries and edits stay on ToolChips. */
const PIPELINE_TASKS = new Set([
  "检查可用能力与业务上下文",
  "分析当前请求",
  "分析工具结果与后续步骤",
  "校验工具调用",
  "整理回答",
]);

/** Every row comes from a server checkpoint, never from a model-written progress claim. */
export function AskAiTaskProgress({ state }: { state: AskAiHarnessState }) {
  const [expanded, setExpanded] = useState(false);
  const tasks = (state.tasks ?? []).filter(task => !PIPELINE_TASKS.has(task.title));
  if (!tasks.length) return null;
  const visible = expanded ? tasks : tasks.slice(-6);
  return (
    <section className="flex min-w-0 flex-col gap-3" aria-label="任务进度">
      {visible.filter(isAgentTaskRow).length ? <AgentTaskRows tasks={visible.filter(isAgentTaskRow)}
        className="[&_p.truncate]:whitespace-normal [&_p.truncate]:break-words [&_p.text-fg-grey-500]:text-fg-grey-700" /> : null}
      {visible.filter(task => !isAgentTaskRow(task)).map(task => (
        <DescriptionItem key={task.id} label={task.title} content={<StatusBadge {...askAiTaskStatus(task.status)} />} />
      ))}
      {tasks.length > 6 ? <div><Button size="sm" variant="tertiary" color={siteConfig.accent}
        onClick={() => setExpanded(value => !value)}>{expanded ? "收起早期步骤" : `查看全部 ${tasks.length} 个步骤`}</Button></div> : null}
    </section>
  );
}

/** Renders the shared protocol only; resource IDs and business forms stay in adapters. */
export function AskAiHarness({ state, disabled, onReply }: {
  state: AskAiHarnessState;
  disabled: boolean;
  onReply: ReplyToHarness;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [approvalAttempt, setApprovalAttempt] = useState(0);
  const pending = state.pending;
  const waiting = state.status === "waiting-user" || state.status === "waiting-external";
  const tools: Array<{ id: string; kind: "run" | "read"; label: string; chip: string }> = [];
  let messageCount = 0;
  let toolCallCount = 0;
  let turnStart = 0;
  state.events.forEach((event, index) => {
    if (event.kind === "understanding") turnStart = index;
  });
  state.events.slice(turnStart).forEach((event, index) => {
    const plainAnswer = event.kind === "message" || (event.kind === "tool" && event.label === PLAIN_ANSWER_LABEL);
    if (plainAnswer) {
      messageCount += 1;
      return;
    }
    if (!TOOL_KINDS.has(event.kind)) return;
    if (event.kind === "tool") toolCallCount += 1;
    tools.push({
      id: `${state.id}-tool-${index}`,
      kind: event.kind === "verified" ? "read" : "run",
      label: event.label,
      chip: event.kind === "tool-error" ? "未完成" : event.kind === "verified" ? "已核实" : "已调用",
    });
  });
  const chipSummary = messageCount > 0
    ? `${toolCallCount} 个工具调用，${messageCount} 条消息`
    : `${toolCallCount} 个工具调用`;
  function submitText() {
    if (!pending || disabled) return;
    if (!value.trim()) { setError("请输入名称、ID 或补充说明"); return; }
    if (value.trim().length > 2000) { setError("请控制在 2000 字以内"); return; }
    onReply(state, { interactionId: pending.id, text: value.trim() });
  }
  if (!tools.length && !waiting) return null;
  return (
    <section className="flex min-w-0 flex-col gap-3" aria-label="任务进度与下一步">
      {tools.length ? <ToolChips className="[&>button_svg]:transition-transform [&>button:last-child_svg]:-rotate-90" items={tools} summary={chipSummary} /> : null}
      {waiting && pending?.kind === "question" ? (
        <form className="flex min-w-0 flex-col gap-3" onSubmit={event => { event.preventDefault(); submitText(); }}>
          {!pending.multiple ? <h3 className="text-sm font-semibold text-fg-black">{pending.title}</h3> : null}
          {pending.multiple && pending.options.length ? <fieldset disabled={disabled} className="m-0 min-w-0 border-0 p-0 disabled:opacity-50">
            <ApprovalCard key={`${pending.id}-${approvalAttempt}`}
              questions={[{ id: pending.id, prompt: pending.title, type: "check", options: pending.options.map(option => ({ id: option.id, label: option.description ? `${option.label} · ${option.description}` : option.label })) }]}
              skipLabel="重新选择" continueLabel="继续" sendLabel="提交选择" sentLabel="已提交选择"
              onSubmitted={answers => {
                if (disabled) return;
                const optionIds = answers[pending.id] ?? [];
                if (!optionIds.length) { setError("请至少选择一项，也可以在下方补充说明"); setApprovalAttempt(value => value + 1); return; }
                setError(""); onReply(state, { interactionId: pending.id, optionIds });
              }} />
            {error ? <p role="alert" className="mt-2 text-sm text-fg-red">{error}</p> : null}
          </fieldset> : pending.options.length ? <div className="flex min-w-0 flex-col gap-1" role="group" aria-label="可选目标">
            {pending.options.map((option, index) => (
              <Button key={option.id} variant="tertiary" color={siteConfig.accent} disabled={disabled}
                title={option.description}
                className="!h-auto !min-h-10 w-full max-w-full !justify-start !rounded-lg !outline-transparent focus-visible:!outline-accent !bg-transparent !px-3 !py-2 !text-left !text-sm !font-normal !leading-5 !text-fg-black [&>span]:min-w-0 whitespace-normal hover:!bg-fg-grey-100 focus-visible:!bg-fg-grey-100"
                onClick={() => onReply(state, { interactionId: pending.id, optionId: option.id })}>
                <span className="flex min-w-0 flex-col text-left">
                  <span className="break-words text-sm font-normal leading-5 text-fg-black">{index + 1}. {option.label}</span>
                  <span className="break-all text-xs font-normal leading-4 text-fg-grey-700">ID：{option.id}</span>
                </span>
              </Button>
            ))}
          </div> : null}
          {pending.allowText ? <>
            <TextField color={siteConfig.accent} label={pending.options.length ? "或指定其他目标" : "补充说明"}
              placeholder="输入名称、ID 或补充说明" value={value} disabled={disabled}
              state={error ? "error" : undefined} errorMessage={error}
              onChange={next => { setValue(next); setError(""); }} />
            <div><Button color={siteConfig.accent} disabled={disabled} onClick={submitText}>按此内容继续</Button></div>
          </> : null}
        </form>
      ) : null}
      {waiting && pending ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs leading-5 text-fg-grey-700">{pending.kind === "external" ? "下一步：核对上方内容，在页面确认后继续。" : "选定目标后继续，也可以重新说明需求。"}</p>
          <Button variant="tertiary" color={siteConfig.accent} disabled={disabled}
            onClick={() => onReply(state, { interactionId: pending.id, cancel: true })}>取消任务</Button>
        </div>
      ) : null}
    </section>
  );
}
