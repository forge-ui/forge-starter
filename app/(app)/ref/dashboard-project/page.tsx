"use client";

/**
 * Project dashboard — templates/(dashboards)/dashboards/project-1
 */

import {
  BillListBoldDuotone,
  CalendarMinimalisticLinear,
  CartLargeBoldDuotone,
  FolderBoldDuotone,
  FolderWithFilesBoldDuotone,
  LetterLinear,
  PhoneCallingLinear,
} from "solar-icon-set";
import {
  Avatar,
  AvatarGroup,
  BarChartStatCard,
  BubbleChart,
  Button,
  CellImageText,
  CellMuted,
  DataTable,
  EventCard,
  IconButton,
  KebabMenu,
  ListGroup,
  PlusIcon,
  StatCard,
  StatusBadge,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";

const meta = REF_PAGES.find((p) => p.slug === "dashboard-project")!;

type ProjectRow = {
  id: string;
  name: string;
  client: string;
  due: string;
  status: "In Progress" | "Pending" | "Unfinished" | "Completed";
  iconUrl: string;
  members: string[];
};

const statusColor: Record<ProjectRow["status"], "yellow" | "grey" | "red" | "green"> = {
  "In Progress": "yellow",
  Pending: "grey",
  Unfinished: "red",
  Completed: "green",
};

const projects: ProjectRow[] = [
  {
    id: "1",
    name: "Website Redesign",
    client: "Shieldfy",
    due: "30 Sep 2026",
    status: "In Progress",
    iconUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=wr",
    members: [
      "https://api.dicebear.com/9.x/thumbs/svg?seed=p1",
      "https://api.dicebear.com/9.x/thumbs/svg?seed=p2",
      "https://api.dicebear.com/9.x/thumbs/svg?seed=p3",
    ],
  },
  {
    id: "2",
    name: "Mobile App v2",
    client: "Nimbus",
    due: "12 Oct 2026",
    status: "Pending",
    iconUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=ma",
    members: ["https://api.dicebear.com/9.x/thumbs/svg?seed=p4"],
  },
  {
    id: "3",
    name: "Brand Refresh",
    client: "Orbit",
    due: "01 Aug 2026",
    status: "Completed",
    iconUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=br",
    members: [
      "https://api.dicebear.com/9.x/thumbs/svg?seed=p5",
      "https://api.dicebear.com/9.x/thumbs/svg?seed=p6",
    ],
  },
  {
    id: "4",
    name: "CRM Migration",
    client: "Internal",
    due: "20 Aug 2026",
    status: "Unfinished",
    iconUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=crm",
    members: [
      "https://api.dicebear.com/9.x/thumbs/svg?seed=p7",
      "https://api.dicebear.com/9.x/thumbs/svg?seed=p8",
    ],
  },
];

const columns: ColumnDef<ProjectRow>[] = [
  {
    key: "name",
    header: "Project Name",
    flex: true,
    render: (row) => <CellImageText src={row.iconUrl} title={row.name} subtitle={row.client} />,
  },
  {
    key: "due",
    header: "Due Date",
    width: "w-[140px]",
    render: (row) => <CellMuted>{row.due}</CellMuted>,
  },
  {
    key: "members",
    header: "Members",
    width: "w-[160px]",
    render: (row) => (
      <AvatarGroup>
        {row.members.map((src) => (
          <Avatar key={src} src={src} size="sm" />
        ))}
      </AvatarGroup>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "w-[140px]",
    render: (row) => <StatusBadge label={row.status} color={statusColor[row.status]} />,
  },
];

const team = [
  { name: "Edward Allen", role: "Lead Designer", online: true },
  { name: "Linda Blair", role: "PM", online: true },
  { name: "Mia Chen", role: "Engineer", online: false },
  { name: "Josh Adam", role: "QA", online: true },
  { name: "Jay Parker", role: "Research", online: false },
];

const bars = [18, 24, 30, 22, 36, 28, 40, 34, 42, 38, 44, 48];

export default function RefDashboardProjectPage() {
  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-fg-black">Overview</h2>
          <p className="text-sm text-fg-grey-500">
            Project-1：四态 KPI + 气泡占比 + 日程条 + 项目表 + 团队
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button color="grey" variant="tertiary" iconLeft={<CalendarMinimalisticLinear size={16} />}>
            Select Dates
          </Button>
          <KebabMenu accent={siteConfig.accent} items={[{ label: "Refresh", onSelect: () => {} }]} />
          <Button color={siteConfig.accent} iconLeft={<PlusIcon size={16} />}>
            Add Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:!w-full">
        <StatCard
          density="compact"
          size="wide"
          width="full"
          title="Total Project"
          value="6,784"
          trend="10%"
          trendDirection="up"
          subtitle="+150 today"
          theme="white"
          icon={<FolderBoldDuotone size={20} />}
        />
        <StatCard
          density="compact"
          size="wide"
          width="full"
          title="In Progress"
          value="4,412"
          trend="5%"
          trendDirection="up"
          subtitle="+150 today"
          theme="white"
          icon={<CartLargeBoldDuotone size={20} />}
        />
        <StatCard
          density="compact"
          size="wide"
          width="full"
          title="Completed"
          value="1,920"
          trend="2%"
          trendDirection="up"
          subtitle="+150 today"
          theme="white"
          icon={<FolderWithFilesBoldDuotone size={20} />}
        />
        <StatCard
          density="compact"
          size="wide"
          width="full"
          title="Unfinished"
          value="329"
          trend="0%"
          trendDirection="down"
          subtitle="+150 today"
          theme="white"
          icon={<BillListBoldDuotone size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-4 lg:col-span-2">
          <div>
            <h3 className="text-sm font-semibold text-fg-black">Statistic</h3>
            <p className="text-sm text-fg-grey-500">Project throughput (示意柱)</p>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: 180 }}>
            {bars.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-fg-violet"
                  style={{ height: `${(v / 50) * 100}%` }}
                />
                <span className="text-[10px] text-fg-grey-400">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-fg-black">All Project</h3>
              <p className="text-sm text-fg-grey-500">Based on status</p>
            </div>
            <KebabMenu accent={siteConfig.accent} items={[{ label: "Refresh", onSelect: () => {} }]} />
          </div>
          <BubbleChart
            bubbles={[
              { value: 58.33, label: "58%", color: "bg-yellow-400" },
              { value: 25, label: "25%", color: "bg-emerald-500" },
              { value: 8, label: "8%", color: "bg-orange-500" },
            ]}
            height={220}
          />
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-fg-grey-700">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-yellow-400" /> In Progress
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" /> Completed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-orange-500" /> Unfinished
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <BarChartStatCard
            density="compact"
            size="wide"
            width="full"
            title="Client Growth"
            subtitle="2 Jul - Today"
            value="1,456"
            trend="10%"
            trendDirection="up"
            barColor="purple"
            bars={[10, 30, 60, 95, 50, 40, 30]}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-3xl border border-fg-grey-200 bg-white p-4 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-fg-black">Daily Activity</h3>
              <p className="text-sm text-fg-grey-500">Today&apos;s schedule</p>
            </div>
            <KebabMenu accent={siteConfig.accent} items={[{ label: "View all", onSelect: () => {} }]} />
          </div>
          <div className="grid grid-cols-6 border-b border-fg-grey-200 pb-2 text-xs text-fg-grey-500">
            {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"].map((h) => (
              <div key={h}>{h}</div>
            ))}
          </div>
          <div className="relative flex min-h-48 flex-col gap-2 pt-2">
            <div className="pointer-events-none absolute inset-0 grid grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-l border-fg-grey-100" />
              ))}
            </div>
            <div className="grid grid-cols-6 gap-1">
              <div className="col-span-1 col-start-2">
                <EventCard
                  title="Design Check-In"
                  timeRange="10:00-11:00"
                  color="purple"
                  avatars={[1, 2, 3].map((i) => `https://api.dicebear.com/9.x/thumbs/svg?seed=e${i}`)}
                />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1">
              <div className="col-span-2 col-start-1">
                <EventCard
                  title="Daily Meeting"
                  timeRange="09:00-11:00"
                  color="yellow"
                  avatars={[4, 5].map((i) => `https://api.dicebear.com/9.x/thumbs/svg?seed=e${i}`)}
                />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1">
              <div className="col-span-1 col-start-5">
                <EventCard
                  title="Kick Off"
                  timeRange="13:00-14:00"
                  color="cyan"
                  avatars={[6, 7].map((i) => `https://api.dicebear.com/9.x/thumbs/svg?seed=e${i}`)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-4 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-fg-black">Projects</h3>
              <p className="text-sm text-fg-grey-500">Recent projects</p>
            </div>
            <Button color={siteConfig.accent} size="sm">
              See More
            </Button>
          </div>
          <DataTable<ProjectRow>
            color={siteConfig.accent}
            columns={columns}
            rows={projects}
            getRowKey={(row) => row.id}
          />
        </div>

        <ListGroup
          density="compact"
          title="Team Member"
          subtitle="All team members"
          action={
            <KebabMenu accent={siteConfig.accent} items={[{ label: "View all", onSelect: () => {} }]} />
          }
          items={
            <div className="flex flex-col">
              {team.map((m) => (
                <div key={m.name} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(m.name)}`}
                      online={m.online}
                      size="md"
                    />
                    <div>
                      <div className="text-sm font-semibold text-fg-black">{m.name}</div>
                      <div className="text-xs text-fg-grey-500">{m.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton variant="ghost" shape="square" size="sm">
                      <PhoneCallingLinear size={14} />
                    </IconButton>
                    <IconButton variant="ghost" shape="square" size="sm">
                      <LetterLinear size={14} />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          }
        />
      </div>
    </RefChrome>
  );
}
