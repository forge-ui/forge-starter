"use client";

/**
 * Dashboard layout aligned with Forge template:
 * https://www.forgeui.org/templates/dashboards/ecommerce-2
 * Source: forge/src/app/templates/(dashboards)/dashboards/ecommerce-2/page.tsx
 *
 * Metrics / recent table are driven by the starter demo store (business records).
 * Accent chrome uses siteConfig blue (starter brand); multi-series chart colors follow the template.
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
  type StatusBadgeColor,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import {
  RECORD_STATUS_META,
  type BusinessRecord,
  type RecordStatus,
} from "@/lib/demo/records";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const regionsForMap: MapRegion[] = [
  { name: "United Kingdom", flag: "https://placehold.co/44x44/1e40af/fff?text=UK", salesLabel: "340 Sales", value: "$17,678" },
  { name: "Spain", flag: "https://placehold.co/44x44/dc2626/fff?text=ES", salesLabel: "100 Sales", value: "$5,500" },
  { name: "Indonesia", flag: "https://placehold.co/44x44/dc2626/fff?text=ID", salesLabel: "50 Sales", value: "$2,500" },
];

function statusColor(status: RecordStatus): StatusBadgeColor {
  return RECORD_STATUS_META[status].color;
}

export default function DashboardPage() {
  const router = useRouter();
  const { records, countsByStatus } = useDemoStore();

  const total = countsByStatus.all ?? 0;
  const active = countsByStatus.active ?? 0;
  const done = countsByStatus.done ?? 0;
  const draft = countsByStatus.draft ?? 0;
  const blocked = countsByStatus.blocked ?? 0;

  const categoryRows = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) map.set(r.category, (map.get(r.category) ?? 0) + 1);
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [records]);

  const topRecords = records.slice(0, 7);

  const tableColumns: ColumnDef<BusinessRecord>[] = useMemo(
    () => [
      {
        key: "code",
        header: "编号",
        sortable: true,
        width: "w-[120px]",
        render: (row) => <CellText>{row.code}</CellText>,
      },
      {
        key: "name",
        header: "记录",
        sortable: true,
        flex: true,
        render: (row) => (
          <button
            type="button"
            className="text-left"
            onClick={() => router.push(`/examples/detail/?id=${row.id}`)}
          >
            <CellImageText src={row.imageUrl} title={row.name} subtitle={row.subtitle} />
          </button>
        ),
      },
      {
        key: "updated",
        header: "更新",
        sortable: true,
        width: "w-[120px]",
        render: (row) => <CellMuted>{row.updatedDate}</CellMuted>,
      },
      {
        key: "owner",
        header: "负责人",
        width: "w-[160px]",
        render: (row) => (
          <CellTextSubtitle title={row.owner} subtitle={row.category} />
        ),
      },
      {
        key: "status",
        header: "状态",
        sortable: true,
        width: "w-[120px]",
        render: (row) => (
          <StatusBadge label={RECORD_STATUS_META[row.status].label} color={statusColor(row.status)} />
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
              { label: "查看", onSelect: () => router.push(`/examples/detail/?id=${row.id}`) },
              { label: "编辑", onSelect: () => router.push(`/examples/form/?id=${row.id}`) },
            ]}
          />
        ),
      },
    ],
    [router],
  );

  const bubbleTotal = Math.max(total, 1);
  const bubbles = [
    { value: Math.round((active / bubbleTotal) * 10000) / 100 || 8, label: `${Math.round((active / bubbleTotal) * 100) || 0}%`, color: "bg-fg-blue-500" },
    { value: Math.round((done / bubbleTotal) * 10000) / 100 || 6, label: `${Math.round((done / bubbleTotal) * 100) || 0}%`, color: "bg-yellow-400" },
    { value: Math.round((draft / bubbleTotal) * 10000) / 100 || 4, label: `${Math.round((draft / bubbleTotal) * 100) || 0}%`, color: "bg-sky-500" },
    { value: Math.round((blocked / bubbleTotal) * 10000) / 100 || 2, label: `${Math.round((blocked / bubbleTotal) * 100) || 0}%`, color: "bg-orange-500" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 3 stats — ecommerce-2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 [&>*]:!w-full">
        <ProgressStatCard
          title="全部记录"
          subtitle="Demo store"
          value={String(total)}
          trend="10%"
          trendDirection="up"
          theme="white"
          progressValue={total ? Math.min(100, total * 8) : 25}
          progressColor="blue"
          size="wide"
          width="full"
        />
        <LineChartStatCard
          title="进行中"
          subtitle="Active records"
          value={String(active)}
          trend="10%"
          trendDirection="up"
          size="wide"
          width="full"
          chartColor="red"
          chartDirection="down"
          series={[10, 14, 12, 18, 16, 20, 18, 22, 20, 24, 22, Math.max(active * 2, 12)]}
        />
        <BarChartStatCard
          title="已完成"
          subtitle="Completed"
          value={String(done)}
          trend="10%"
          trendDirection="up"
          size="wide"
          width="full"
          barColor="blue"
          bars={[10, 30, 60, 95, 50, 40, Math.max(done * 8, 30)]}
        />
      </div>

      {/* Statistic + Expenses bubbles — ecommerce-2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 rounded-3xl border border-fg-grey-200 bg-white p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-fg-black">Statistic</h3>
              <p className="text-sm text-fg-grey-500">记录状态趋势（演示序列）</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-fg-grey-100 p-1 text-xs">
              <button type="button" className="px-3 py-1.5 text-fg-grey-500">Day</button>
              <button type="button" className="px-3 py-1.5 text-fg-grey-500">Week</button>
              <button type="button" className="rounded-full bg-white px-3 py-1.5 text-fg-black shadow-sm">
                Month
              </button>
              <button type="button" className="px-3 py-1.5 text-fg-grey-500">Year</button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: "进行中", value: String(active), trend: "10%", up: true, color: "#2563eb" },
              { label: "草稿", value: String(draft), trend: "4%", up: false, color: "#fbbf24" },
              { label: "已完成", value: String(done), trend: "8%", up: true, color: "#0ea5e9" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div
                  className="flex size-9 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: s.color }}
                >
                  <ArrowRightUpLinear size={16} />
                </div>
                <div>
                  <div className="text-xs text-fg-grey-500">{s.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-fg-black">{s.value}</span>
                    <span className={`text-xs font-medium ${s.up ? "text-emerald-500" : "text-fg-red"}`}>
                      {s.trend}
                    </span>
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
              { label: "进行中", value: String(active), trend: "up", color: "#2563eb" },
              { label: "草稿", value: String(draft), trend: "down", color: "#fbbf24" },
              { label: "已完成", value: String(done), trend: "up", color: "#0ea5e9" },
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
              <p className="text-sm text-fg-grey-500">Based on category</p>
            </div>
            <KebabMenu
              accent={siteConfig.accent}
              items={[{ label: "打开列表", onSelect: () => router.push("/examples/list/") }]}
            />
          </div>
          <BubbleChart bubbles={bubbles} accent="blue" height={240} />
          <div className="grid grid-cols-2 gap-2 text-xs text-fg-grey-700">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: "#2563eb" }} /> 进行中
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: "#fbbf24" }} /> 已完成
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: "#0ea5e9" }} /> 草稿
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: "#f97316" }} /> 已阻断
            </span>
          </div>
        </div>
      </div>

      {/* Top Region + Top Product + Top Category — ecommerce-2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MapCard
          title="Top Region"
          subtitle="Sales by region"
          color="blue"
          variant="md"
          width="full"
          regions={regionsForMap}
          highlights={["north-america", "europe", "asia", "oceania"]}
          onMenuClick={() => undefined}
        />

        <ListGroup
          title="最近记录"
          subtitle="Based on activity"
          action={
            <KebabMenu
              accent={siteConfig.accent}
              items={[{ label: "查看全部", onSelect: () => router.push("/examples/list/") }]}
            />
          }
          items={
            <div className="flex flex-col">
              {topRecords.length === 0 ? (
                <p className="py-8 text-center text-sm text-fg-grey-500">暂无记录</p>
              ) : (
                topRecords.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="flex items-center gap-3 py-2.5 text-left hover:opacity-90"
                    onClick={() => router.push(`/examples/detail/?id=${p.id}`)}
                  >
                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-fg-grey-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt={p.name} className="size-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-fg-black">{p.name}</div>
                      <div className="text-xs text-fg-grey-500">{p.code}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-fg-black">{p.owner}</div>
                      <div className="text-xs text-emerald-500">{RECORD_STATUS_META[p.status].label}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          }
        />

        <ListGroup
          title="分类排行"
          subtitle="Based on records"
          action={
            <KebabMenu
              accent={siteConfig.accent}
              items={[{ label: "刷新", onSelect: () => undefined }]}
            />
          }
          items={
            <div className="flex flex-col">
              {(categoryRows.length ? categoryRows : [{ name: "暂无", count: 0 }]).map((c, i) => (
                <ChartListItem
                  key={c.name + i}
                  icon={BoxBoldDuotone}
                  accent={i === 0 ? "blue" : "blue"}
                  title={c.name}
                  subtitle="分类"
                  value={`${c.count} 条`}
                />
              ))}
            </div>
          }
        />
      </div>

      {/* Recent table — ecommerce-2 Recent Orders */}
      <div className="flex flex-col gap-5 rounded-3xl border border-fg-grey-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-fg-black">最近业务记录</h3>
            <p className="text-sm text-fg-grey-500">与列表页同一数据源</p>
          </div>
          <div className="flex items-center gap-2">
            <Button color={siteConfig.accent} variant="tertiary" size="sm" iconLeft={<FilterLinear size={14} />}>
              Filters
            </Button>
            <Button color={siteConfig.accent} variant="tertiary" size="sm">
              Show {Math.min(8, records.length)}
            </Button>
            <Button
              color={siteConfig.accent}
              size="sm"
              iconRight={<AltArrowRightLinear size={14} />}
              onClick={() => router.push("/examples/list/")}
            >
              See More
            </Button>
            <Button
              color={siteConfig.accent}
              size="sm"
              iconLeft={<PlusIcon size={14} />}
              onClick={() => router.push("/examples/form/")}
            >
              新建
            </Button>
          </div>
        </div>
        <DataTable<BusinessRecord>
          color={siteConfig.accent}
          columns={tableColumns}
          rows={records.slice(0, 8)}
          showCheckbox
          checkboxColor={siteConfig.accent}
          showPagination
          currentPage={1}
          totalPages={Math.max(1, Math.ceil(records.length / 8))}
          onPageChange={() => undefined}
          paginationLabel={`Showing 1-${Math.min(8, records.length)} from ${records.length}`}
          getRowKey={(row) => row.id}
        />
      </div>
    </div>
  );
}
