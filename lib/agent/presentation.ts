/** JSON presentation protocol shared by the model tool, API and client renderer. */
import { z } from "zod";
const text = z.string().trim().min(1).max(1200);
const id = z.string().min(1).max(160);
const short = z.string().trim().min(1).max(200);
const action = z.object({ id, label: short, question: text }).strict();
const column = z.object({ key: id, label: short }).strict();
const task = z.object({ id, label: short }).strict();
const node = z.object({ id, kind: z.enum(["trigger", "action", "condition"]), title: short, body: text.optional() }).strict();
const tone = z.enum(["violet", "green", "yellow", "blue"]);
const chartValue = z.number().finite().nonnegative().max(1_000_000_000_000);
const chartSource = { sourceToolCallId: id.optional() };
const chart = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("spark"), ...chartSource, series: z.array(z.object({ name: short, values: z.array(chartValue).min(2).max(24), tone: tone.optional() }).strict()).min(1).max(4) }).strict(),
  z.object({ kind: z.literal("bars"), ...chartSource, values: z.array(chartValue).min(1).max(24) }).strict(),
  z.object({ kind: z.literal("segments"), ...chartSource, items: z.array(z.object({ label: short, pct: z.number().finite().min(0).max(100), tone: tone.optional() }).strict()).min(1).max(8) }).strict(),
]);
export const presentationBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("table"), title: short, sourceToolCallId: id, columns: z.array(column).max(12).default([]), rows: z.array(z.record(z.string(), z.string().max(1200))).max(50).default([]) }).strict(),
  z.object({ type: z.literal("checklist"), title: short, tasks: z.array(task).min(1).max(12) }).strict(),
  z.object({ type: z.literal("recommendation"), title: short, body: text, question: text, alternatives: z.array(action).max(5) }).strict(),
  z.object({ type: z.literal("insights"), cards: z.array(z.object({ id, title: short, body: text, prompt: text, chart: chart.optional() }).strict()).min(1).max(6) }).strict(),
  z.object({ type: z.literal("diff"), title: short, columns: z.array(column).min(1).max(6), rows: z.array(z.object({ id, cells: z.record(z.string(), z.string().max(1200)), change: z.enum(["keep", "add", "remove"]) }).strict()).min(1).max(20) }).strict(),
  z.object({ type: z.literal("code"), filename: short, lines: z.array(z.string().max(1000)).min(1).max(80), diff: z.array(z.object({ old: z.number().int().positive().nullable(), cur: z.number().int().positive().nullable(), type: z.enum(["ctx", "add", "del"]), pieces: z.array(z.object({ text: z.string().max(1000), change: z.enum(["add", "del"]).optional() }).strict()).max(10) }).strict()).max(80).optional() }).strict(),
  z.object({ type: z.literal("flow"), title: short, nodes: z.array(node).min(1).max(12), edges: z.array(z.object({ from: id, to: id, label: short.optional() }).strict()).max(20) }).strict(),
  z.object({ type: z.literal("commands"), title: short, items: z.array(action.extend({ hint: short.optional() })).min(1).max(20) }).strict(),
  z.object({ type: z.literal("context"), chunks: z.array(z.object({ id, title: short, body: text, sourceLabel: short, sourceKind: short.optional() }).strict()).min(1).max(8) }).strict(),
]).superRefine((block, ctx) => {
  // The same checks apply to tool output, live responses and restored history.
  if ((block.type === "checklist" || block.type === "diff") && JSON.stringify(block).length > 1700) ctx.addIssue({ code: "custom", message: "清单或差异内容过长，请精简至1700字符以内以便提交核对" });
  const items = block.type === "checklist" ? block.tasks : block.type === "flow" ? block.nodes : block.type === "diff" ? block.rows : block.type === "commands" ? block.items : block.type === "insights" ? block.cards : block.type === "context" ? block.chunks : block.type === "recommendation" ? block.alternatives : [];
  if (new Set(items.map(item => item.id)).size !== items.length) ctx.addIssue({ code: "custom", message: "同一组件的编号不能重复" });
  if (block.type === "flow" && block.edges.some(edge => !block.nodes.some(n => n.id === edge.from) || !block.nodes.some(n => n.id === edge.to))) ctx.addIssue({ code: "custom", message: "流程连线必须引用存在的节点" });
  if (block.type === "diff" && (new Set(block.columns.map(c => c.key)).size !== block.columns.length || block.rows.some(row => Object.keys(row.cells).some(key => !block.columns.some(c => c.key === key))))) ctx.addIssue({ code: "custom", message: "差异列必须唯一，单元格必须对应已声明的列" });
  if (block.type === "insights") for (const card of block.cards) {
    if (card.chart?.kind === "segments") {
      const total = card.chart.items.reduce((sum, item) => sum + item.pct, 0);
      if (total <= 0 || total > 100.01) ctx.addIssue({ code: "custom", message: "分析图的分项占比合计必须大于0且不超过100%" });
      if (new Set(card.chart.items.map(item => item.label)).size !== card.chart.items.length) ctx.addIssue({ code: "custom", message: "分析图的分项名称不能重复" });
    }
    if (card.chart?.kind === "spark") {
      const series = card.chart.series;
      if (new Set(series.map(item => item.name)).size !== series.length || series.some(item => item.values.length !== series[0].values.length)) ctx.addIssue({ code: "custom", message: "趋势图序列名称必须唯一，数据点数量必须一致" });
    }
  }
});
export type AgentPresentationBlock = z.infer<typeof presentationBlockSchema>;
export const presentationRequestSchema = z.object({ blocks: z.array(presentationBlockSchema).min(1).max(4) }).strict();
export function isPresentationBlock(block: { type: string }): block is AgentPresentationBlock {
  if (block.type === "table") return "sourceToolCallId" in block;
  return ["checklist", "recommendation", "insights", "diff", "code", "flow", "commands", "context"].includes(block.type);
}

export const PRESENTATION_TOOL_DESCRIPTION = "仅在组件比文字更有助于理解或需要交互时调用，普通聊天和写作直接回答，不展示组件。table展示本轮查询结果，提供sourceToolCallId与title即可，rows和columns留空，由服务端组装真实数据。checklist供用户自查；recommendation比较建议；insights解释数据，可选chart但须提供该chart的sourceToolCallId且数值与对应查询一致；diff比较差异；flow解释流程；context展示来源；commands提供可搜索入口；code只展示配置示例。不能编造业务事实或来源，不重复堆叠组件，不把建议标成已执行。此工具只展示，写入仍须业务工具与用户确认。";
