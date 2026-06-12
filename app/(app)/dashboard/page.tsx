"use client";

import {
  AppLayout,
  Button,
  CellActions,
  CellLink,
  CellMuted,
  CellNumber,
  CellProgressBar,
  CellStatusDot,
  CellTextSubtitle,
  DataTable,
  Label,
  ListGroup,
  ProgressBar,
  StatCard,
  SurfaceCard,
  ActivityCard,
  Toolbar,
  ToolbarActions,
  ToolbarDatepicker,
  ToolbarSelectDropdown,
  type ColumnDef,
} from "@forge-ui-official/core";
import {
  BoxMinimalisticBoldDuotone,
  ChefHatMinimalisticLinear,
  ClipboardListLinear,
  DangerCircleLinear,
} from "solar-icon-set";
import { menuItems, favoriteItems, profile } from "@/config/menu";

type StoreRow = {
  store: string;
  area: string;
  status: "正常" | "压单" | "缺货";
  orders: string;
  revenue: string;
  fulfillment: number;
  owner: string;
  nextAction: string;
};

const storeRows: StoreRow[] = [
  {
    store: "静安寺旗舰店",
    area: "堂食 + 外卖 / 上海静安",
    status: "压单",
    orders: "286",
    revenue: "¥48,920",
    fulfillment: 76,
    owner: "李娜",
    nextAction: "调度骑手",
  },
  {
    store: "五角场大学路店",
    area: "学生客群 / 上海杨浦",
    status: "正常",
    orders: "214",
    revenue: "¥35,640",
    fulfillment: 92,
    owner: "周启",
    nextAction: "查看复购",
  },
  {
    store: "陆家嘴中心店",
    area: "办公午高峰 / 上海浦东",
    status: "缺货",
    orders: "179",
    revenue: "¥31,870",
    fulfillment: 68,
    owner: "王璐",
    nextAction: "补货审核",
  },
  {
    store: "徐汇日月光店",
    area: "商场客流 / 上海徐汇",
    status: "正常",
    orders: "158",
    revenue: "¥27,430",
    fulfillment: 88,
    owner: "陈卓",
    nextAction: "排班确认",
  },
];

const statusColor = {
  正常: "green",
  压单: "yellow",
  缺货: "red",
} as const;

const columns: ColumnDef<StoreRow>[] = [
  {
    key: "store",
    header: "门店",
    flex: true,
    render: (row) => <CellTextSubtitle title={row.store} subtitle={row.area} />,
  },
  {
    key: "status",
    header: "状态",
    width: "w-28",
    render: (row) => <CellStatusDot label={row.status} color={statusColor[row.status]} />,
  },
  {
    key: "orders",
    header: "订单",
    width: "w-24",
    render: (row) => <CellNumber value={row.orders} />,
  },
  {
    key: "revenue",
    header: "营业额",
    width: "w-32",
    render: (row) => <CellNumber value={row.revenue} trend={row.status === "缺货" ? "down" : "up"} />,
  },
  {
    key: "fulfillment",
    header: "履约",
    width: "w-44",
    render: (row) => (
      <CellProgressBar
        value={`${row.fulfillment}%`}
        percent={row.fulfillment}
        color={row.fulfillment < 75 ? "red" : row.fulfillment < 85 ? "yellow" : "green"}
      />
    ),
  },
  {
    key: "owner",
    header: "负责人",
    width: "w-28",
    render: (row) => <CellMuted>{row.owner}</CellMuted>,
  },
  {
    key: "action",
    header: "动作",
    width: "w-32",
    render: (row) => <CellLink label={row.nextAction} color={row.status === "正常" ? "green" : "red"} />,
  },
];

const actionItems = [
  ["压单预警", "静安寺旗舰店外卖待出餐 19 单，预计超 SLA 8 分钟", "red"],
  ["库存风险", "陆家嘴中心店牛肉饭主料剩余 14 份，晚高峰不足", "yellow"],
  ["排班缺口", "徐汇日月光店 17:00-19:00 少 1 名打包员", "purple"],
  ["活动复盘", "大学路店套餐券核销率 31%，可追加 300 张", "green"],
] as const;

const channelMix = [
  ["堂食", 58, "green"],
  ["外卖", 78, "purple"],
  ["自提", 42, "blue"],
] as const;

export default function DashboardPage() {
  return (
    <AppLayout
      mode="light"
      profilePosition="topbar"
      accent="purple"
      teamName="花禾餐饮集团"
      teamMemberCount={42}
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={profile}
      notifications={5}
      messages={2}
      searchPlaceholder="搜索门店 / 商圈"
      primaryAction={{ label: "新建活动" }}
    >
      <div className="flex flex-col gap-6">
        <Toolbar
          className="items-center gap-3"
          left={
            <div className="min-w-0">
              <p className="text-sm text-fg-grey-500">
                今日 10:30 更新 · 覆盖 24 家直营门店
              </p>
              <h1 className="mt-1 text-2xl font-semibold leading-8 tracking-fg text-fg-black">
                午高峰履约与门店异常
              </h1>
            </div>
          }
          right={
            <ToolbarActions className="shrink-0 items-center">
              <ToolbarSelectDropdown value="上海大区" options={[{ label: "上海大区", value: "上海大区" }]} />
              <ToolbarDatepicker label="今日" />
            </ToolbarActions>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="今日营业额" value="¥186,420" trend="+12.4%" subtitle="较上周同日" theme="white" width="full" />
          <StatCard title="订单完成率" value="91.8%" trend="+3.1%" subtitle="外卖履约拉动" theme="green" width="full" />
          <StatCard title="异常门店" value="3" trend="-2" trendDirection="down" subtitle="需 30 分钟内处理" theme="red" width="full" />
          <StatCard title="会员复购" value="36.5%" trend="+5.8%" subtitle="套餐券贡献 42%" theme="purple" width="full" />
        </div>

        <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-5">
            <DataTable
              title="门店异常队列"
              subtitle="优先处理压单、缺货和履约波动门店"
              rows={storeRows}
              columns={columns}
              color="purple"
              headerActions={
                <div className="flex items-center gap-2">
                  <Label color="red" size="sm">3 个风险</Label>
                  <Button size="sm" color="purple" variant="secondary">批量派单</Button>
                </div>
              }
              paginationLabel="显示 1-4 / 24 家门店"
              showPagination
              currentPage={1}
              totalPages={6}
            />

            <SurfaceCard
              title="运营节奏"
              subtitle="午高峰订单、产能和渠道占比"
              action={<Label color="green">进行中</Label>}
              padding="md"
            >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="flex min-h-64 flex-col justify-between rounded-card bg-fg-grey-50 p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-fg-grey-500">
                        11:00-14:00 订单曲线
                      </p>
                      <p className="mt-1 text-lg font-semibold leading-7 tracking-fg text-fg-black">
                        当前峰值 12:20，预计 13:10 回落
                      </p>
                    </div>
                    <Button size="sm" color="grey" variant="secondary">
                      查看预测
                    </Button>
                  </div>
                  <div className="mt-8 flex h-28 items-end gap-2">
                    {[36, 48, 64, 82, 74, 68, 59, 52, 44, 38, 31, 26].map((value, index) => (
                      <div key={index} className="flex flex-1 items-end">
                        <div
                          className="w-full rounded-t-xl bg-fg-violet"
                          style={{ height: `${value}%`, opacity: index === 3 ? 1 : 0.42 }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {channelMix.map(([label, value, color]) => (
                      <div key={label} className="rounded-2xl bg-white p-3 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold leading-5 tracking-fg text-fg-black">{label}</span>
                          <span className="text-xs font-medium leading-4 tracking-fg text-fg-grey-500">{value}%</span>
                        </div>
                        <ProgressBar value={value} color={color} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    ["平均出餐", "8.6 分钟", "目标 9 分钟内"],
                    ["骑手到店", "4.2 分钟", "较昨日慢 0.8"],
                    ["差评风险", "12 单", "集中在缺货替换"],
                  ].map(([label, value, detail]) => (
                    <div key={label} className="rounded-card bg-white p-4 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
                      <p className="text-sm text-fg-grey-500">{label}</p>
                      <p className="mt-2 text-xl font-semibold leading-7 tracking-fg text-fg-black">{value}</p>
                      <p className="mt-1 text-xs font-medium leading-4 tracking-fg text-fg-grey-500">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SurfaceCard>

          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <ListGroup
              title="待处理动作"
              subtitle="按业务影响排序"
              items={
                <div className="flex flex-col gap-4">
                  {actionItems.map(([title, detail, color], index) => (
                    <ActivityCard
                      key={title}
                      icon={
                        index === 0 ? (
                          <DangerCircleLinear size={16} />
                        ) : index === 1 ? (
                          <BoxMinimalisticBoldDuotone size={16} />
                        ) : index === 2 ? (
                          <ChefHatMinimalisticLinear size={16} />
                        ) : (
                          <ClipboardListLinear size={16} />
                        )
                      }
                      headerText={title}
                      datetime={index === 0 ? "8 min ago" : index === 1 ? "12 min ago" : index === 2 ? "25 min ago" : "40 min ago"}
                      avatar={`https://i.pravatar.cc/40?u=restaurant-action-${index}`}
                      title={title}
                      description={detail}
                      metadata={[{ label: "Priority", value: <Label color={color} size="sm">{title}</Label> }]}
                    />
                  ))}
                </div>
              }
            />

            <SurfaceCard title="区域负责人" subtitle="今日关键 owner" padding="md">
              <div className="flex flex-col gap-4">
                {[
                  ["张晨", "上海大区运营", "24 店 / 3 异常"],
                  ["刘青", "供应链值班", "2 个补货单待审"],
                  ["马越", "会员增长", "套餐券追加中"],
                ].map(([name, role, state]) => (
                  <div key={name} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-5 tracking-fg text-fg-black">{name}</p>
                      <p className="text-xs font-medium leading-4 tracking-fg text-fg-grey-500">{role}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium leading-4 tracking-fg text-fg-grey-700">{state}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard title="晚高峰准备度" subtitle="17:00 前必须闭环" padding="md">
              <div className="flex flex-col gap-4">
                <ProgressBar label="主料库存" value={72} color="yellow" showPercentage />
                <ProgressBar label="打包人力" value={84} color="green" showPercentage />
                <ProgressBar label="活动券库存" value={61} color="purple" showPercentage />
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
