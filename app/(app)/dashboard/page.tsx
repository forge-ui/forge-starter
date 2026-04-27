import { AppLayout } from "@forge-ui/react";
import { menuItems, favoriteItems, profile } from "@/config/menu";

export default function DashboardPage() {
  return (
    <AppLayout
      mode="light"
      profilePosition="sidebar"
      accent="purple"
      teamName="你的团队"
      teamMemberCount={12}
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={profile}
      notifications={5}
      messages={2}
      pageTitle="工作台"
      pageHeaderVariant="home"
      primaryAction={{ label: "新建" }}
      secondaryAction={{ label: "导出" }}
    >
      <div className="flex flex-col gap-6">
        {/* 指标卡 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-xs font-medium tracking-fg text-fg-grey-500"
            >
              指标 {i}
            </div>
          ))}
        </div>

        {/* 主图 + 侧栏 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex h-80 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-sm font-medium tracking-fg text-fg-grey-500 lg:col-span-2">
            主图表
          </div>
          <div className="flex h-80 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-sm font-medium tracking-fg text-fg-grey-500">
            侧边卡片
          </div>
        </div>

        {/* 两栏区 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-sm font-medium tracking-fg text-fg-grey-500"
            >
              区块 {i}
            </div>
          ))}
        </div>

        {/* 底部通栏 */}
        <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-fg-grey-200 text-sm font-medium tracking-fg text-fg-grey-500">
          表格 / 列表占位
        </div>
      </div>
    </AppLayout>
  );
}
