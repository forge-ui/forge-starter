"use client";

/**
 * Dashboard layout: Forge ecommerce-2
 * https://www.forgeui.org/templates/dashboards/ecommerce-2
 * Business domain: admin account management
 */

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AltArrowRightLinear,
  ArrowRightUpLinear,
  BoxBoldDuotone,
  FilterLinear,
} from "solar-icon-set";
import {
  BarChartStatCard,
  BubbleChart,
  Button,
  CellImageText,
  CellMuted,
  CellText,
  CellTextSubtitle,
  ChartListItem,
  DataTable,
  KebabMenu,
  LineChartStatCard,
  ListGroup,
  MapCard,
  PlusIcon,
  ProgressStatCard,
  SmoothLineChart,
  StatusBadge,
  type ColumnDef,
  type MapRegion,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import {
  ACCOUNT_STATUS_META,
  type AdminAccount,
} from "@/lib/demo/accounts";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const regionsForMap: MapRegion[] = [
  { name: "华东", flag: "https://placehold.co/44x44/1e40af/fff?text=E", salesLabel: "42 账号", value: "华东" },
  { name: "华北", flag: "https://placehold.co/44x44/2563eb/fff?text=N", salesLabel: "28 账号", value: "华北" },
  { name: "华南", flag: "https://placehold.co/44x44/0ea5e9/fff?text=S", salesLabel: "19 账号", value: "华南" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { accounts, countsByStatus } = useDemoStore();

  const total = countsByStatus.all ?? 0;
  const active = countsByStatus.active ?? 0;
  const disabled = countsByStatus.disabled ?? 0;
  const pending = countsByStatus.pending ?? 0;
  const locked = countsByStatus.locked ?? 0;

  const roleRows = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of accounts) map.set(a.role, (map.get(a.role) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [accounts]);

  const topAccounts = accounts.slice(0, 7);

  const tableColumns: ColumnDef<AdminAccount>[] = useMemo(
    () => [
      {
        key: "user",
        header: "账号",
        sortable: true,
        flex: true,
        render: (row) => (
          <button type="button" className="text-left" onClick={() => router.push(`/accounts/${row.id}/`)}>
            <CellImageText src={row.avatarUrl} title={row.name} subtitle={row.email} rounded="full" />
          </button>
        ),
      },
      {
        key: "role",
        header: "角色",
        width: "w-[120px]",
        render: (row) => <CellMuted>{row.role}</CellMuted>,
      },
      {
        key: "lastLogin",
        header: "最近登录",
        width: "w-[120px]",
        render: (row) => <CellMuted>{row.lastLogin}</CellMuted>,
      },
      {
        key: "dept",
        header: "部门",
        width: "w-[140px]",
        render: (row) => <CellTextSubtitle title={row.department} subtitle={row.username} />,
      },
      {
        key: "logins",
        header: "登录次数",
        width: "w-[100px]",
        render: (row) => <CellText>{String(row.loginCount)}</CellText>,
      },
      {
        key: "status",
        header: "状态",
        width: "w-[100px]",
        render: (row) => (
          <StatusBadge
            label={ACCOUNT_STATUS_META[row.status].label}
            color={ACCOUNT_STATUS_META[row.status].color}
          />
        ),
      },
      {
        key: "actions",
        header: "",
        width: "w-[60px]",
        render: (row) => (
          <KebabMenu
            accent={siteConfig.accent}
            items={[
              { label: "查看", onSelect: () => router.push(`/accounts/${row.id}/`) },
              { label: "编辑", onSelect: () => router.push(`/accounts/${row.id}/edit/`) },
            ]}
          />
        ),
      },
    ],
    [router],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 [&>*]:!w-full">
        <ProgressStatCard
          title="账号总数"
          subtitle="管理后台"
          value={String(total)}
          trend="10%"
          trendDirection="up"
          theme="white"
          progressValue={total ? Math.min(100, total * 10) : 25}
          progressColor="blue"
          size="wide"
          width="full"
        />
        <LineChartStatCard
          title="启用中"
          subtitle="Active accounts"
          value={String(active)}
          trend="8%"
          trendDirection="up"
          size="wide"
          width="full"
          chartColor="green"
          series={[4, 5, 5, 6, 7, 6, 8, 9, 8, 10, 9, Math.max(active, 6)]}
        />
        <BarChartStatCard
          title="待激活 / 锁定"
          subtitle="Need attention"
          value={String(pending + locked)}
          trend="2%"
          trendDirection="down"
          size="wide"
          width="full"
          barColor="blue"
          bars={[4, 8, 12, 20, 14, 10, Math.max((pending + locked) * 4, 8)]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 rounded-3xl border border-fg-grey-200 bg-white p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-fg-black">Statistic</h3>
              <p className="text-sm text-fg-grey-500">账号状态趋势</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-fg-grey-100 p-1 text-xs">
              <button type="button" className="px-3 py-1.5 text-fg-grey-500">Day</button>
              <button type="button" className="px-3 py-1.5 text-fg-grey-500">Week</button>
              <button type="button" className="rounded-full bg-white px-3 py-1.5 text-fg-black shadow-sm">Month</button>
              <button type="button" className="px-3 py-1.5 text-fg-grey-500">Year</button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: "启用", value: String(active), trend: "10%", up: true, color: "#2563eb" },
              { label: "停用", value: String(disabled), trend: "2%", up: false, color: "#fbbf24" },
              { label: "待激活", value: String(pending), trend: "5%", up: true, color: "#0ea5e9" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-full text-white" style={{ backgroundColor: s.color }}>
                  <ArrowRightUpLinear size={16} />
                </div>
                <div>
                  <div className="text-xs text-fg-grey-500">{s.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-fg-black">{s.value}</span>
                    <span className={`text-xs font-medium ${s.up ? "text-emerald-500" : "text-fg-red"}`}>{s.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SmoothLineChart
            series={[
              { data: [0.5, 0.55, 0.65, 0.6, 0.55, 0.7, 0.55, 0.6, 0.6, 0.65, 0.55, 0.5].map((v) => v * 1000), color: "#2563eb" },
              { data: [0.4, 0.4, 0.5, 0.45, 0.42, 0.55, 0.45, 0.5, 0.45, 0.55, 0.4, 0.45].map((v) => v * 1000), color: "#fbbf24" },
              { data: [0.2, 0.22, 0.25, 0.22, 0.2, 0.3, 0.22, 0.2, 0.18, 0.2, 0.18, 0.2].map((v) => v * 1000), color: "#ef4444" },
            ]}
            accent="blue"
            activeIndex={6}
            showTooltip
            tooltipItems={[
              { label: "启用", value: String(active), trend: "up", color: "#2563eb" },
              { label: "停用", value: String(disabled), trend: "down", color: "#fbbf24" },
              { label: "锁定", value: String(locked), trend: "up", color: "#ef4444" },
            ]}
            showYAxis
            yAxisLabels={["$1.2k", "$1k", "$800", "$600", "$400", "$200", "0"]}
            xAxisLabels={months}
            height="h-[260px]"
          />
        </div>

        <div className="flex flex-col gap-5 rounded-3xl border border-fg-grey-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-fg-black">状态占比</h3>
              <p className="text-sm text-fg-grey-500">Based on status</p>
            </div>
            <KebabMenu
              accent={siteConfig.accent}
              items={[{ label: "账号列表", onSelect: () => router.push("/accounts/") }]}
            />
          </div>
          <BubbleChart
            accent="blue"
            height={240}
            bubbles={[
              { value: Math.max((active / Math.max(total, 1)) * 100, 8), label: `${Math.round((active / Math.max(total, 1)) * 100)}%`, color: "bg-fg-blue-500" },
              { value: Math.max((disabled / Math.max(total, 1)) * 100, 6), label: `${Math.round((disabled / Math.max(total, 1)) * 100)}%`, color: "bg-yellow-400" },
              { value: Math.max((pending / Math.max(total, 1)) * 100, 4), label: `${Math.round((pending / Math.max(total, 1)) * 100)}%`, color: "bg-sky-500" },
              { value: Math.max((locked / Math.max(total, 1)) * 100, 2), label: `${Math.round((locked / Math.max(total, 1)) * 100)}%`, color: "bg-orange-500" },
            ]}
          />
          <div className="grid grid-cols-2 gap-2 text-xs text-fg-grey-700">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#2563eb]" /> 启用</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#fbbf24]" /> 停用</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#0ea5e9]" /> 待激活</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#f97316]" /> 锁定</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MapCard
          title="区域分布"
          subtitle="账号示意"
          color="blue"
          variant="md"
          width="full"
          regions={regionsForMap}
          highlights={["north-america", "europe", "asia", "oceania"]}
        />

        <ListGroup
          title="最近账号"
          subtitle="Based on activity"
          action={
            <KebabMenu
              accent={siteConfig.accent}
              items={[{ label: "查看全部", onSelect: () => router.push("/accounts/") }]}
            />
          }
          items={
            <div className="flex flex-col">
              {topAccounts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="flex items-center gap-3 py-2.5 text-left"
                  onClick={() => router.push(`/accounts/${p.id}/`)}
                >
                  <div className="flex size-10 overflow-hidden rounded-full bg-fg-grey-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.avatarUrl} alt="" className="size-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-fg-black">{p.name}</div>
                    <div className="text-xs text-fg-grey-500">{p.email}</div>
                  </div>
                  <div className="text-right text-xs text-emerald-500">
                    {ACCOUNT_STATUS_META[p.status].label}
                  </div>
                </button>
              ))}
            </div>
          }
        />

        <ListGroup
          title="角色分布"
          subtitle="Based on role"
          action={
            <KebabMenu accent={siteConfig.accent} items={[{ label: "刷新", onSelect: () => undefined }]} />
          }
          items={
            <div className="flex flex-col">
              {roleRows.map(([name, count]) => (
                <ChartListItem
                  key={name}
                  icon={BoxBoldDuotone}
                  accent="blue"
                  title={name}
                  subtitle="角色"
                  value={`${count} 人`}
                />
              ))}
            </div>
          }
        />
      </div>

      <div className="flex flex-col gap-5 rounded-3xl border border-fg-grey-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-fg-black">最近账号</h3>
            <p className="text-sm text-fg-grey-500">与账号管理列表同一数据源</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button color={siteConfig.accent} variant="tertiary" size="sm" iconLeft={<FilterLinear size={14} />}>
              Filters
            </Button>
            <Button
              color={siteConfig.accent}
              size="sm"
              iconRight={<AltArrowRightLinear size={14} />}
              onClick={() => router.push("/accounts/")}
            >
              See More
            </Button>
            <Button
              color={siteConfig.accent}
              size="sm"
              iconLeft={<PlusIcon size={14} />}
              onClick={() => router.push("/accounts/new/")}
            >
              新建账号
            </Button>
          </div>
        </div>
        <DataTable<AdminAccount>
          color={siteConfig.accent}
          columns={tableColumns}
          rows={accounts.slice(0, 8)}
          showCheckbox
          checkboxColor={siteConfig.accent}
          showPagination
          currentPage={1}
          totalPages={Math.max(1, Math.ceil(accounts.length / 8))}
          paginationLabel={`Showing 1-${Math.min(8, accounts.length)} from ${accounts.length}`}
          getRowKey={(row) => row.id}
        />
      </div>
    </div>
  );
}
