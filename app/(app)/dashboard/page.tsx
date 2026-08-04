"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AddCircleLinear,
  ArrowRightUpLinear,
  BillListBoldDuotone,
  FolderBoldDuotone,
  FolderWithFilesBoldDuotone,
  LetterLinear,
  PhoneCallingLinear,
  UserBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
} from "solar-icon-set";
import {
  Avatar,
  Button,
  IconButton,
  KebabMenu,
  LineChartStatCard,
  ListGroup,
  PieChart,
  PlusIcon,
  ProgressStatCard,
  ProjectCard,
  SmoothLineChart,
  StatusBadge,
  WheelChartStatCard,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import { RECORD_STATUS_META } from "@/lib/demo/records";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DashboardPage() {
  const router = useRouter();
  const { records, countsByStatus } = useDemoStore();

  const active = countsByStatus.active ?? 0;
  const draft = countsByStatus.draft ?? 0;
  const done = countsByStatus.done ?? 0;
  const blocked = countsByStatus.blocked ?? 0;
  const total = countsByStatus.all ?? 0;

  const pieSegments = useMemo(() => {
    const parts = [
      { value: Math.max(active, 0.01), color: "#2563eb" },
      { value: Math.max(draft, 0.01), color: "#fbbf24" },
      { value: Math.max(done, 0.01), color: "#10b981" },
      { value: Math.max(blocked, 0.01), color: "#ef4444" },
    ];
    return parts;
  }, [active, draft, done, blocked]);

  const recent = records.slice(0, 4);
  const owners = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of records) map.set(r.owner, (map.get(r.owner) ?? 0) + 1);
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, [records]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header — project-2 / overview style */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-fg text-fg-black">Overview</h1>
          <p className="text-sm text-fg-grey-500">
            你好，这里是业务记录总览（数据与列表/详情联动）
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            color={siteConfig.accent}
            variant="tertiary"
            iconLeft={<AddCircleLinear size={16} />}
            onClick={() => router.push("/examples/list/")}
          >
            查看列表
          </Button>
          <Button
            color={siteConfig.accent}
            iconLeft={<PlusIcon size={16} />}
            onClick={() => router.push("/examples/form/")}
          >
            新建记录
          </Button>
        </div>
      </div>

      {/* 3 metric cards — project-2 */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 [&>*]:!w-full">
        <ProgressStatCard
          title="进行中"
          subtitle={`共 ${total} 条记录`}
          value={String(active)}
          trend="10%"
          trendDirection="up"
          theme="white"
          progressValue={total ? Math.round((active / total) * 100) : 0}
          progressColor="blue"
          icon={<FolderBoldDuotone size={20} />}
          size="wide"
          width="full"
        />
        <LineChartStatCard
          title="已完成"
          subtitle="+0 today"
          value={String(done)}
          trend="4%"
          trendDirection="up"
          chartColor="green"
          chartDirection="up"
          size="wide"
          width="full"
          series={[2, 3, 3, 4, 5, 4, 6, 7, 6, 8, 7, done || 6]}
          icon={<FolderWithFilesBoldDuotone size={20} />}
        />
        <WheelChartStatCard
          title="负责人覆盖"
          subtitle={`阻断 ${blocked}`}
          value={String(owners.length)}
          trend="5%"
          trendDirection="up"
          wheelColor="blue"
          wheelPercent={total ? Math.min(100, Math.round((done / total) * 100) + 20) : 40}
          size="wide"
          width="full"
          icon={<UsersGroupTwoRoundedBoldDuotone size={20} />}
        />
      </div>

      {/* Statistic + pie — project-2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 rounded-3xl border border-fg-grey-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-fg-black">Statistic</h3>
              <p className="text-sm text-fg-grey-500">记录创建与完成趋势（演示序列）</p>
            </div>
            <KebabMenu
              accent={siteConfig.accent}
              items={[
                { label: "打开列表", onSelect: () => router.push("/examples/list/") },
                { label: "新建", onSelect: () => router.push("/examples/form/") },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: "进行中", value: String(active), trend: "10%", up: true, color: "#2563eb" },
              { label: "草稿", value: String(draft), trend: "2%", up: false, color: "#fbbf24" },
              { label: "已完成", value: String(done), trend: "8%", up: true, color: "#10b981" },
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
              { data: [12, 14, 13, 16, 18, 17, 20, 22, 21, 24, 23, Math.max(active * 3, 12)], color: "#2563eb" },
              { data: [8, 9, 10, 9, 11, 10, 12, 11, 10, 9, 10, Math.max(draft * 2, 8)], color: "#fbbf24" },
              { data: [6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, Math.max(done * 2, 10)], color: "#10b981" },
            ]}
            accent="blue"
            activeIndex={6}
            showTooltip
            tooltipItems={[
              { label: "进行中", value: String(active), trend: "up", color: "#2563eb" },
              { label: "草稿", value: String(draft), trend: "down", color: "#fbbf24" },
              { label: "已完成", value: String(done), trend: "up", color: "#10b981" },
            ]}
            showYAxis
            yAxisLabels={["24", "18", "12", "6", "0"]}
            xAxisLabels={months}
            height="h-[260px]"
          />
        </div>

        <div className="flex flex-col gap-5 rounded-3xl border border-fg-grey-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-fg-black">状态分布</h3>
              <p className="text-sm text-fg-grey-500">Based on status</p>
            </div>
            <KebabMenu
              accent={siteConfig.accent}
              items={[{ label: "刷新", onSelect: () => undefined }]}
            />
          </div>
          <div className="flex justify-center">
            <PieChart segments={pieSegments} accent="blue" size="lg" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-fg-grey-700">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#2563eb]" /> 进行中 {active}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#fbbf24]" /> 草稿 {draft}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#10b981]" /> 已完成 {done}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#ef4444]" /> 已阻断 {blocked}
            </span>
          </div>
        </div>
      </div>

      {/* Recent + owners — project-2 bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ListGroup
          title="最近记录"
          subtitle="Recent Active"
          action={
            <KebabMenu
              accent={siteConfig.accent}
              items={[{ label: "查看全部", onSelect: () => router.push("/examples/list/") }]}
            />
          }
          items={
            <div className="flex flex-col gap-3">
              {recent.length === 0 ? (
                <p className="py-8 text-center text-sm text-fg-grey-500">暂无记录</p>
              ) : (
                recent.map((item) => {
                  const progress =
                    item.status === "done" ? 100
                      : item.status === "active" ? 65
                        : item.status === "blocked" ? 35
                          : 20;
                  const progressColor =
                    item.status === "done" ? "green"
                      : item.status === "blocked" ? "red"
                        : item.status === "active" ? "blue"
                          : "gray";
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="w-full text-left"
                      onClick={() => router.push(`/examples/detail/?id=${item.id}`)}
                    >
                      <ProjectCard
                        width="full"
                        logo={item.imageUrl}
                        title={item.name}
                        labelText={RECORD_STATUS_META[item.status].label}
                        labelColor={progressColor}
                        progress={progress}
                        progressColor={progressColor}
                        date={item.updatedDate}
                        avatars={[item.imageUrl]}
                      />
                    </button>
                  );
                })
              )}
            </div>
          }
        />

        <ListGroup
          title="负责人"
          subtitle="按记录数"
          action={
            <KebabMenu
              accent={siteConfig.accent}
              items={[{ label: "打开列表", onSelect: () => router.push("/examples/list/") }]}
            />
          }
          items={
            <div className="flex flex-col">
              {owners.length === 0 ? (
                <p className="py-8 text-center text-sm text-fg-grey-500">暂无</p>
              ) : (
                owners.map((m) => (
                  <div key={m.name} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={`https://placehold.co/40x40/dbeafe/1d4ed8?text=${encodeURIComponent(m.name[0])}`}
                        size="md"
                      />
                      <div>
                        <div className="text-sm font-semibold text-fg-black">{m.name}</div>
                        <div className="text-xs text-fg-grey-500">{m.count} 条记录</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconButton variant="ghost" shape="square" size="sm" aria-label="call">
                        <PhoneCallingLinear size={14} />
                      </IconButton>
                      <IconButton variant="ghost" shape="square" size="sm" aria-label="mail">
                        <LetterLinear size={14} />
                      </IconButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          }
        />

        <div className="flex flex-col gap-4 rounded-3xl border border-fg-grey-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-fg-black">待办焦点</h3>
              <p className="text-sm text-fg-grey-500">来自业务记录</p>
            </div>
            <BillListBoldDuotone size={20} color="#71717A" />
          </div>
          <div className="flex flex-col gap-3">
            {records
              .filter((r) => r.status === "blocked" || r.status === "draft")
              .slice(0, 4)
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => router.push(`/examples/detail/?id=${item.id}`)}
                  className="flex items-center justify-between rounded-2xl border border-fg-grey-200 px-3 py-3 text-left hover:bg-fg-grey-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-fg-black">{item.name}</p>
                    <p className="text-xs text-fg-grey-500">{item.owner}</p>
                  </div>
                  <StatusBadge
                    label={RECORD_STATUS_META[item.status].label}
                    color={RECORD_STATUS_META[item.status].color}
                  />
                </button>
              ))}
            {records.filter((r) => r.status === "blocked" || r.status === "draft").length === 0 ? (
              <p className="py-6 text-center text-sm text-fg-grey-500">没有草稿或阻断项</p>
            ) : null}
          </div>
          <Button
            color={siteConfig.accent}
            variant="tertiary"
            className="w-full"
            iconLeft={<UserBoldDuotone size={16} />}
            onClick={() => router.push("/examples/list/")}
          >
            去处理
          </Button>
        </div>
      </div>
    </div>
  );
}
