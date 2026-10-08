"use client";

import { useEffect, useState } from "react";
import {
  AgentCodeBlock, AgentDiffTable, AgentFlowchart, Button, Checklist, ChecklistItem,
  CommandSearch, ContextCards, InsightCards, RecommendationCard, ToolChips,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { presentationBlockSchema, type AgentPresentationBlock } from "@/lib/agent/presentation";

/** Presentation actions send a new request; existing server tools retain all write gates. */
export function AskAiPresentation({ block, disabled, onAsk, storageKey }: {
  block: AgentPresentationBlock; disabled: boolean; onAsk: (question: string) => void; storageKey: string;
}) {
  const parsed = presentationBlockSchema.safeParse(block);
  if (!parsed.success) return <p className="text-sm text-fg-grey-700">此条交互内容格式无效，请重新提问。</p>;
  const data = parsed.data;
  const ask = (question: string) => { if (!disabled) onAsk(question); };
  const interactive = (content: React.ReactNode) => <fieldset disabled={disabled} className="m-0 min-w-0 border-0 p-0 disabled:opacity-50">{content}</fieldset>;
  switch (data.type) {
    case "checklist": return <UserChecklist key={storageKey} block={data} storageKey={storageKey} disabled={disabled} onAsk={ask} />;
    case "recommendation": return interactive(<RecommendationCard confidenceLabels={{ high: "高置信度", review: "待核对", none: "未评估" }} alternativesLabel="其他建议" title={data.title} body={data.body}
      confidence="review" confidenceLabel="建议，待核对" acceptLabel="按此建议继续"
      alternatives={data.alternatives.map(item => ({ id: item.id, label: item.label }))}
      onAccept={() => ask(data.question)} onSelectAlternative={id => { const item = data.alternatives.find(item => item.id === id); if (item) ask(item.question); }} />);
    case "insights": return <InsightCards previousInsightLabel="上一条洞察" nextInsightLabel="下一条洞察"
      cards={data.cards.map(card => ({ ...card, prompt: disabled ? undefined : card.prompt }))}
      onAsk={prompt => ask(prompt)} />;
    case "commands": return interactive(<CommandSearch groupLabel="建议指令" items={data.items} placeholder={data.title} emptyLabel="没有匹配的建议"
      onSelect={item => { const selected = data.items.find(option => option.id === item.id); if (selected) ask(selected.question); }} />);
    case "context": return <ContextCards allChunksLabel="全部片段" charactersLabel="字符" chunks={data.chunks} total={data.chunks.length} />;
    case "code": return <AgentCodeBlock codeLabel="代码" diffLabel="差异" copyLabel="复制代码" copiedLabel="已复制" filename={data.filename} lines={data.lines} diff={data.diff} />;
    case "flow": return <AgentFlowchart kindLabels={{ trigger: "触发", action: "操作", condition: "条件" }} selectedLabel="已选择" nextLabel="下一步" title={data.title} nodes={data.nodes} edges={data.edges} />;
    case "diff": return <div className="flex min-w-0 flex-col gap-3">
      <ToolChips items={[]} diffs={[{ file: data.title, add: data.rows.filter(row => row.change === "add").length, del: data.rows.filter(row => row.change === "remove").length }]} summary="待核对差异，尚未应用" />
      {interactive(<AgentDiffTable toggleHint="点击切换是否纳入" formatApplyLabel={count => `提交 ${count} 项差异供核对`} formatAppliedLabel={count => `已提交 ${count} 项差异核对`} title={data.title} columns={data.columns} rows={data.rows}
        applyLabel="提交所选差异供核对" appliedLabel="已提交核对"
        onApply={ids => ask(`请核对以下差异建议，若涉及修改请先生成确认单，不要直接保存：${JSON.stringify({ title: data.title, columns: data.columns, rows: data.rows.filter(row => ids.includes(row.id)) })}`)} />)}
    </div>;
  }
}

function UserChecklist({ block, storageKey, disabled, onAsk }: {
  block: Extract<AgentPresentationBlock, { type: "checklist" }>;
  storageKey: string; disabled: boolean; onAsk: (question: string) => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const key = `forge-starter:ask-ai-checklist:${storageKey}`;
  const taskIds = JSON.stringify(block.tasks.map(task => task.id));
  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(key) || "null");
      if (Array.isArray(stored)) setChecked(stored.filter((id): id is string => typeof id === "string" && (JSON.parse(taskIds) as string[]).includes(id)));
    } catch { /* Storage is optional; the checklist still works in memory. */ }
    setLoaded(true);
  }, [key, taskIds]);
  function update(ids: string[]) {
    setChecked(ids); setReviewed(false);
    try { localStorage.setItem(key, JSON.stringify(ids)); } catch { /* Keep in-memory progress. */ }
  }
  return <fieldset disabled={disabled || !loaded} className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0 disabled:opacity-50">
    <legend className="mb-2 text-sm font-semibold text-fg-black">{block.title}</legend>
    <p className="text-xs text-fg-grey-700">用户自查清单，勾选不会执行业务操作。</p>
    <Checklist color={siteConfig.accent} size="sm" tasks={block.tasks.map(task => ({ ...task, done: checked.includes(task.id) }))}
      onTasksChange={tasks => update(tasks.filter(task => task.done).map(task => task.id))} />
    <ChecklistItem color={siteConfig.accent} size="sm" label="已核对以上勾选结果" checked={reviewed} onCheckedChange={setReviewed} />
    <div><Button size="sm" color={siteConfig.accent} disabled={disabled || !reviewed}
      onClick={() => { if (!disabled && reviewed) onAsk(`这是我自查的结果，请根据未完成项继续提供建议：${JSON.stringify({ title: block.title, checked: block.tasks.filter(task => checked.includes(task.id)).map(task => task.label), remaining: block.tasks.filter(task => !checked.includes(task.id)).map(task => task.label) })}`); }}>
      提交自查结果
    </Button></div>
  </fieldset>;
}
