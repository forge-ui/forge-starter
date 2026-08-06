"use client";

/**
 * Personal / member detail — Forge project-template/members/[id]
 * Left profile card + right KPI + TabBar (项目 / 任务 / 动态)
 */

import { useMemo, useState } from "react";
import { PenLinear } from "solar-icon-set";
import {
  Avatar,
  Button,
  DataTable,
  HistoryGrouped,
  LineChartStatCard,
  StatusBadge,
  TabBar,
  type ColumnDef,
} from "@forge-ui-official/core";
import { RefChrome } from "@/components/reference/ref-chrome";
import { siteConfig } from "@/config/site";
import { REF_PAGES } from "@/lib/reference/catalog";
import { REF_ACTIVITIES, REF_RECORDS, REF_STATUS_META } from "@/lib/reference/mock-data";

const meta = REF_PAGES.find((p) => p.slug === "profile")!;

const person = {
  name: "王敏",
  handle: "@wangmin",
  memberId: "ID-011221",
  role: "项目经理",
  department: "华东运营",
  email: "wangmin@example.com",
  phone: "138 0000 8821",
  lastOnline: "今天 11:20",
  joined: "12 Jan 2024",
  avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=wangmin",
  status: "active" as const,
};

type Row = { id: string; name: string; meta: string; status: string };

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-fg-grey-100 py-3 last:border-b-0">
      <div className="text-xs text-fg-grey-500">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-fg-black">{value}</div>
    </div>
  );
}

export default function RefProfilePage() {
  const [tab, setTab] = useState(0);
  const tabs = ["项目", "任务", "动态"];

  const projectRows: Row[] = useMemo(
    () =>
      REF_RECORDS.slice(0, 4).map((r) => ({
        id: r.id,
        name: r.title,
        meta: r.amount,
        status: REF_STATUS_META[r.status].label,
      })),
    [],
  );

  const taskRows: Row[] = useMemo(
    () =>
      REF_RECORDS.slice(1, 5).map((r) => ({
        id: `t-${r.id}`,
        name: r.subtitle,
        meta: r.owner,
        status: REF_STATUS_META[r.status].label,
      })),
    [],
  );

  const columns: ColumnDef<Row>[] = useMemo(
    () => [
      {
        key: "name",
        header: tab === 1 ? "任务" : "项目",
        flex: true,
        render: (row) => (
          <div className="flex h-10 flex-col justify-center">
            <span className="text-sm font-semibold text-fg-black">{row.name}</span>
            <span className="text-xs text-fg-grey-500">{row.meta}</span>
          </div>
        ),
      },
      {
        key: "status",
        header: "状态",
        width: "w-28",
        render: (row) => (
          <div className="flex h-10 items-center">
            <StatusBadge label={row.status} color="blue" />
          </div>
        ),
      },
    ],
    [tab],
  );

  return (
    <RefChrome meta={meta}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          color={siteConfig.accent}
          variant="tertiary"
          iconLeft={<PenLinear size={16} />}
        >
          编辑资料
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Left: personal card — members/[id] aside */}
        <aside className="overflow-hidden rounded-[28px] bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
          <div className="h-28 bg-gradient-to-r from-fg-blue to-fg-blue-100" />
          <div className="-mt-10 flex flex-col items-center px-6 pb-6 text-center">
            <Avatar src={person.avatar} size="lg" />
            <h2 className="mt-3 text-xl font-semibold text-fg-black">{person.name}</h2>
            <p className="text-sm text-fg-grey-500">{person.handle}</p>
            <div className="mt-2">
              <StatusBadge label="在职" color="green" />
            </div>
            <div className="mt-6 w-full space-y-0 text-left">
              <Info label="成员 ID" value={person.memberId} />
              <Info label="角色" value={person.role} />
              <Info label="部门" value={person.department} />
              <Info label="邮箱" value={person.email} />
              <Info label="手机" value={person.phone} />
              <Info label="最近在线" value={person.lastOnline} />
              <Info label="加入时间" value={person.joined} />
            </div>
          </div>
        </aside>

        {/* Right: stats + tabs */}
        <div className="flex min-w-0 flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <LineChartStatCard
              size="wide"
              theme="white"
              title="进行中"
              value="11"
              trend="5%"
              trendDirection="up"
              subtitle="+2 今日"
              chartColor="blue"
              width="full"
            />
            <LineChartStatCard
              size="wide"
              theme="white"
              title="未开始"
              value="4"
              trend="25%"
              trendDirection="up"
              subtitle="+1 今日"
              chartColor="yellow"
              width="full"
            />
            <LineChartStatCard
              size="wide"
              theme="white"
              title="已完成"
              value="28"
              trend="2%"
              trendDirection="up"
              subtitle="+2 今日"
              chartColor="green"
              width="full"
            />
          </div>

          <div className="border-b border-fg-grey-200">
            <TabBar
              color={siteConfig.accent}
              tabs={tabs.map((label, i) => ({ label, active: i === tab }))}
              onChange={setTab}
            />
          </div>

          {tab === 0 || tab === 1 ? (
            <DataTable<Row>
              color={siteConfig.accent}
              columns={columns}
              rows={tab === 0 ? projectRows : taskRows}
              getRowKey={(row) => row.id}
            />
          ) : (
            <div className="rounded-xl bg-white p-6 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
              <HistoryGrouped
                title="近期动态"
                color={siteConfig.accent}
                items={REF_ACTIVITIES.map((a) => ({
                  title: `${a.actor} ${a.action}`,
                  description: a.target,
                  datetime: `${a.group} ${a.time}`,
                }))}
              />
            </div>
          )}
        </div>
      </section>
    </RefChrome>
  );
}
