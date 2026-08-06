"use client";

/**
 * Credits ledger — credits ledger
 * Balance card + type tabs + transaction table
 */

import { useMemo, useState } from "react";
import {
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

const meta = REF_PAGES.find((p) => p.slug === "credits")!;

type TxType = "grant" | "consume";

type CreditRow = {
  id: string;
  no: string;
  description: string;
  type: TxType;
  scene: string;
  amount: number;
  remaining: number;
  expiresAt: string;
  createdAt: string;
};

const rows: CreditRow[] = [
  {
    id: "1",
    no: "CRD-20260806-001",
    description: "Pro 订阅月度赠送",
    type: "grant",
    scene: "subscription",
    amount: 2000,
    remaining: 1480,
    expiresAt: "06 Sep 2026",
    createdAt: "06 Aug 2026",
  },
  {
    id: "2",
    no: "CRD-20260805-014",
    description: "AI 图像生成 ×3",
    type: "consume",
    scene: "ai_task",
    amount: -120,
    remaining: 0,
    expiresAt: "—",
    createdAt: "05 Aug 2026",
  },
  {
    id: "3",
    no: "CRD-20260801-002",
    description: "注册礼包",
    type: "grant",
    scene: "gift",
    amount: 500,
    remaining: 0,
    expiresAt: "01 Sep 2026",
    createdAt: "01 Aug 2026",
  },
  {
    id: "4",
    no: "CRD-20260728-008",
    description: "导出任务",
    type: "consume",
    scene: "export",
    amount: -40,
    remaining: 0,
    expiresAt: "—",
    createdAt: "28 Jul 2026",
  },
  {
    id: "5",
    no: "CRD-20260720-001",
    description: "运营补偿发放",
    type: "grant",
    scene: "reward",
    amount: 200,
    remaining: 80,
    expiresAt: "20 Aug 2026",
    createdAt: "20 Jul 2026",
  },
];

const tabs = [{ label: "全部" }, { label: "发放 grant" }, { label: "消耗 consume" }];

export default function RefCreditsPage() {
  const [tab, setTab] = useState(0);

  const filtered = useMemo(() => {
    if (tab === 1) return rows.filter((r) => r.type === "grant");
    if (tab === 2) return rows.filter((r) => r.type === "consume");
    return rows;
  }, [tab]);

  const balance = 1560;

  const columns: ColumnDef<CreditRow>[] = useMemo(
    () => [
      {
        key: "no",
        header: "流水号",
        flex: true,
        render: (row) => (
          <div className="flex h-10 flex-col justify-center">
            <span className="font-mono text-xs font-semibold text-fg-black">{row.no}</span>
            <span className="text-xs text-fg-grey-500">{row.description}</span>
          </div>
        ),
      },
      {
        key: "type",
        header: "类型",
        width: "w-28",
        render: (row) => (
          <StatusBadge
            label={row.type}
            color={row.type === "grant" ? "green" : "yellow"}
          />
        ),
      },
      {
        key: "scene",
        header: "场景",
        width: "w-32",
        render: (row) => <CellMuted>{row.scene}</CellMuted>,
      },
      {
        key: "amount",
        header: "变动",
        width: "w-24",
        render: (row) => (
          <span
            className={`text-sm font-semibold ${
              row.amount > 0 ? "text-emerald-600" : "text-fg-red"
            }`}
          >
            {row.amount > 0 ? `+${row.amount}` : row.amount}
          </span>
        ),
      },
      {
        key: "remaining",
        header: "批次剩余",
        width: "w-28",
        render: (row) => <CellText>{String(row.remaining)}</CellText>,
      },
      {
        key: "expiresAt",
        header: "过期",
        width: "w-32",
        render: (row) => <CellMuted>{row.expiresAt}</CellMuted>,
      },
      {
        key: "createdAt",
        header: "时间",
        width: "w-32",
        render: (row) => <CellMuted>{row.createdAt}</CellMuted>,
      },
    ],
    [],
  );

  return (
    <RefChrome meta={meta}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] bg-fg-violet p-6 text-white lg:col-span-1">
          <p className="text-sm text-white/75">可用积分</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{balance.toLocaleString()}</p>
          <p className="mt-3 text-xs text-white/70">
            FIFO 消耗 · 过期批次优先扣减
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <div className="rounded-[24px] border border-fg-grey-200 bg-white p-5">
            <p className="text-xs text-fg-grey-500">本月发放</p>
            <p className="mt-2 text-2xl font-semibold text-fg-black">+2,700</p>
          </div>
          <div className="rounded-[24px] border border-fg-grey-200 bg-white p-5">
            <p className="text-xs text-fg-grey-500">本月消耗</p>
            <p className="mt-2 text-2xl font-semibold text-fg-black">−160</p>
          </div>
          <div className="rounded-[24px] border border-fg-grey-200 bg-white p-5">
            <p className="text-xs text-fg-grey-500">即将过期（7 日）</p>
            <p className="mt-2 text-2xl font-semibold text-amber-600">80</p>
          </div>
          <div className="rounded-[24px] border border-fg-grey-200 bg-white p-5">
            <p className="text-xs text-fg-grey-500">活跃批次</p>
            <p className="mt-2 text-2xl font-semibold text-fg-black">3</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonGroup
          color={siteConfig.accent}
          shape="pill"
          items={tabs.map((t) => ({ label: t.label }))}
          activeIndex={tab}
          onChange={setTab}
        />
        <p className="text-xs text-fg-grey-500">ledger：余额卡 + 类型 Tab + 流水表</p>
      </div>

      <DataTable<CreditRow>
        color={siteConfig.accent}
        columns={columns}
        rows={filtered}
        getRowKey={(row) => row.id}
      />
    </RefChrome>
  );
}
