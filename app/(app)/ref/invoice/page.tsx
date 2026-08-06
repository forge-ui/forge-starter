"use client";

/**
 * Invoice / document detail — finance-template/invoices/[id]
 * Line items + totals + payment summary rail.
 */

import { CloudDownloadLinear, Pen2Linear } from "solar-icon-set";
import {
  Avatar,
  Button,
  CellText,
  DataTable,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "invoice")!;

type LineItem = {
  id: string;
  name: string;
  rate: string;
  quantity: string;
  total: string;
};

const lineItems: LineItem[] = [
  { id: "1", name: "Protask design system setup", rate: "$600.00", quantity: "2", total: "$1,200.00" },
  { id: "2", name: "Dashboard implementation", rate: "$450.00", quantity: "2", total: "$900.00" },
  { id: "3", name: "QA and handoff", rate: "$220.00", quantity: "1", total: "$220.00" },
];

const columns: ColumnDef<LineItem>[] = [
  { key: "name", header: "Description", flex: true, render: (row) => <CellText>{row.name}</CellText> },
  { key: "rate", header: "Rate", width: "w-[140px]", render: (row) => <CellText>{row.rate}</CellText> },
  { key: "quantity", header: "Qty", width: "w-[110px]", render: (row) => <CellText>{row.quantity}</CellText> },
  { key: "total", header: "Total", width: "w-[150px]", render: (row) => <CellText>{row.total}</CellText> },
];

function FieldLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-fg-grey-100 py-3 last:border-0">
      <span className="text-sm text-fg-grey-500">{label}</span>
      <span className="text-sm font-medium text-fg-black">{value}</span>
    </div>
  );
}

export default function RefInvoicePage() {
  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button color="grey" variant="tertiary" iconLeft={<CloudDownloadLinear size={18} />}>
          Download
        </Button>
        <Button color={siteConfig.accent} iconLeft={<Pen2Linear size={18} />}>
          Edit Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-[28px] border border-fg-grey-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 border-b border-fg-grey-200 pb-6 lg:flex-row lg:items-start">
            <div>
              <p className="text-sm font-medium text-fg-grey-500">Invoice Number</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-fg text-fg-black">INV-23064</h2>
            </div>
            <StatusBadge label="Paid" color="green" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-[20px] border border-fg-grey-200 p-5">
              <p className="text-xs font-medium uppercase tracking-fg text-fg-grey-500">Bill To</p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar
                  src="https://api.dicebear.com/9.x/thumbs/svg?seed=john-bushmill"
                  size="md"
                />
                <div>
                  <p className="text-sm font-semibold text-fg-black">John Bushmill</p>
                  <p className="text-xs font-medium text-fg-grey-500">johnb@mail.com</p>
                </div>
              </div>
            </div>
            <div className="rounded-[20px] border border-fg-grey-200 p-5">
              <p className="text-xs font-medium uppercase tracking-fg text-fg-grey-500">Pay From</p>
              <p className="mt-4 text-sm font-semibold text-fg-black">Forge Starter Team</p>
              <p className="mt-1 text-xs font-medium text-fg-grey-500">finance@example.com</p>
            </div>
          </div>

          <div className="mt-6">
            <DataTable<LineItem>
              color={siteConfig.accent}
              columns={columns}
              rows={lineItems}
              getRowKey={(row) => row.id}
            />
          </div>

          <div className="ml-auto mt-6 w-full max-w-[320px] rounded-[20px] bg-fg-grey-50 p-5">
            <FieldLine label="Subtotal" value="$2,320.00" />
            <FieldLine label="Tax" value="$232.00" />
            <FieldLine label="Discount" value="$0.00" />
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm font-semibold text-fg-black">Total</span>
              <span className="text-2xl font-semibold text-fg-black">$2,552.00</span>
            </div>
          </div>
        </section>

        <aside className="rounded-[28px] border border-fg-grey-200 bg-white p-6">
          <p className="text-xs font-medium uppercase tracking-fg text-fg-grey-500">Payment schedule</p>
          <h3 className="mt-1 text-lg font-semibold text-fg-black">Invoice Summary</h3>
          <div className="mt-4">
            <FieldLine label="Invoice Date" value="01 Aug 2026" />
            <FieldLine label="Due Date" value="08 Aug 2026" />
            <FieldLine label="Amount" value="$2,552.00" />
            <FieldLine label="Terms" value="Net 7" />
          </div>
          <Button color={siteConfig.accent} className="mt-5 w-full">
            Send Reminder
          </Button>
        </aside>
      </div>
    </RefChrome>
  );
}
