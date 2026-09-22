"use client";

import { useState } from "react";
import {
  AgentDiffTable,
  AgentFlowchart,
  AgentTaskRows,
  Button,
  CellText,
  CommandSearch,
  DataTable,
  Grid,
  GridItem,
  InsightCards,
  RecommendationCard,
  StreamingAnswer,
  SurfaceCard,
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
import { askAiLandingCopy, askAiStatusLabel, type AskAiRuntimeStatus, type AskAiTurn } from "@/lib/ask-ai";
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
}: {
  turns: AskAiTurn[];
  runtime?: AskAiRuntimeStatus | null;
  landing?: boolean;
  spentIntents: string[];
  confirmingIntent: string | null;
  onAsk: (text: string) => void;
  onConfirm: (intent: string) => void;
}) {
  const suggestions = suggestionDemos();

  return (
    <div className="flex flex-col gap-5 p-5">
      {landing ? (
        <p className="text-sm leading-6 text-fg-black">你好</p>
      ) : null}
      {landing ? (
        <div className="flex flex-col gap-5">
          <span className="text-xs text-fg-grey-500">
            Ask AI · {askAiStatusLabel({ landing: true, runtime })}
          </span>
          <StreamingAnswer text={askAiLandingCopy(runtime ?? null)} />
          <SuggestionPrompts items={suggestions} onAsk={onAsk} />
        </div>
      ) : (
        turns.map((turn, index) => (
          <AskAiTurnView
            key={turn.id}
            turn={turn}
            latest={index === turns.length - 1}
            runtime={runtime}
            spentIntents={spentIntents}
            confirmingIntent={confirmingIntent}
            onAsk={onAsk}
            onConfirm={onConfirm}
          />
        ))
      )}
    </div>
  );
}

function AskAiTurnView({
  turn,
  latest,
  runtime,
  spentIntents,
  confirmingIntent,
  onAsk,
  onConfirm,
}: {
  turn: AskAiTurn;
  latest: boolean;
  runtime?: AskAiRuntimeStatus | null;
  spentIntents: string[];
  confirmingIntent: string | null;
  onAsk: (text: string) => void;
  onConfirm: (intent: string) => void;
}) {
  const result = turn.result;
  const demo = result && !result.live && !result.failed ? matchAskAiDemo(turn.question) : null;
  const source = askAiStatusLabel({
    live: result?.live,
    failed: result?.failed,
    pending: turn.pending,
    model: result?.model,
    snapshotReady: result?.snapshot?.ready,
    runtime,
  });
  const body = turn.pending
    ? "正在处理…"
    : result?.text || ASK_AI_FALLBACK_SUMMARY;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-end gap-1.5">
        <span className="text-xs text-fg-grey-500">你</span>
        <p className="max-w-full rounded-2xl bg-fg-grey-100 px-4 py-3 text-sm leading-6 text-fg-black">
          {turn.question}
        </p>
      </div>
      <span className="text-xs text-fg-grey-500">Ask AI · {source}</span>
      <StreamingAnswer text={body} />
      {result?.blocks?.map((block, index) => (
        <AgentBlockView
          key={`${turn.id}-${block.type}-${index}`}
          block={block}
          spent={block.type === "confirm" && spentIntents.includes(block.intent)}
          confirming={block.type === "confirm" && confirmingIntent === block.intent}
          onConfirm={onConfirm}
        />
      ))}
      {latest && demo?.id === "page" ? <PageExtras onAsk={onAsk} /> : null}
      {latest && demo?.id === "next" ? <NextExtras onAsk={onAsk} snapshot={result?.snapshot} /> : null}
      {latest && demo?.id === "status" ? <StatusExtras onAsk={onAsk} snapshot={result?.snapshot} /> : null}
      {latest && demo?.id === "rbac" ? <RbacExtras /> : null}
    </div>
  );
}

function AgentBlockView({
  block,
  spent,
  confirming,
  onConfirm,
}: {
  block: AgentBlock;
  spent: boolean;
  confirming: boolean;
  onConfirm: (intent: string) => void;
}) {
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
            disabled={spent || confirming}
            onClick={() => onConfirm(block.intent)}
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
            <SurfaceCard padding="none" className="h-full">
              <button
                type="button"
                className="flex h-full min-h-14 w-full items-center justify-center px-3 py-3 text-center hover:bg-fg-grey-50"
                onClick={() => onAsk(item.title)}
              >
                <span className="text-sm font-medium leading-5 text-fg-black">{item.title}</span>
              </button>
            </SurfaceCard>
          </GridItem>
        ))}
    </Grid>
  );
}

function PageExtras({ onAsk }: { onAsk: (text: string) => void }) {
  return (
    <CommandSearch
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
      <AgentTaskRows
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
      <RecommendationCard
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
      <InsightCards
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
        <AgentDiffTable
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
    <AgentFlowchart
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
