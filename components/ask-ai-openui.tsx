"use client";

import "@/lib/openui/skip-devtools";
import { Renderer } from "@openuidev/react-lang";
import { CellText, DataTable, StatusBadge } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { createExpenseLibrary, type ExpenseCardProps } from "@/lib/openui/expense-library";

const STATUS: Record<ExpenseCardProps["status"], { label: string; color: "green" | "yellow" | "red" }> = {
  approved: { label: "已通过", color: "green" },
  pending: { label: "待审批", color: "yellow" },
  rejected: { label: "已驳回", color: "red" },
};

const expenseLibrary = createExpenseLibrary({
  card: (props) => {
    const status = STATUS[props.status];
    return (
      <article className="flex min-w-0 flex-col gap-2 rounded-2xl border border-fg-grey-200 p-4">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-fg-black">{props.title}</h3>
          <StatusBadge label={status.label} color={status.color} />
        </div>
        <p className="text-sm text-fg-grey-700">{props.applicant}</p>
        <p className="text-sm font-semibold text-fg-black">{props.amount}</p>
        <p className="text-sm leading-6 text-fg-grey-700">{props.note}</p>
      </article>
    );
  },
  table: (props) => (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 className="text-sm font-semibold text-fg-black">{props.title}</h3>
      <div className="min-w-0 overflow-x-auto">
        <DataTable<Record<string, string>>
          color={siteConfig.accent}
          columns={[
            {
              key: "item",
              header: "费用项",
              width: "60%",
              render: (row) => <CellText>{row.item || "—"}</CellText>,
            },
            {
              key: "amount",
              header: "金额",
              width: "40%",
              render: (row) => <CellText>{row.amount || "—"}</CellText>,
            },
          ]}
          rows={props.rows.map((row) => ({ item: row.item, amount: row.amount }))}
          getRowKey={(_row, index) => String(index)}
        />
      </div>
    </div>
  ),
});

/** 现有 Ask AI 消息里的一块 OpenUI。流式时 isStreaming 为 true，壳子不动。 */
export function AskAiOpenUi({ lang, streaming }: { lang: string; streaming: boolean }) {
  return (
    <div className="min-w-0" data-ask-ai-openui={streaming ? "streaming" : "ready"}>
      <Renderer response={lang} library={expenseLibrary} isStreaming={streaming} />
    </div>
  );
}
