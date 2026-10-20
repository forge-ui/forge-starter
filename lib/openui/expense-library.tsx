import { createLibrary, defineComponent } from "@openuidev/react-lang";
import type { ReactNode } from "react";
import { z } from "zod/v4";
import {
  EXPENSE_CARD_DESCRIPTION,
  EXPENSE_RESULT_DESCRIPTION,
  EXPENSE_TABLE_DESCRIPTION,
  expenseCardProps,
  expenseTableProps,
} from "./expense-schema";

export type ExpenseCardProps = z.infer<typeof expenseCardProps>;
export type ExpenseTableProps = z.infer<typeof expenseTableProps>;

/**
 * 小型组件库。模型只能用这三块拼报销结果。
 * 卡片和表格的外观由调用方注入，服务端生成提示词时不需要 Forge 组件。
 */
export function createExpenseLibrary(views: {
  card: (props: ExpenseCardProps) => ReactNode;
  table: (props: ExpenseTableProps) => ReactNode;
}) {
  const ExpenseCard = defineComponent({
    name: "ExpenseCard",
    description: EXPENSE_CARD_DESCRIPTION,
    props: expenseCardProps,
    component: ({ props }) => views.card(props),
  });
  const ExpenseTable = defineComponent({
    name: "ExpenseTable",
    description: EXPENSE_TABLE_DESCRIPTION,
    props: expenseTableProps,
    component: ({ props }) => views.table(props),
  });
  const ExpenseResult = defineComponent({
    name: "ExpenseResult",
    description: EXPENSE_RESULT_DESCRIPTION,
    props: z.object({
      children: z.array(z.union([ExpenseCard.ref, ExpenseTable.ref])).describe("先卡片，再明细表"),
    }),
    component: ({ props, renderNode }) => (
      <div className="flex min-w-0 flex-col gap-3">{renderNode(props.children)}</div>
    ),
  });
  return createLibrary({
    root: "ExpenseResult",
    components: [ExpenseResult, ExpenseCard, ExpenseTable],
  });
}
