/** 在 Ask AI 里输入这句即可触发，大小写和空格不敏感。 */
export const EXPENSE_OPENUI_TRIGGER = "用 OpenUI 展示报销结果";

export const EXPENSE_OPENUI_SUMMARY = "这是一笔差旅报销的结果卡片和明细表，由 OpenUI Lang 流式渲染。";

export const EXPENSE_OPENUI_FALLBACK = "模型没有返回可渲染的 OpenUI，已改用内置报销样例。";

/**
 * 手写的 OpenUI Lang 1.0。无模型时按这段流式播放，用法对齐
 * open-intelligent-ui 的 /gallery：不经过付费网关。
 */
export const EXPENSE_OPENUI_PROGRAM = [
  "root = ExpenseResult([card, lines])",
  'card = ExpenseCard("差旅报销 · 上海出差", "林夏", "¥1,280.00", "approved", "财务已复核，等待打款。")',
  'lines = ExpenseTable("费用明细", [{item: "高铁", amount: "¥860.00"}, {item: "住宿", amount: "¥420.00"}])',
  "",
].join("\n");

export function isExpenseOpenUiQuestion(question: string) {
  const text = question.trim().toLowerCase().replace(/\s+/g, "");
  return text.includes("openui") && text.includes("报销");
}

/** 去掉模型偶尔包上的围栏，并截到 root 语句。 */
export function extractOpenUiLang(raw: string) {
  const trimmed = raw.trim();
  const fence = trimmed.match(/```(?:openui|text)?\s*([\s\S]*?)```/i);
  const body = (fence?.[1] ?? trimmed).replace(/^\uFEFF/, "").trim();
  const start = body.search(/(^|\n)\s*root\s*=/);
  const from = start < 0 ? 0 : body[start] === "\n" ? start + 1 : start;
  return body.slice(from).trim().slice(0, 8000);
}

/** 累计片段，最后一项是全文。渲染器按累计文本逐段重绘。 */
export function cumulativeOpenUiChunks(lang: string, size = 48) {
  const chunks: string[] = [];
  const step = Math.max(8, size);
  for (let end = step; end < lang.length; end += step) chunks.push(lang.slice(0, end));
  chunks.push(lang);
  return chunks;
}
