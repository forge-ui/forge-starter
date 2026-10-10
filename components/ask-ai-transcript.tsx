"use client";

import { AskAiPresentation } from "./ask-ai-presentation";
import { isPresentationBlock } from "@/lib/agent/presentation";
import { AskAiForm, type ConfirmFormIntent } from "./ask-ai-form";
import { AskAiHarness, askAiToolReceipt, type ReplyToHarness } from "./ask-ai-harness";
import { useState } from "react";
import { isAgentTaskRow } from "@/lib/ask-ai-progress";
import { useRouter } from "next/navigation";
import {
  AgentDiffTable,
  AgentFlowchart,
  AgentTaskRows,
  Button,
  CellText,
  ChatBubble,
  CommandSearch,
  DataTable,
  Grid,
  GridItem,
  InsightCards,
  RecommendationCard,
  StreamingAnswer,
  ToolChips,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import type { AgentBlock, AgentDownloadBlock } from "@/lib/agent/types";
import {
  ASK_AI_DEMOS,
  ASK_AI_FALLBACK_SUMMARY,
  matchAskAiDemo,
  type AskAiDemo,
  type AskAiDemoId,
} from "@/lib/ask-ai-demos";
import type { AskAiAccountSnapshot } from "@/lib/ask-ai-demos";
import {
  askAiDeliveryPlaying,
  askAiDeliverySettled,
  askAiLandingCopy,
  bindAskAiAnswer,
  type AskAiRuntimeStatus,
  type AskAiTextDelivery,
  type AskAiTurn,
} from "@/lib/ask-ai";
import { toast } from "@/lib/toast";

function suggestionDemos(id?: AskAiDemoId): AskAiDemo[] {
  return ASK_AI_DEMOS.filter((demo) => demo.id !== id);
}

export function AskAiTranscript({
  turns,
  runtime,
  landing,
  spentIntents,
  confirmingIntent,
  onAsk,
  onConfirm,
  onReply,
  onPresented,
  busy = false,
}: {
  turns: AskAiTurn[];
  runtime?: AskAiRuntimeStatus | null;
  landing?: boolean;
  spentIntents: string[];
  confirmingIntent: string | null;
  onAsk: (text: string) => void;
  onConfirm: ConfirmFormIntent;
  onReply?: ReplyToHarness;
  onPresented?: (turnId: string) => void;
  busy?: boolean;
}) {
  const suggestions = suggestionDemos();

  return (
    <div className="flex flex-col gap-5 p-5">
      {landing ? (
        <p className="text-sm leading-6 text-fg-black">你好</p>
      ) : null}
      {landing ? (
        <div className="flex flex-col gap-5">
          <StreamingAnswer sourcesLabel="来源" followUpsLabel="后续问题" {...bindAskAiAnswer(askAiLandingCopy(runtime ?? null))} />
          <SuggestionPrompts items={suggestions} onAsk={onAsk} />
        </div>
      ) : (
        turns.map((turn, index) => (
          <AskAiTurnView
            key={turn.id}
            turn={turn}
            latest={index === turns.length - 1}
            spentIntents={spentIntents}
            confirmingIntent={confirmingIntent}
            onAsk={onAsk}
            onConfirm={onConfirm}
            onReply={onReply}
            onPresented={onPresented}
            busy={busy}
          />
        ))
      )}
    </div>
  );
}

function AskAiTurnView({
  turn,
  latest,
  spentIntents,
  confirmingIntent,
  onAsk,
  onConfirm,
  onReply,
  onPresented,
  busy,
}: {
  turn: AskAiTurn;
  latest: boolean;
  spentIntents: string[];
  confirmingIntent: string | null;
  onAsk: (text: string) => void;
  onConfirm: ConfirmFormIntent;
  onReply?: ReplyToHarness;
  onPresented?: (turnId: string) => void;
  busy: boolean;
}) {
  const router = useRouter();
  const result = turn.result;
  const demo = result && !result.live && !result.failed ? matchAskAiDemo(turn.question) : null;
  const delivery = turn.delivery ?? { mode: "static" as const };
  const playing = askAiDeliveryPlaying(turn.delivery);
  const chromeReady = askAiDeliverySettled(turn.delivery);
  const followUpsDisabled = !latest || busy || Boolean(turn.pending) || playing || confirmingIntent !== null;
  const choicePrompt = result?.blocks?.some((block) => block.type === "choice" && block.title === "选择目标")
    ? "请选择目标，也可以输入序号、名称或 ID。未显示的记录可直接按名称或 ID 查找。"
    : null;
  const answer = assistantAnswer(turn, choicePrompt);
  const waitingOnTrace = Boolean(turn.pending) && !result?.text;
  const receipt = askAiToolReceipt(turn.progress ?? result?.harness);
  const businessTasks = (turn.progress ?? result?.harness)?.tasks?.filter(isAgentTaskRow) ?? [];
  const showAnswer = Boolean(answer.text) && !waitingOnTrace && !(latest && result?.harness?.pending?.kind === "question");

  return (
    <div className="flex flex-col gap-5" data-ask-ai-turn={turn.id} data-ask-ai-delivery={answer.kind === "answer" ? answer.delivery.mode : "prompt"} data-ask-ai-chrome={chromeReady ? "ready" : "waiting"}>
      <ChatBubble type="sent" color={siteConfig.accent} className="w-full" content={turn.question} />
      {waitingOnTrace ? <p role="status" className="text-sm text-fg-grey-700">正在回复…</p> : null}
      {businessTasks.length > 1 ? <AgentTaskRows statusLabels={{ running: "进行中", failed: "失败", completed: "已完成" }} tasks={businessTasks} /> : null}
      {receipt ? <ToolChips className="[&>button_svg]:transition-transform [&>button:last-child_svg]:-rotate-90" items={receipt.items} summary={receipt.summary} /> : null}
      {showAnswer ? (
        answer.kind === "prompt" ? (
          <p className="text-[15px] leading-7 text-fg-black">{answer.text}</p>
        ) : (
          <AskAiAnswerText turnId={turn.id} text={answer.text} delivery={answer.delivery} onPresented={onPresented} />
        )
      ) : null}
      {latest && delivery.mode === "stopped" && answer.kind === "answer" ? (
        <p className="text-xs text-fg-grey-700">已停止</p>
      ) : null}
      {result?.links?.length ? <div className="flex flex-wrap gap-2">{result.links.map(link => <Button key={link.href} variant="secondary" color={siteConfig.accent} onClick={() => router.push(link.href)}>{link.label}</Button>)}</div> : null}
      {result?.blocks?.filter(block => block.type !== "choice" && !(latest && result.harness?.pending?.kind === "question" && block.type === "table")).map((block, index) => (
        !latest && (block.type === "form" || block.type === "confirm") ? <p key={`closed-${index}`} className="text-sm text-fg-grey-700">此轮操作已结束，请按最新请求继续。</p> :
        <AgentBlockView
          key={`${turn.id}-${block.type}-${index}`}
          block={block}
          disabled={followUpsDisabled}
          onAsk={onAsk}
          question={turn.question}
          draftKey={`${turn.id}-${index}`}
          spent={block.type === "confirm" && spentIntents.includes(block.intent)}
          confirming={block.type === "confirm" && confirmingIntent === block.intent}
          onConfirm={onConfirm}
          onCancel={latest && result?.harness?.pending && onReply ? () => onReply(result.harness!, { interactionId: result.harness!.pending!.id, cancel: true }) : undefined}
        />
      ))}
      {latest && result?.harness && onReply && (chromeReady || result.harness.pending) ? <AskAiHarness key={result.harness.pending?.id ?? `${result.harness.id}-${result.harness.revision}`} state={result.harness} disabled={busy || turn.pending || playing || confirmingIntent !== null} onReply={onReply} /> : null}
      {latest && demo?.id === "page" ? <PageExtras onAsk={onAsk} /> : null}
      {latest && demo?.id === "next" ? <NextExtras onAsk={onAsk} snapshot={result?.snapshot} /> : null}
      {latest && demo?.id === "status" ? <StatusExtras onAsk={onAsk} snapshot={result?.snapshot} /> : null}
      {latest && demo?.id === "rbac" ? <RbacExtras /> : null}
      {chromeReady ? result?.blocks?.filter(block => block.type === "choice" && (latest || block.title !== "接下来可以")).map((block, index) => {
        if (block.type !== "choice") return null;
        const options = [...new Map(block.options.map(option => [option.question, option])).values()];
        if (!options.length) return null;
        return (
          <fieldset key={`choice-${index}`} aria-label={block.title} disabled={followUpsDisabled}
            className="m-0 min-w-0 border-0 p-0 disabled:opacity-50">
            <StreamingAnswer sourcesLabel="来源"
              text=""
              followUpsLabel={block.title}
              followUps={options.map(option => option.label)}
              onFollowUp={(_, optionIndex) => {
                const option = options[optionIndex];
                if (!followUpsDisabled && option) onAsk(option.question);
              }}
              className="[&>p:empty]:hidden"
            />
          </fieldset>
        );
      }) : null}
    </div>
  );
}

function assistantAnswer(turn: AskAiTurn, choicePrompt: string | null): {
  text: string;
  delivery: AskAiTextDelivery;
  kind: "prompt" | "answer";
} {
  if (turn.pending) return { text: "正在处理…", delivery: { mode: "static" }, kind: "prompt" };
  if (choicePrompt) return { text: choicePrompt, delivery: { mode: "static" }, kind: "prompt" };
  const received = turn.result?.text ?? "";
  if (turn.delivery?.mode === "stopped" && !received.trim()) {
    return { text: "已停止", delivery: { mode: "static" }, kind: "prompt" };
  }
  return {
    text: received || ASK_AI_FALLBACK_SUMMARY,
    delivery: turn.delivery ?? { mode: "static" },
    kind: "answer",
  };
}

function AskAiAnswerText({
  turnId,
  text,
  delivery,
  onPresented,
}: {
  turnId: string;
  text: string;
  delivery: AskAiTextDelivery;
  onPresented?: (turnId: string) => void;
}) {
  const notify = delivery.mode === "replay" || (delivery.mode === "incremental" && delivery.status === "complete");
  return (
    <StreamingAnswer sourcesLabel="来源" followUpsLabel="后续问题"
      key={turnId}
      {...bindAskAiAnswer(text, delivery)}
      onDone={notify && onPresented ? () => onPresented(turnId) : undefined}
    />
  );
}

function AgentBlockView({
  block,
  question,
  draftKey,
  disabled,
  onAsk,
  spent,
  confirming,
  onConfirm,
  onCancel,
}: {
  block: AgentBlock;
  disabled: boolean;
  onAsk: (question: string) => void;
  question: string;
  draftKey: string;
  spent: boolean;
  confirming: boolean;
  onConfirm: ConfirmFormIntent;
  onCancel?: () => void;
}) {
  if (isPresentationBlock(block)) return <AskAiPresentation block={block} storageKey={draftKey} disabled={disabled} onAsk={onAsk} />;
  if (block.type === "choice") return null;
  if (block.type === "form") return <AskAiForm block={block} draftKey={draftKey} question={question} disabled={disabled} onConfirm={onConfirm} onCancel={onCancel} />;
  if (block.type === "table") {
    return (
      <DataTable<Record<string, string>>
        color={siteConfig.accent}
        title={block.title}
        columns={block.columns.map((column, index) => ({
          key: column.key,
          header: column.label,
          width: index === 0 ? "28%" : `${Math.max(12, Math.floor(72 / Math.max(block.columns.length - 1, 1)))}%`,
          render: (row) => <CellText>{row[column.key] || "—"}</CellText>,
        }))}
        rows={block.rows}
        getRowKey={(row, index) => row.id || `${block.title}-${index}`}
        emptyState={<p className="py-6 text-center text-sm text-fg-grey-500">没有匹配的数据</p>}
        tableMinWidth={520}
      />
    );
  }
  if (block.type === "confirm") {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-fg-black">{block.title}</p>
        <p className="whitespace-pre-wrap text-sm leading-6 text-fg-grey-700">{block.body}</p>
        <div>
          <Button
            color={siteConfig.accent}
            disabled={disabled || spent || confirming}
            onClick={() => { if (!disabled && !spent && !confirming) void onConfirm(block.intent); }}
          >
            {spent ? "已填入" : confirming ? "正在打开页面…" : block.actionLabel || "填入页面表单"}
          </Button>
        </div>
      </div>
    );
  }
  return <DownloadBlock block={block} />;
}

function DownloadBlock({ block }: { block: AgentDownloadBlock }) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <Button
        color={siteConfig.accent}
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void saveDownload(block).finally(() => setBusy(false));
        }}
      >
        {busy ? "正在下载…" : block.label}
      </Button>
    </div>
  );
}

async function saveDownload(block: AgentDownloadBlock) {
  try {
    const response = await fetch(block.href);
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error || "导出失败");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = block.filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "导出失败");
  }
}

function SuggestionPrompts({
  items,
  onAsk,
}: {
  items: AskAiDemo[];
  onAsk: (text: string) => void;
}) {
  return (
    <Grid columns={2} gap={8}>
        {items.map((item) => (
          <GridItem key={item.id} span={1}>
              <Button
                color={siteConfig.accent}
                variant="secondary"
                className="h-full min-h-14 w-full whitespace-normal px-3 py-3 text-center"
                onClick={() => onAsk(item.title)}
              >
                <span className="text-sm font-medium leading-5 text-fg-black">{item.title}</span>
              </Button>
          </GridItem>
        ))}
    </Grid>
  );
}

function PageExtras({ onAsk }: { onAsk: (text: string) => void }) {
  return (
    <CommandSearch groupLabel="建议指令"
      placeholder="跳到模块或示范问题"
      emptyLabel="没有匹配的入口"
      items={[
        { id: "accounts", label: "打开账号管理", hint: "列表", group: "页面" },
        { id: "roles", label: "打开角色", hint: "权限", group: "页面" },
        { id: "next", label: ASK_AI_DEMOS[1]!.title, hint: "示范", group: "继续问" },
        { id: "status", label: ASK_AI_DEMOS[2]!.title, hint: "示范", group: "继续问" },
      ]}
      onSelect={(item) =>
        onAsk(item.id === "accounts" || item.id === "roles" ? ASK_AI_DEMOS[1]!.title : item.label)
      }
    />
  );
}

function NextExtras({
  onAsk,
  snapshot,
}: {
  onAsk: (text: string) => void;
  snapshot?: AskAiAccountSnapshot;
}) {
  const empty = !snapshot?.ready || snapshot.total === 0;
  return (
    <>
      <AgentTaskRows statusLabels={{ running: "进行中", failed: "失败", completed: "已完成" }}
        tasks={[
          {
            id: "db",
            title: snapshot?.ready ? "账号表能读" : "账号表还没就绪",
            status: snapshot?.ready ? "completed" : "failed",
            meta: snapshot?.ready ? `${snapshot.total} 条` : snapshot?.note || "DATABASE_URL",
          },
          {
            id: "create",
            title: empty ? "新建第一条运营账号" : "再补运营账号或配角色",
            status: empty ? "running" : "completed",
            meta: "账号管理",
          },
          {
            id: "role",
            title: "给角色勾 accounts:read",
            status: "running",
            meta: "角色",
          },
        ]}
      />
      <RecommendationCard confidenceLabels={{ high: "高置信度", review: "待核对", none: "未评估" }} alternativesLabel="其他建议"
        title={empty ? "先建一条运营账号？" : "先核对角色权限？"}
        body={
          empty
            ? "表是空的或读不到。先去账号管理新建，再去角色勾模块。"
            : `表里已有 ${snapshot?.total} 条。下一步通常是给运营角色勾 accounts:read。`
        }
        confidence="high"
        acceptLabel="去看怎么配权限"
        alternatives={[{ id: "status", label: "先看现在账号状态", confidence: "review" }]}
        onAccept={() => onAsk(ASK_AI_DEMOS[3]!.title)}
        onSelectAlternative={() => onAsk(ASK_AI_DEMOS[2]!.title)}
      />
    </>
  );
}

function StatusExtras({
  onAsk,
  snapshot,
}: {
  onAsk: (text: string) => void;
  snapshot?: AskAiAccountSnapshot;
}) {
  const byStatus = snapshot?.byStatus ?? { active: 0, disabled: 0, pending: 0, locked: 0 };
  const rows =
    snapshot?.recent.map((row, index) => ({
      id: `${row.name}-${index}`,
      change: row.status === "停用" || row.status === "锁定" ? ("remove" as const) : ("keep" as const),
      cells: { name: row.name, status: row.status, note: row.role },
    })) ?? [];

  return (
    <>
      <InsightCards previousInsightLabel="上一条洞察" nextInsightLabel="下一条洞察"
        cards={[
          {
            id: "active",
            title: "启用账号",
            body: snapshot?.ready
              ? `表里启用 ${byStatus.active} / 共 ${snapshot.total}。`
              : snapshot?.note || "账号表未就绪。",
            prompt: ASK_AI_DEMOS[1]!.title,
            chart: {
              kind: "bars",
              values: [byStatus.active, byStatus.disabled, byStatus.pending, byStatus.locked],
            },
          },
        ]}
        onAsk={(prompt) => onAsk(prompt)}
      />
      {rows.length > 0 ? (
        <AgentDiffTable toggleHint="点击切换是否纳入" formatApplyLabel={count => `提交 ${count} 项差异供核对`} formatAppliedLabel={count => `已提交 ${count} 项差异核对`}
          title="最近账号"
          columns={[
            { key: "name", label: "账号" },
            { key: "status", label: "状态" },
            { key: "note", label: "角色" },
          ]}
          rows={rows}
        />
      ) : null}
    </>
  );
}

function RbacExtras() {
  return (
    <AgentFlowchart kindLabels={{ trigger: "触发", action: "操作", condition: "条件" }} selectedLabel="已选择" nextLabel="下一步"
      title="账号怎么看见模块"
      nodes={[
        { id: "account", kind: "trigger", title: "新建账号", body: "登录用户 ≠ 业务账号" },
        { id: "role", kind: "condition", title: "角色有 :read？", body: "没有就直链回工作台" },
        { id: "menu", kind: "action", title: "侧栏出现模块", body: "还要应用勾选该 id" },
      ]}
      edges={[
        { from: "account", to: "role", label: "绑角色" },
        { from: "role", to: "menu", label: "有权限" },
      ]}
    />
  );
}
