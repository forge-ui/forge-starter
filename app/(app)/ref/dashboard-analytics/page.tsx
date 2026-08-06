"use client";

/**
 * Analytics dashboard — templates/(dashboards)/dashboards/analytics
 * https://www.forgeui.org/templates/dashboards/analytics
 */

import {
  CalendarMinimalisticLinear,
  CartLargeBoldDuotone,
  ChartBoldDuotone,
  DocumentBoldDuotone,
  PhoneLinear,
  TagBoldDuotone,
  VideocameraRecordLinear,
  WalletBoldDuotone,
} from "solar-icon-set";
import {
  Button,
  CellText,
  ChartListItem,
  DataTable,
  KebabMenu,
  ListGroup,
  MapCard,
  ProgressBadge,
  ProgressStatCard,
  type ColumnDef,
  type MapRegion,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "dashboard-analytics")!;

const visitSources = [
  {
    icon: VideocameraRecordLinear,
    accent: "black" as const,
    title: "Tiktok",
    subtitle: "Tiktok post",
    value: "1,240",
  },
  {
    icon: ChartBoldDuotone,
    accent: "blue" as const,
    title: "Google",
    subtitle: "Google ads",
    value: "1,189",
    trend: "7%",
    trendDirection: "up" as const,
  },
  {
    icon: ChartBoldDuotone,
    accent: "blue" as const,
    title: "Facebook",
    subtitle: "Facebook post",
    value: "1,100",
  },
  {
    icon: PhoneLinear,
    accent: "blue" as const,
    title: "WhatsApp",
    subtitle: "Direct message",
    value: "908",
    trend: "8%",
    trendDirection: "up" as const,
  },
  {
    icon: ChartBoldDuotone,
    accent: "purple" as const,
    title: "Instagram",
    subtitle: "Instagram post",
    value: "900",
    trend: "9%",
    trendDirection: "down" as const,
  },
];

const topCategories = [
  { name: "Smartphone", subtitle: "640 Sales", price: "$24,500", delta: "5%", color: "purple" as const },
  { name: "Keyboard", subtitle: "120 Sales", price: "$12,500", color: "blue" as const },
  { name: "Controller", subtitle: "132 Sales", price: "$12,251", delta: "8%", color: "blue" as const },
  { name: "Laptop", subtitle: "10 Sales", price: "$10,092", delta: "5%", color: "blue" as const },
  { name: "Headphone", subtitle: "198 Sales", price: "$9,992", delta: "7.5%", color: "purple" as const },
];

type ReferralRow = {
  id: string;
  page: string;
  sessions: string;
  sessionsDelta: string;
  sessionsTrend: "up" | "down" | "flat";
  rate: string;
  rateDelta: string;
  rateTrend: "up" | "down" | "flat";
};

const referralRows: ReferralRow[] = [
  { id: "1", page: "Facebook", sessions: "1,259", sessionsDelta: "10%", sessionsTrend: "up", rate: "45.01%", rateDelta: "15%", rateTrend: "up" },
  { id: "2", page: "Google", sessions: "1,069", sessionsDelta: "5%", sessionsTrend: "down", rate: "41.90%", rateDelta: "0%", rateTrend: "flat" },
  { id: "3", page: "Direct Messages", sessions: "974", sessionsDelta: "12%", sessionsTrend: "up", rate: "35%", rateDelta: "8%", rateTrend: "down" },
  { id: "4", page: "Blueskit.com", sessions: "891", sessionsDelta: "0%", sessionsTrend: "flat", rate: "32%", rateDelta: "5%", rateTrend: "up" },
  { id: "5", page: "Instagram", sessions: "702", sessionsDelta: "0%", sessionsTrend: "flat", rate: "28.05%", rateDelta: "0%", rateTrend: "flat" },
];

type PerformingRow = {
  id: string;
  page: string;
  clicks: string;
  clicksDelta: string;
  clicksTrend: "up" | "down" | "flat";
  position: string;
  positionDelta: string;
  positionTrend: "up" | "down" | "flat";
};

const performingRows: PerformingRow[] = [
  { id: "1", page: "Homepage", clicks: "1,759", clicksDelta: "10%", clicksTrend: "up", position: "3.90", positionDelta: "10%", positionTrend: "up" },
  { id: "2", page: "Product List", clicks: "1,569", clicksDelta: "9%", clicksTrend: "down", position: "3.87", positionDelta: "9%", positionTrend: "down" },
  { id: "3", page: "Voucher List", clicks: "1,278", clicksDelta: "0%", clicksTrend: "flat", position: "3.01", positionDelta: "0%", positionTrend: "flat" },
  { id: "4", page: "Campaign.blackfriday.com", clicks: "907", clicksDelta: "12%", clicksTrend: "down", position: "2.76", positionDelta: "12%", positionTrend: "down" },
  { id: "5", page: "Sale.1212.com", clicks: "891", clicksDelta: "23%", clicksTrend: "up", position: "2.50", positionDelta: "23%", positionTrend: "up" },
];

const trendColor = (trend: "up" | "down" | "flat") =>
  (trend === "up" ? "green" : trend === "down" ? "red" : "grey") as "green" | "red" | "grey";

const referralColumns: ColumnDef<ReferralRow>[] = [
  { key: "page", header: "Pages", flex: true, render: (r) => <CellText>{r.page}</CellText> },
  {
    key: "sessions",
    header: "Sessions",
    width: "w-[160px]",
    render: (r) => (
      <div className="flex items-center gap-2">
        <CellText>{r.sessions}</CellText>
        <ProgressBadge label={r.sessionsDelta} color={trendColor(r.sessionsTrend)} />
      </div>
    ),
  },
  {
    key: "rate",
    header: "Conv. Rate",
    width: "w-[160px]",
    render: (r) => (
      <div className="flex items-center gap-2">
        <CellText>{r.rate}</CellText>
        <ProgressBadge label={r.rateDelta} color={trendColor(r.rateTrend)} />
      </div>
    ),
  },
];

const performingColumns: ColumnDef<PerformingRow>[] = [
  { key: "page", header: "Pages", flex: true, render: (r) => <CellText>{r.page}</CellText> },
  {
    key: "clicks",
    header: "Clicks",
    width: "w-[160px]",
    render: (r) => (
      <div className="flex items-center gap-2">
        <CellText>{r.clicks}</CellText>
        <ProgressBadge label={r.clicksDelta} color={trendColor(r.clicksTrend)} />
      </div>
    ),
  },
  {
    key: "position",
    header: "Avg. Position",
    width: "w-[160px]",
    render: (r) => (
      <div className="flex items-center gap-2">
        <CellText>{r.position}</CellText>
        <ProgressBadge label={r.positionDelta} color={trendColor(r.positionTrend)} />
      </div>
    ),
  },
];

const regionsForMap: MapRegion[] = [
  {
    name: "United Kingdom",
    flag: "https://placehold.co/44x44/1e40af/fff?text=UK",
    salesLabel: "340 Session",
    value: "$17,678",
  },
  {
    name: "Spain",
    flag: "https://placehold.co/44x44/dc2626/fff?text=ES",
    salesLabel: "100 Session",
    value: "$5,500",
  },
  {
    name: "Indonesia",
    flag: "https://placehold.co/44x44/dc2626/fff?text=ID",
    salesLabel: "50 Session",
    value: "$2,500",
  },
];

const incomeBars = [18, 22, 28, 24, 32, 30, 36, 34, 40, 38, 42, 48];
const expenseBars = [10, 12, 14, 16, 15, 18, 17, 20, 19, 22, 21, 24];
const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

export default function RefDashboardAnalyticsPage() {
  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-fg-black">Dashboard</h2>
          <p className="text-sm text-fg-grey-500">
            Analytics：四 Progress 指标 + 统计柱 + Campaign + 地图/来源 + 双表
          </p>
        </div>
        <Button variant="tertiary" iconLeft={<CalendarMinimalisticLinear size={16} />}>
          Select Dates
        </Button>
      </div>

      {/* 4 progress stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:!w-full">
        <ProgressStatCard
          density="compact"
          size="wide"
          width="full"
          title="Income"
          value="6,784"
          trend="10%"
          trendDirection="up"
          subtitle="+150 today"
          theme="white"
          progressValue={25}
          progressColor="purple"
          icon={<WalletBoldDuotone size={18} />}
        />
        <ProgressStatCard
          density="compact"
          size="wide"
          width="full"
          title="Orders"
          value="4,412"
          trend="5%"
          trendDirection="down"
          subtitle="+150 today"
          theme="white"
          progressValue={25}
          progressColor="blue"
          icon={<CartLargeBoldDuotone size={18} />}
        />
        <ProgressStatCard
          density="compact"
          size="wide"
          width="full"
          title="Profit"
          value="1,920"
          trend="2%"
          trendDirection="up"
          subtitle="+150 today"
          theme="white"
          progressValue={25}
          progressColor="green"
          icon={<ChartBoldDuotone size={18} />}
        />
        <ProgressStatCard
          density="compact"
          size="wide"
          width="full"
          title="Expenses"
          value="329"
          trend="0%"
          trendDirection="down"
          subtitle="+150 today"
          theme="white"
          progressValue={25}
          progressColor="red"
          icon={<TagBoldDuotone size={18} />}
        />
      </div>

      {/* Statistic bars + Campaign goals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-4 lg:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-fg-black">Statistic</h3>
            <p className="text-sm text-fg-grey-500">Income and expenses（分组柱示意）</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-fg-violet" /> Income
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-fg-blue-400" /> Expenses
            </span>
          </div>
          <div className="flex items-end gap-1" style={{ height: 180 }}>
            {incomeBars.map((income, i) => (
              <div key={months[i]} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full max-w-[36px] items-end justify-center gap-0.5" style={{ height: 150 }}>
                  <div
                    className="w-1/2 rounded-t-sm bg-fg-violet"
                    style={{ height: `${(income / 50) * 100}%` }}
                  />
                  <div
                    className="w-1/2 rounded-t-sm bg-fg-blue-400"
                    style={{ height: `${(expenseBars[i] / 50) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-fg-grey-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <ListGroup
          density="compact"
          title="Campaign"
          subtitle="Active campaign"
          action={<KebabMenu accent={siteConfig.accent} items={[{ label: "Refresh", onSelect: () => {} }]} />}
          items={
            <div className="flex flex-col gap-3">
              {[
                { title: "Black Friday", date: "22 Nov - 29 Nov 2024", amount: "$40,000", progress: 45, color: "bg-fg-violet" },
                { title: "Audio 30% Off", date: "01 Aug - 31 Nov 2024", amount: "$40,000", progress: 62, color: "bg-emerald-500" },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-fg-grey-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-fg-black">{c.title}</div>
                      <div className="text-xs text-fg-grey-500">{c.date}</div>
                    </div>
                    <div className="text-sm font-semibold text-fg-black">{c.amount}</div>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-fg-grey-100">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="mt-1 text-right text-xs text-fg-grey-500">{c.progress}%</div>
                </div>
              ))}
            </div>
          }
        />
      </div>

      {/* Map + sources + categories */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MapCard
          title="Top Region"
          subtitle="User session in each region"
          color="purple"
          variant="sm"
          width="full"
          regions={regionsForMap}
          highlights={["north-america", "europe", "asia", "oceania"]}
        />

        <ListGroup
          density="compact"
          title="Visit by Source"
          subtitle="Link clicked"
          action={<KebabMenu accent={siteConfig.accent} items={[{ label: "Refresh", onSelect: () => {} }]} />}
          items={
            <div className="flex flex-col">
              {visitSources.map((s) => (
                <ChartListItem
                  key={s.title + s.subtitle}
                  icon={s.icon}
                  accent={s.accent}
                  title={s.title}
                  subtitle={s.subtitle}
                  value={s.value}
                  trend={s.trend}
                  trendDirection={s.trendDirection}
                />
              ))}
            </div>
          }
        />

        <ListGroup
          density="compact"
          title="Top Category"
          subtitle="Based on sales"
          action={<KebabMenu accent={siteConfig.accent} items={[{ label: "Refresh", onSelect: () => {} }]} />}
          items={
            <div className="flex flex-col">
              {topCategories.map((c) => (
                <ChartListItem
                  key={c.name}
                  icon={ChartBoldDuotone}
                  accent={c.color}
                  title={c.name}
                  subtitle={c.subtitle}
                  value={c.price}
                  trend={c.delta}
                  trendDirection="up"
                />
              ))}
            </div>
          }
        />
      </div>

      {/* Dual tables */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-fg-black">Top Referral Pages</h3>
              <p className="text-sm text-fg-grey-500">Based on session</p>
            </div>
            <Button size="sm" color={siteConfig.accent} iconLeft={<DocumentBoldDuotone size={14} />}>
              Reports
            </Button>
          </div>
          <DataTable<ReferralRow>
            color={siteConfig.accent}
            columns={referralColumns}
            rows={referralRows}
            getRowKey={(row) => row.id}
          />
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-fg-black">Top Performing Pages</h3>
              <p className="text-sm text-fg-grey-500">Based on clicks</p>
            </div>
            <Button size="sm" color={siteConfig.accent} iconLeft={<DocumentBoldDuotone size={14} />}>
              Reports
            </Button>
          </div>
          <DataTable<PerformingRow>
            color={siteConfig.accent}
            columns={performingColumns}
            rows={performingRows}
            getRowKey={(row) => row.id}
          />
        </div>
      </div>
    </RefChrome>
  );
}
