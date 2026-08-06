"use client";

/**
 * CRM dashboard — templates/(dashboards)/dashboards/crm
 * https://www.forgeui.org/templates/dashboards/crm
 */

import {
  CalendarMinimalisticLinear,
  DocumentTextLinear,
  UsersGroupRoundedLinear,
  UsersGroupTwoRoundedBoldDuotone,
  VideocameraRecordLinear,
  WalletBoldDuotone,
} from "solar-icon-set";
import {
  ActivityCard,
  BarChartStatCard,
  Button,
  CellImageText,
  CellMuted,
  CellText,
  DataTable,
  KebabMenu,
  Label,
  ListGroup,
  MeterChart,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "dashboard-crm")!;

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "New" | "Hot" | "Warm" | "Cold" | "Success";
  added: string;
  avatar: string;
};

const leadStatusColor: Record<LeadRow["status"], "blue" | "red" | "yellow" | "cyan" | "green"> = {
  New: "blue",
  Hot: "red",
  Warm: "yellow",
  Cold: "cyan",
  Success: "green",
};

const leads: LeadRow[] = [
  {
    id: "1",
    name: "John Bushmill",
    email: "johnb@mail.com",
    phone: "+1 987 555 909",
    status: "Hot",
    added: "02 Aug 2026",
    avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=john-bushmill",
  },
  {
    id: "2",
    name: "Lisa Greg",
    email: "lisagreg@mail.com",
    phone: "+1 512 444 201",
    status: "New",
    added: "01 Aug 2026",
    avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=lisa-greg",
  },
  {
    id: "3",
    name: "Agung Ilham",
    email: "agung@mail.com",
    phone: "+62 812 9001 221",
    status: "Warm",
    added: "30 Jul 2026",
    avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=agung",
  },
  {
    id: "4",
    name: "Mia Chen",
    email: "mia@mail.com",
    phone: "+86 138 0000 1122",
    status: "Success",
    added: "28 Jul 2026",
    avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=mia-chen",
  },
  {
    id: "5",
    name: "Josh Adam",
    email: "josh@mail.com",
    phone: "+1 415 220 778",
    status: "Cold",
    added: "25 Jul 2026",
    avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=josh-adam",
  },
];

const leadColumns: ColumnDef<LeadRow>[] = [
  {
    key: "name",
    header: "Name",
    flex: true,
    render: (r) => (
      <CellImageText src={r.avatar} title={r.name} subtitle={r.email} rounded="full" />
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "w-[120px]",
    render: (r) => <StatusBadge label={r.status} color={leadStatusColor[r.status]} />,
  },
  {
    key: "phone",
    header: "Phone",
    width: "w-[160px]",
    render: (r) => <CellText>{r.phone}</CellText>,
  },
  {
    key: "added",
    header: "Added",
    width: "w-[140px]",
    render: (r) => <CellMuted>{r.added}</CellMuted>,
  },
  {
    key: "actions",
    header: "",
    width: "w-[60px]",
    render: () => <KebabMenu accent={siteConfig.accent} items={[{ label: "View", onSelect: () => {} }]} />,
  },
];

const salesBars = [12, 18, 24, 16, 28, 22, 30, 26, 32, 20, 28, 34];
const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export default function RefDashboardCrmPage() {
  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-fg-black">Overview</h2>
          <p className="text-sm text-fg-grey-500">CRM 工作台：高亮营收卡 + 柱状指标 + 转化率 + 线索表 + 活动流</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            color="grey"
            variant="tertiary"
            iconLeft={<CalendarMinimalisticLinear size={16} />}
          >
            Select Dates
          </Button>
          <KebabMenu accent={siteConfig.accent} items={[{ label: "Refresh", onSelect: () => {} }]} />
        </div>
      </div>

      {/* Revenue highlight + two bar stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 [&>*]:!w-full">
        <div className="relative flex flex-col gap-3 overflow-hidden rounded-card bg-fg-violet p-4 text-white">
          <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-fg-violet-700 opacity-50" />
          <div className="absolute -right-6 -top-6 size-32 rounded-full bg-fg-violet-600 opacity-40" />
          <div className="relative flex items-start justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <div className="text-base font-medium text-white">Revenue</div>
              <div className="text-xs text-white/75">2 Jul - Today</div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-white/15">
              <WalletBoldDuotone size={18} />
            </div>
          </div>
          <div className="relative text-3xl font-semibold leading-9">1,200</div>
          <div className="relative">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/75">Progress</span>
              <span>25%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-fg-violet-800/50">
              <div className="h-full rounded-full bg-fg-red" style={{ width: "25%" }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-fg-green">10%</span>
              <span className="text-white/75">+$150 today</span>
            </div>
          </div>
        </div>

        <BarChartStatCard
          title="Leads"
          value="44,210"
          trend="10%"
          trendDirection="up"
          subtitle="+150 today"
          size="wide"
          width="full"
          barColor="purple"
          bars={[16, 24, 32, 20, 40]}
        />
        <BarChartStatCard
          title="Customer"
          value="21,230"
          trend="10%"
          trendDirection="up"
          subtitle="+150 today"
          size="wide"
          width="full"
          barColor="purple"
          bars={[14, 22, 18, 38, 28]}
        />
      </div>

      {/* Average sales mini-bars + Success Rate meter */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-4 lg:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-fg-black">Average Sales</h3>
            <p className="text-sm text-fg-grey-500">Income trend (示意柱，无 Figma 私有图组件)</p>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: 180 }}>
            {salesBars.map((v, i) => (
              <div key={months[i]} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-fg-violet"
                  style={{ height: `${(v / 36) * 100}%` }}
                  title={`${months[i]}: ${v}`}
                />
                <span className="text-[10px] text-fg-grey-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-fg-grey-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-fg-black">Success Rate</h3>
              <p className="text-sm text-fg-grey-500">Conversion rate</p>
            </div>
            <KebabMenu accent={siteConfig.accent} items={[{ label: "Refresh", onSelect: () => {} }]} />
          </div>
          <MeterChart
            segments={[{ value: 75, color: "bg-fg-violet" }]}
            accent="purple"
            trend="5.8%"
            trendDirection="up"
            subtitle="+86 today"
          />
          <p className="px-2 text-center text-xs text-fg-grey-500">
            You succeed convert <span className="font-semibold text-fg-black">86</span> customer today
          </p>
          <div className="grid grid-cols-2 gap-2 border-t border-fg-grey-200 pt-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-fg-grey-500">Leads</span>
              <span className="text-lg font-semibold text-fg-black">44.2k</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-fg-grey-500">Customer</span>
              <span className="text-lg font-semibold text-fg-black">11.2k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-4 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-fg-black">Recent Leads</h3>
              <p className="text-sm text-fg-grey-500">Recent leads</p>
            </div>
            <Button color={siteConfig.accent} size="sm">
              See More
            </Button>
          </div>
          <DataTable<LeadRow>
            color={siteConfig.accent}
            columns={leadColumns}
            rows={leads}
            getRowKey={(row) => row.id}
          />
        </div>

        <ListGroup
          title="Activity"
          subtitle="Recent activity"
          action={
            <KebabMenu accent={siteConfig.accent} items={[{ label: "View all", onSelect: () => {} }]} />
          }
          items={
            <div className="flex flex-col gap-4">
              <ActivityCard
                icon={<UsersGroupTwoRoundedBoldDuotone size={16} />}
                headerText="Status Changed"
                datetime="04/10/25, 12:45"
                avatar="https://api.dicebear.com/9.x/thumbs/svg?seed=actor-1"
                title="Status Changed"
                description="Customer Agung Ilham status changed to Warm"
                metadata={[
                  { label: "From", value: <Label color="red">Hot</Label> },
                  { label: "To", value: <Label color="yellow">Warm</Label> },
                ]}
              />
              <ActivityCard
                icon={<VideocameraRecordLinear size={16} />}
                headerText="Video Call"
                datetime="02/10/25, 06:15"
                avatar="https://api.dicebear.com/9.x/thumbs/svg?seed=actor-2"
                title="Video Call"
                description="You have had a meeting with Josh Adam"
                metadata={[]}
              />
              <ActivityCard
                icon={<UsersGroupRoundedLinear size={16} />}
                headerText="Regular Meet"
                datetime="24/09/24, 14:15"
                avatar="https://api.dicebear.com/9.x/thumbs/svg?seed=actor-3"
                title="Regular Meet"
                description="You have had a meeting with John Bushmill"
                metadata={[
                  {
                    label: "Doc",
                    value: (
                      <span className="inline-flex items-center gap-2 text-xs">
                        <DocumentTextLinear size={14} /> Meeting MOM.doc
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          }
        />
      </div>
    </RefChrome>
  );
}
