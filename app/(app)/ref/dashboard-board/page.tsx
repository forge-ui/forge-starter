"use client";

/**
 * Dashboard board — dashboards/crm / ecommerce-2 style strip
 * Full product board still at /dashboard
 */

import {
  DataTable,
  LineChartStatCard,
  StatCard,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import { REF_RECORDS, REF_STATUS_META, type RefRecord } from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "dashboard-board")!;

const columns: ColumnDef<RefRecord>[] = [
  {
    key: "title",
    header: "线索 / 项目",
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
  {
    key: "amount",
    header: "金额",
    width: "w-28",
    render: (row) => <span className="text-sm text-fg-grey-700">{row.amount}</span>,
  },
];

export default function RefDashboardBoardPage() {
  return (
    <RefChrome meta={meta}>
      <p className="text-sm text-fg-grey-600">
        看板范式：KPI 行 + 趋势卡 + 列表/活动。产品级完整版见{" "}
        <a href="/dashboard/" className="font-medium text-fg-blue hover:underline">
          /dashboard
        </a>
        。
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="线索" value="128" trend="12%" trendDirection="up" subtitle="本周" theme="white" />
        <StatCard title="转化" value="18%" trend="2%" trendDirection="up" subtitle="环比" theme="white" />
        <StatCard title="营收" value="¥ 86万" trend="5%" trendDirection="down" subtitle="MTD" theme="white" />
        <StatCard title="待跟进" value="23" trend="需关注" trendDirection="down" subtitle="今日" theme="white" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <LineChartStatCard
          size="wide"
          theme="white"
          title="线索趋势"
          value="42"
          trend="8%"
          trendDirection="up"
          subtitle="近 7 日"
          chartColor="blue"
          width="full"
        />
        <div className="rounded-xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <h3 className="mb-3 text-sm font-semibold text-fg-black">今日活动</h3>
          <ul className="flex flex-col gap-2">
            {REF_RECORDS.slice(0, 4).map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-fg-grey-100 px-3 py-2.5"
              >
                <p className="text-sm font-semibold text-fg-black">{r.title}</p>
                <p className="text-xs text-fg-grey-500">
                  {r.owner} · {r.updated}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DataTable<RefRecord>
        color={siteConfig.accent}
        columns={columns}
        rows={REF_RECORDS}
        getRowKey={(row) => row.id}
      />
    </RefChrome>
  );
}
