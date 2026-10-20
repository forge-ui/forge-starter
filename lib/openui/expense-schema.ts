import { z } from "zod/v4";

/** 审批状态。顺序即 OpenUI Lang 里枚举的取值。 */
export const expenseStatusSchema = z.enum(["approved", "pending", "rejected"]);

export const expenseCardProps = z.object({
  title: z.string().describe("卡片标题"),
  applicant: z.string().describe("申请人"),
  amount: z.string().describe("金额，带货币符号"),
  status: expenseStatusSchema.describe("approved 已通过，pending 待审批，rejected 已驳回"),
  note: z.string().describe("一句话说明"),
});

export const expenseLineSchema = z.object({
  item: z.string().describe("费用项"),
  amount: z.string().describe("该项金额"),
});

export const expenseTableProps = z.object({
  title: z.string().describe("明细表标题"),
  rows: z.array(expenseLineSchema).describe("费用明细，每项含 item 与 amount"),
});

export const EXPENSE_CARD_DESCRIPTION = "一张报销结果卡片，展示标题、申请人、金额、审批状态和说明。";
export const EXPENSE_TABLE_DESCRIPTION = "报销明细表。rows 是 {item, amount} 对象数组。";
export const EXPENSE_RESULT_DESCRIPTION = "报销结果根节点。children 里先放一张 ExpenseCard，再放一张 ExpenseTable。";
