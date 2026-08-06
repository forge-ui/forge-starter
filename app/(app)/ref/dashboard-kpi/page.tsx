"use client";

import {
  DataTable,
  ProgressStatCard,
  StatCard,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import {
  REF_RECORDS,
  REF_STATUS_META,
  type RefRecord,
} from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "dashboard-kpi")!;

const columns: ColumnDef<RefRecord>[] = [
  {
    key: "title",
    header: "近期记录",
    flex: true,
    render: (row) => (
      <div className="flex h-10 flex-col justify-center">
        <span className="text-sm font-semibold text-fg-black">{row.title}</span>
        <span className="text-xs text-fg-grey-500">{row.owner}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "状态",
    width: "w-28",
    render: (row) => (
      <div className="flex h-10 items-center">
        <StatusBadge
          label={REF_STATUS_META[row.status].label}
          color={REF_STATUS_META[row.status].color}
        />
      </div>
    ),
  },
];

export default function RefDashboardKpiPage() {
  const active = REF_RECORDS.filter((r) => r.status === "active").length;
  const pending = REF_RECORDS.filter((r) => r.status === "pending").length;

  return (
    <RefChrome meta={meta}>
      <p className="text-sm text-fg-grey-600">
        精简 KPI 条。完整图表看板见产品页{" "}
        <a href="/dashboard/" className="font-medium text-fg-blue hover:underline">
          /dashboard
        </a>
        。
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="记录总数"
          value={String(REF_RECORDS.length)}
          trend="示意"
          trendDirection="up"
          subtitle="mock"
          theme="white"
        />
        <StatCard
          title="进行中"
          value={String(active)}
          trend="—"
          trendDirection="up"
          subtitle="active"
          theme="white"
        />
        <StatCard
          title="待处理"
          value={String(pending)}
          trend="需关注"
          trendDirection="down"
          subtitle="pending"
          theme="white"
        />
        <ProgressStatCard
          title="完成度"
          value="62%"
          progressValue={62}
          progressColor="blue"
          trend="示意"
          trendDirection="up"
          subtitle="示意进度"
          theme="white"
        />
      </div>
      <DataTable<RefRecord>
        color={siteConfig.accent}
        columns={columns}
        rows={REF_RECORDS.slice(0, 4)}
        getRowKey={(row) => row.id}
      />
    </RefChrome>
  );
}
