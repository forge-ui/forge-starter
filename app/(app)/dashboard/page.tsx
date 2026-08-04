"use client";

import { SurfaceCard, StatusBadge } from "@forge-ui-official/core";

const metrics = [
  { label: "活跃项目", value: "12", hint: "本周 +2" },
  { label: "待办任务", value: "34", hint: "3 个逾期" },
  { label: "团队成员", value: "8", hint: "2 个角色" },
  { label: "本月完成", value: "56", hint: "完成率 81%" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <SurfaceCard key={metric.label} className="p-5">
            <p className="text-sm text-fg-grey-500">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-fg text-fg-black">{metric.value}</p>
            <p className="mt-2 text-sm text-fg-grey-700">{metric.hint}</p>
          </SurfaceCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SurfaceCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-fg-blue-500">OVERVIEW</p>
              <h2 className="mt-1 text-lg font-semibold text-fg-black">业务进度</h2>
            </div>
            <StatusBadge label="示例数据" color="blue" />
          </div>
          <p className="mt-4 text-sm leading-6 text-fg-grey-700">
            这是 Forge Starter 的工作台范例。把指标卡和区块换成你的业务数据即可；布局与 token 已对齐
            `@forge-ui-official/core`。
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["规划中", "进行中", "已完成"].map((label, index) => (
              <div
                key={label}
                className="rounded-2xl bg-fg-grey-50 px-4 py-5 text-center"
              >
                <p className="text-2xl font-semibold text-fg-black">{[4, 5, 3][index]}</p>
                <p className="mt-1 text-sm text-fg-grey-700">{label}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <p className="text-xs font-semibold text-fg-blue-500">NEXT STEPS</p>
          <h2 className="mt-1 text-lg font-semibold text-fg-black">开始业务开发</h2>
          <ul className="mt-4 space-y-3 text-sm text-fg-grey-700">
            <li>1. 配置 `AUTH_MODE=local` 与 PostgreSQL</li>
            <li>2. 参考「示例列表 / 表单」写业务页</li>
            <li>3. 配置 SMTP 启用找回密码邮件</li>
            <li>4. 修改 `config/menu.tsx` 换成真实导航</li>
          </ul>
        </SurfaceCard>
      </div>
    </div>
  );
}
