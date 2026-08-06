"use client";

/**
 * Billing / subscription — subscription billing
 * Current plan card + history table + cancel affordance
 */

import { useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  CellMuted,
  CellText,
  DataTable,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "billing")!;

type SubStatus = "active" | "trialing" | "canceled" | "expired" | "pending_cancel";

type SubRow = {
  id: string;
  no: string;
  plan: string;
  interval: string;
  amount: string;
  status: SubStatus;
  period: string;
  provider: string;
};

const statusColor: Record<SubStatus, "green" | "blue" | "grey" | "red" | "yellow"> = {
  active: "green",
  trialing: "blue",
  canceled: "grey",
  expired: "red",
  pending_cancel: "yellow",
};

const history: SubRow[] = [
  {
    id: "1",
    no: "SUB-23091",
    plan: "Pro",
    interval: "1-month",
    amount: "$29.00",
    status: "active",
    period: "06 Aug → 06 Sep 2026",
    provider: "stripe",
  },
  {
    id: "2",
    no: "SUB-22011",
    plan: "Starter",
    interval: "1-month",
    amount: "$9.00",
    status: "canceled",
    period: "06 Jul → 06 Aug 2026",
    provider: "stripe",
  },
  {
    id: "3",
    no: "SUB-21002",
    plan: "Starter",
    interval: "1-month",
    amount: "$9.00",
    status: "expired",
    period: "06 Jun → 06 Jul 2026",
    provider: "stripe",
  },
];

const tabs = [
  { label: "全部" },
  { label: "Active" },
  { label: "Canceled" },
  { label: "Expired" },
];

export default function RefBillingPage() {
  const [tab, setTab] = useState(0);
  const [cancelPending, setCancelPending] = useState(false);

  const filtered = useMemo(() => {
    if (tab === 1) return history.filter((r) => r.status === "active" || r.status === "trialing");
    if (tab === 2) return history.filter((r) => r.status === "canceled" || r.status === "pending_cancel");
    if (tab === 3) return history.filter((r) => r.status === "expired");
    return history;
  }, [tab]);

  const columns: ColumnDef<SubRow>[] = useMemo(
    () => [
      {
        key: "no",
        header: "订阅号",
        flex: true,
        render: (row) => (
          <div className="flex h-10 flex-col justify-center">
            <span className="font-mono text-xs font-semibold text-fg-black">{row.no}</span>
            <span className="text-xs text-fg-grey-500">{row.plan} · {row.interval}</span>
          </div>
        ),
      },
      {
        key: "amount",
        header: "金额",
        width: "w-28",
        render: (row) => <CellText>{row.amount}</CellText>,
      },
      {
        key: "status",
        header: "状态",
        width: "w-32",
        render: (row) => (
          <StatusBadge label={row.status} color={statusColor[row.status]} />
        ),
      },
      {
        key: "period",
        header: "周期",
        width: "w-48",
        render: (row) => <CellMuted>{row.period}</CellMuted>,
      },
      {
        key: "provider",
        header: "渠道",
        width: "w-24",
        render: (row) => <CellMuted>{row.provider}</CellMuted>,
      },
    ],
    [],
  );

  return (
    <RefChrome meta={meta}>
      {/* Current plan */}
      <section className="rounded-[28px] border border-fg-grey-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-fg text-fg-grey-500">
              Current plan
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-fg-black">Pro</h2>
              <StatusBadge
                label={cancelPending ? "pending_cancel" : "active"}
                color={cancelPending ? "yellow" : "green"}
              />
            </div>
            <p className="mt-2 max-w-lg text-sm text-fg-grey-600">
              $29 / month · 下一扣款日 06 Sep 2026 · 含 2,000 积分/月。对齐 Next
              settings/billing 顶部当前订阅卡。
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-fg-grey-500">周期</dt>
                <dd className="mt-1 text-sm font-semibold text-fg-black">Monthly</dd>
              </div>
              <div>
                <dt className="text-xs text-fg-grey-500">本期开始</dt>
                <dd className="mt-1 text-sm font-semibold text-fg-black">06 Aug 2026</dd>
              </div>
              <div>
                <dt className="text-xs text-fg-grey-500">本期结束</dt>
                <dd className="mt-1 text-sm font-semibold text-fg-black">06 Sep 2026</dd>
              </div>
              <div>
                <dt className="text-xs text-fg-grey-500">支付渠道</dt>
                <dd className="mt-1 text-sm font-semibold text-fg-black">Stripe</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button color={siteConfig.accent} variant="tertiary">
              管理付款方式
            </Button>
            {cancelPending ? (
              <Button color={siteConfig.accent} onClick={() => setCancelPending(false)}>
                恢复订阅
              </Button>
            ) : (
              <Button color="grey" variant="tertiary" onClick={() => setCancelPending(true)}>
                取消续订
              </Button>
            )}
          </div>
        </div>
        {cancelPending ? (
          <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 outline outline-1 outline-amber-200">
            将在本期结束（06 Sep）后停止续费，期间仍可使用 Pro。
          </p>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-fg-black">订阅历史</h3>
          <p className="text-xs text-fg-grey-500">含已取消 / 过期记录</p>
        </div>
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={tabs.map((t) => ({ label: t.label }))}
          activeIndex={tab}
          onChange={setTab}
        />
      </div>

      <DataTable<SubRow>
        color={siteConfig.accent}
        columns={columns}
        rows={filtered}
        getRowKey={(row) => row.id}
      />
    </RefChrome>
  );
}
