"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AddCircleLinear,
  ChecklistMinimalisticBoldDuotone,
  DangerCircleBoldDuotone,
  DocumentBoldDuotone,
  WidgetBoldDuotone,
} from "solar-icon-set";
import {
  ActivityCard,
  Button,
  LineChartStatCard,
  StatusBadge,
  SurfaceCard,
} from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";
import { useDemoStore } from "@/components/demo-store";
import { RECORD_STATUS_META } from "@/lib/demo/records";

const chartSeries = [12, 18, 15, 22, 28, 24, 31, 36, 33, 40, 38, 45];

export default function DashboardPage() {
  const router = useRouter();
  const { records, countsByStatus } = useDemoStore();

  const recent = useMemo(() => records.slice(0, 5), [records]);
  const blocked = countsByStatus.blocked ?? 0;
  const active = countsByStatus.active ?? 0;
  const draft = countsByStatus.draft ?? 0;
  const done = countsByStatus.done ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-l font-semibold leading-9 tracking-fg text-fg-black">
            工作台
          </h1>
          <p className="mt-1 text-sm text-fg-grey-700">
            数据来自「业务记录」演示 store，新建/编辑/删除后这里会同步变化。
          </p>
        </div>
        <Button
          color={siteConfig.accent}
          iconLeft={<AddCircleLinear size={18} />}
          onClick={() => router.push("/examples/form/")}
        >
          新建记录
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <LineChartStatCard
          size="wide"
          width="full"
          theme="white"
          title="全部记录"
          value={String(countsByStatus.all ?? 0)}
          trend="12%"
          trendDirection="up"
          subtitle="演示数据集"
          chartColor="blue"
          series={chartSeries}
        />
        <LineChartStatCard
          size="wide"
          width="full"
          theme="white"
          title="进行中"
          value={String(active)}
          trend="4%"
          trendDirection="up"
          subtitle="需跟进"
          chartColor="cyan"
          series={[8, 10, 9, 12, 14, 13, 16, 18, 17, 20, 19, active || 12]}
        />
        <LineChartStatCard
          size="wide"
          width="full"
          theme="white"
          title="草稿"
          value={String(draft)}
          trend="2%"
          trendDirection="down"
          subtitle="待完善"
          chartColor="orange"
          series={[6, 7, 5, 8, 6, 5, 4, 6, 5, 4, 5, draft || 4]}
        />
        <LineChartStatCard
          size="wide"
          width="full"
          theme="white"
          title="已阻断"
          value={String(blocked)}
          trend={blocked > 0 ? "1" : "0%"}
          trendDirection={blocked > 0 ? "up" : "down"}
          subtitle="需处理"
          chartColor="red"
          series={[1, 2, 1, 3, 2, 1, 2, 3, 2, 1, 2, blocked || 1]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SurfaceCard className="p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-fg-blue-500">QUEUE</p>
              <h2 className="mt-1 text-lg font-semibold text-fg-black">最近记录</h2>
            </div>
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              size="sm"
              onClick={() => router.push("/examples/list/")}
            >
              查看全部
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {recent.length === 0 ? (
              <p className="py-10 text-center text-sm text-fg-grey-700">还没有记录，先去新建一条。</p>
            ) : (
              recent.map((item) => {
                const meta = RECORD_STATUS_META[item.status];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => router.push(`/examples/detail/?id=${item.id}`)}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-fg-grey-200 bg-white px-4 py-3 text-left transition-colors hover:bg-fg-grey-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-fg-black">{item.name}</p>
                      <p className="mt-0.5 truncate text-sm text-fg-grey-500">
                        {item.code} · {item.owner} · {item.category}
                      </p>
                    </div>
                    <StatusBadge label={meta.label} color={meta.color} />
                  </button>
                );
              })
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <p className="text-xs font-semibold text-fg-blue-500">SHORTCUTS</p>
          <h2 className="mt-1 text-lg font-semibold text-fg-black">快捷操作</h2>
          <div className="mt-5 flex flex-col gap-3">
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              className="justify-start"
              iconLeft={<DocumentBoldDuotone size={18} />}
              onClick={() => router.push("/examples/list/")}
            >
              打开业务列表
            </Button>
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              className="justify-start"
              iconLeft={<AddCircleLinear size={18} />}
              onClick={() => router.push("/examples/form/")}
            >
              新建业务记录
            </Button>
            <Button
              color={siteConfig.accent}
              variant="tertiary"
              className="justify-start"
              iconLeft={<WidgetBoldDuotone size={18} />}
              onClick={() => router.push("/settings/")}
            >
              账号设置
            </Button>
          </div>
          <div className="mt-6 rounded-2xl bg-fg-grey-50 p-4 text-sm text-fg-grey-700">
            <p className="font-semibold text-fg-black">状态分布</p>
            <p className="mt-2">完成 {done} · 进行中 {active} · 草稿 {draft} · 阻断 {blocked}</p>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityCard
          icon={<ChecklistMinimalisticBoldDuotone size={20} color="#2563EB" />}
          headerText="系统动态"
          datetime="刚刚"
          avatar="https://placehold.co/40x40/dbeafe/1d4ed8?text=F"
          title="演示数据已就绪"
          description="列表、表单、详情共用同一 store。在任意一页增删改后，工作台统计会即时更新。"
          metadata={[
            { label: "记录数", value: String(countsByStatus.all ?? 0) },
            { label: "模式", value: "Client demo store" },
          ]}
        />
        <ActivityCard
          icon={<DangerCircleBoldDuotone size={20} color="#EF4444" />}
          headerText="风险提示"
          datetime="今日"
          avatar="https://placehold.co/40x40/fee2e2/b91c1c?text=!"
          title={blocked > 0 ? `${blocked} 条记录处于阻断` : "暂无阻断项"}
          description={
            blocked > 0
              ? "建议在业务记录中筛选「已阻断」并跟进处理。"
              : "保持策略与流程健康，阻断数为 0。"
          }
          metadata={[
            { label: "阻断", value: String(blocked) },
            {
              label: "操作",
              value: (
                <button
                  type="button"
                  className="font-semibold text-fg-blue-500"
                  onClick={() => router.push("/examples/list/")}
                >
                  去处理
                </button>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
