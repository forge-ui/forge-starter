import { presentationBlockSchema, type AgentPresentationBlock } from "../agent/presentation";
import { ToolInputError, type Json, type Run } from "./types";

/** Read results are server-owned. The model chooses a view, never authors table records. */
export function preparePresentation(blocks: AgentPresentationBlock[], run: Run): AgentPresentationBlock[] {
  const source = (toolCallId?: string) => {
    const found = run.observations?.find(item => item.toolCallId === toolCallId);
    if (!found) throw new ToolInputError("展示数据必须引用本轮已成功查询的 sourceToolCallId，请先查询再展示");
    return found;
  };
  return blocks.map(block => {
    if (block.type === "table") {
      const data = source(block.sourceToolCallId).data;
      const original = Array.isArray(data.blocks) ? data.blocks.find(item => item && typeof item === "object" && !Array.isArray(item) && ["table", "query"].includes(String(item.type))) : undefined;
      if (original && typeof original === "object" && !Array.isArray(original)) {
        const table = original.type === "table" ? original : original.table;
        if (table && typeof table === "object" && !Array.isArray(table) && Array.isArray(table.columns) && Array.isArray(table.rows)) {
          const columns = table.columns.slice(0, 12).map((c, i) => typeof c === "string" ? { key: String(i), label: c } : c as { key: string; label: string });
          const rows = table.rows.slice(0, 50).map(row => Array.isArray(row) ? Object.fromEntries(row.map((v, i) => [String(i), String(v ?? "")])) : row as Record<string, string>);
          return presentationBlockSchema.parse({ ...block, columns, rows });
        }
      }
      if (Array.isArray(data.rows)) {
        const rows = data.rows.filter((row): row is { [key: string]: Json } => Boolean(row && typeof row === "object" && !Array.isArray(row))).slice(0, 50);
        const keys = [...new Set(rows.flatMap(row => Object.keys(row)))].slice(0, 12);
        if (keys.length) return presentationBlockSchema.parse({ ...block, columns: keys.map(key => ({ key, label: key })), rows: rows.map(row => Object.fromEntries(keys.map(key => [key, typeof row[key] === "object" ? JSON.stringify(row[key]) : String(row[key] ?? "")])) ) });
      }
      throw new ToolInputError("此查询没有可展示的表格，请直接用文字回答或选择其他组件");
    }
    if (block.type === "insights") {
      for (const card of block.cards) {
        const chart = card.chart;
        if (!chart) continue;
        const observation = source(chart.sourceToolCallId);
        const values = new Set<number>();
        const collect = (value: Json) => {
          if (typeof value === "number") values.add(value);
          else if (typeof value === "string" && /^\d+(?:\.\d+)?$/.test(value)) values.add(Number(value));
          else if (Array.isArray(value)) value.forEach(collect);
          else if (value && typeof value === "object") Object.values(value).forEach(collect);
        };
        collect(observation.data);
        const displayed = chart.kind === "bars" ? chart.values : chart.kind === "spark" ? chart.series.flatMap(item => item.values) : chart.items.map(item => item.pct);
        if (displayed.some(value => !values.has(value))) throw new ToolInputError("图表数值与引用的查询结果不一致；请使用真实数值，无法验证的计算改用文字说明");
      }
    }
    return block;
  });
}
