"use client";

import { useId, useState } from "react";
import { AgentTaskRows, ApprovalCard, Button, StatusBadge, TextField, ThinkingTrace, ToolChips } from "@forge-ui-official/core";
import { AltArrowDownLinear } from "solar-icon-set";
import { siteConfig } from "@/config/site";
import type { AskAiHarnessRef, AskAiHarnessReply, AskAiHarnessState } from "@/lib/ask-ai";

export type ReplyToHarness = (run: AskAiHarnessRef, reply: AskAiHarnessReply) => void;

const statusLabel = {
  running: "处理中", "waiting-user": "等你选择", "waiting-external": "待页面确认",
  completed: "已完成", cancelled: "已取消", failed: "处理失败",
} as const;

/** Renders the shared protocol only; resource IDs and business forms stay in adapters. */
export function AskAiHarness({ state, disabled, onReply }: {
  state: AskAiHarnessState;
  disabled: boolean;
  onReply: ReplyToHarness;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [traceOpen, setTraceOpen] = useState(false);
  const traceId = useId();
  const [approvalAttempt, setApprovalAttempt] = useState(0);
  const pending = state.pending;
  const waiting = state.status === "waiting-user" || state.status === "waiting-external";
  function submitText() {
    if (!pending || disabled) return;
    if (!value.trim()) { setError("请输入名称、ID 或补充说明"); return; }
    if (value.trim().length > 2000) { setError("请控制在 2000 字以内"); return; }
    onReply(state, { interactionId: pending.id, text: value.trim() });
  }
  return (
    <section className="flex min-w-0 flex-col gap-3" aria-label="任务进度与下一步">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-fg-grey-700">本次任务</span>
        <StatusBadge label={statusLabel[state.status]} color={state.status === "failed" ? "red" : state.status === "completed" ? "green" : state.status === "cancelled" ? "grey" : state.status === "running" ? "blue" : "yellow"} />
        {state.events.length > 0 ? (
          <Button variant="tertiary" size="sm" color={siteConfig.accent}
            aria-expanded={traceOpen} aria-controls={traceId}
            className="!h-auto !min-h-7 !rounded-lg !px-1.5 !py-1 !font-medium !text-fg-grey-700 !outline-transparent hover:!bg-fg-grey-100 focus-visible:!outline-accent"
            onClick={() => setTraceOpen(open => !open)}>
            <span className="flex items-center gap-1">
              处理记录
              <span aria-hidden="true" className={traceOpen ? "rotate-180" : ""}>
                <AltArrowDownLinear size={12} color="var(--fg-grey-700)" />
              </span>
            </span>
          </Button>
        ) : null}
      </div>
      <div id={traceId} hidden={!traceOpen}>
        {traceOpen && state.events.length > 0 ? (
          <div className="flex min-w-0 flex-col gap-3">
            <ThinkingTrace variant="steps"
              rows={state.events.slice(-3).map(event => ({ primary: event.label }))}
              settled play={false} className="[&>button]:hidden" />
            <AgentTaskRows variant="list" tasks={[{ id: state.id, title: "本次任务", status: state.status === "completed" ? "completed" : state.status === "failed" || state.status === "cancelled" ? "failed" : "running", meta: statusLabel[state.status] }]} />
            <ToolChips items={state.events.filter(event => event.kind === "tool" || event.kind === "tool-error" || event.kind === "verified").map((event, index) => ({ id: `${state.id}-${index}`, kind: event.kind === "tool" ? "run" : "read", label: event.label, chip: event.kind === "tool-error" ? "未完成" : event.kind === "verified" ? "已核实" : "调用记录", detail: [{ text: event.label }] }))} summary="实际任务记录；调用记录不代表写入成功" />
          </div>
        ) : null}
      </div>
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
