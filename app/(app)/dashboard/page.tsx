"use client";

import {
  AppLayout,
  Button,
  CellLink,
  CellMuted,
  CellNumber,
  CellProgressBar,
  CellStatusDot,
  CellTextSubtitle,
  DataTable,
  Label,
  ListGroup,
  NotificationItem,
  PageTitleToolbar,
  ProgressBar,
  StatCard,
  SurfaceCard,
  Toolbar,
  ToolbarActions,
  ToolbarDatepicker,
  ToolbarSearchInput,
  ToolbarSelectDropdown,
  type ColumnDef,
} from "@forge-ui-official/core";
import {
  BoxMinimalisticBoldDuotone,
  ClipboardListLinear,
  DangerCircleLinear,
  Pills3Linear,
} from "solar-icon-set";
import { favoriteItems, menuItems, profile } from "@/config/menu";

type RefillRow = {
  store: string;
  district: string;
  status: "正常" | "预警" | "断货";
  sku: string;
  stockoutRisk: number;
  dailySales: string;
  owner: string;
  nextAction: string;
};

const refillRows: RefillRow[] = [
  {
    store: "南京西路旗舰药房",
    district: "慢病专区 / 上海静安",
    status: "断货",
    sku: "二甲双胍缓释片",
    stockoutRisk: 91,
    dailySales: "¥42,860",
    owner: "周晨",
    nextAction: "生成调拨",
  },
  {
    store: "古北社区店",
    district: "家庭常备药 / 上海长宁",
    status: "预警",
    sku: "布洛芬混悬液",
    stockoutRisk: 73,
    dailySales: "¥28,140",
    owner: "沈岚",
    nextAction: "补货确认",
  },
  {
    store: "徐家汇地铁店",
    district: "OTC 高频品 / 上海徐汇",
    status: "正常",
    sku: "氯雷他定片",
    stockoutRisk: 42,
    dailySales: "¥31,520",
    owner: "林嘉",
    nextAction: "查看趋势",
  },
  {
    store: "联洋社区店",
    district: "儿科用药 / 上海浦东",
    status: "预警",
    sku: "小儿豉翘清热颗粒",
    stockoutRisk: 68,
    dailySales: "¥19,760",
    owner: "唐睿",
    nextAction: "供应商跟进",
  },
  {
    store: "大宁国际店",
    district: "医保药品 / 上海静安",
    status: "正常",
    sku: "阿托伐他汀钙片",
    stockoutRisk: 36,
    dailySales: "¥24,330",
    owner: "何曼",
    nextAction: "复核库存",
  },
];

const statusColor = {
  正常: "green",
  预警: "yellow",
  断货: "red",
} as const;

const columns: ColumnDef<RefillRow>[] = [
  {
    key: "store",
    header: "门店",
    flex: true,
    render: (row) => <CellTextSubtitle title={row.store} subtitle={row.district} />,
  },
  {
    key: "status",
    header: "状态",
    width: "w-28",
    render: (row) => <CellStatusDot label={row.status} color={statusColor[row.status]} />,
  },
  {
    key: "sku",
    header: "重点 SKU",
    width: "w-44",
    render: (row) => <CellMuted>{row.sku}</CellMuted>,
  },
  {
    key: "risk",
    header: "断货风险",
    width: "w-40",
    render: (row) => (
      <CellProgressBar
        value={`${row.stockoutRisk}%`}
        percent={row.stockoutRisk}
        color={row.stockoutRisk > 85 ? "red" : row.stockoutRisk > 60 ? "yellow" : "green"}
      />
    ),
  },
  {
    key: "dailySales",
    header: "昨日销售",
    width: "w-28",
    render: (row) => <CellNumber value={row.dailySales} trend={row.status === "断货" ? "down" : "up"} />,
  },
  {
    key: "owner",
    header: "负责人",
    width: "w-24",
    render: (row) => <CellMuted>{row.owner}</CellMuted>,
  },
  {
    key: "action",
    header: "动作",
    width: "w-32",
    render: (row) => <CellLink label={row.nextAction} color={row.status === "正常" ? "green" : "red"} />,
  },
];

const alerts = [
  {
    tag: "断货",
    time: "6 min",
    title: "南京西路旗舰药房缺 18 盒二甲双胍",
    body: "调拨单需要在 14:00 前确认，否则明早慢病处方会受影响。",
  },
  {
    tag: "供应商",
    time: "18 min",
    title: "布洛芬混悬液到货批次延后",
    body: "华东仓预计延迟 5 小时，建议先从周边 3 家门店调拨。",
  },
  {
    tag: "医保",
    time: "31 min",
    title: "阿托伐他汀库存周转偏慢",
    body: "大宁国际店可转出 24 盒给古北社区店。",
  },
];

export default function DashboardPage() {
  return (
    <AppLayout
      mode="light"
      profilePosition="topbar"
      accent="purple"
      teamName="仁康连锁药房"
      teamMemberCount={68}
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={profile}
      notifications={7}
      messages={3}
      searchPlaceholder="搜索门店 / SKU / 调拨单"
      primaryAction={{ label: "新建调拨" }}
    >
      <div className="flex flex-col gap-5">
        <PageTitleToolbar
          title="补货运营控制台"
          subtitle="监控门店库存、断货风险和跨店调拨闭环"
          actions={
            <ToolbarActions>
              <ToolbarSelectDropdown value="上海区域" options={[{ label: "上海区域", value: "上海区域" }]} />
              <ToolbarDatepicker label="今日" />
            </ToolbarActions>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="待补货门店" value="18" trend="+4" subtitle="较昨日" theme="white" width="full" />
          <StatCard title="高风险 SKU" value="42" trend="-6" trendDirection="down" subtitle="断货风险下降" theme="purple" width="full" />
          <StatCard title="调拨完成率" value="86.7%" trend="+8.2%" subtitle="48 小时内闭环" theme="green" width="full" />
          <StatCard title="预计损失销售" value="¥21.8k" trend="-12%" trendDirection="down" subtitle="已被调拨抵消" theme="red" width="full" />
        </div>

        <Toolbar
          left={<ToolbarSearchInput placeholder="搜索门店、SKU 或负责人" />}
          right={
            <ToolbarActions>
              <ToolbarSelectDropdown value="全部状态" options={[{ label: "全部状态", value: "全部状态" }]} />
              <ToolbarSelectDropdown value="慢病优先" options={[{ label: "慢病优先", value: "慢病优先" }]} />
              <Button color="purple" size="sm" variant="secondary">批量生成</Button>
            </ToolbarActions>
          }
        />

        <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-5">
            <DataTable
              title="门店补货队列"
              subtitle="按断货风险、销售影响和调拨时效排序"
              rows={refillRows}
              columns={columns}
              color="purple"
              headerActions={<Label color="red" size="sm">2 个必须今日处理</Label>}
              paginationLabel="显示 1-5 / 42 个补货任务"
              showPagination
              currentPage={1}
              totalPages={9}
            />

            <SurfaceCard
              title="调拨准备度"
              subtitle="总部仓、周边门店和供应商三路库存"
              action={<Label color="green">自动刷新</Label>}
              padding="md"
            >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="rounded-card bg-fg-grey-50 p-5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold leading-5 tracking-fg text-fg-black">库存覆盖趋势</p>
                      <p className="mt-1 text-xs font-medium leading-4.5 tracking-fg text-fg-grey-700">未来 7 天核心 SKU 覆盖率</p>
                    </div>
                    <Button color="grey" size="sm" variant="secondary">查看明细</Button>
                  </div>
                  <div className="flex h-28 items-end gap-2">
                    {[48, 56, 62, 74, 69, 78, 84, 76, 88, 91].map((value, index) => (
                      <div key={index} className="flex flex-1 items-end">
                        <div
                          className="w-full rounded-t-xl bg-fg-violet"
                          style={{ height: `${value}%`, opacity: index > 6 ? 0.85 : 0.42 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <ProgressBar label="总部仓可用" value={78} color="green" showPercentage />
                  <ProgressBar label="周边可调拨" value={64} color="purple" showPercentage />
                  <ProgressBar label="供应商准时率" value={71} color="yellow" showPercentage />
                </div>
              </div>
            </SurfaceCard>
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <ListGroup
              title="今日风险流"
              subtitle="只显示需要运营确认的事件"
              badge={<Label color="red" size="sm">3</Label>}
              items={
                <div className="flex flex-col divide-y divide-fg-grey-200">
                  {alerts.map((item) => (
                    <NotificationItem key={item.title} {...item} color="purple" />
                  ))}
                </div>
              }
            />

            <SurfaceCard title="任务闭环" subtitle="调拨动作状态" padding="md">
              <div className="flex flex-col gap-4">
                {[
                  ["待仓库确认", "8 单", <BoxMinimalisticBoldDuotone key="warehouse" size={18} />],
                  ["待门店接收", "11 单", <Pills3Linear key="store" size={18} />],
                  ["需人工复核", "3 单", <DangerCircleLinear key="risk" size={18} />],
                ].map(([label, value, icon]) => (
                  <div key={label as string} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fg-grey-100 text-fg-grey-700">
                        {icon}
                      </span>
                      <span className="truncate text-sm font-medium leading-5 tracking-fg text-fg-grey-700">{label}</span>
                    </div>
                    <span className="text-sm font-semibold leading-5 tracking-fg text-fg-black">{value}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard title="下一步工作流" subtitle="建议 30 分钟内处理" padding="md">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-fg-violet-100 text-fg-violet">
                  <ClipboardListLinear size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-5 tracking-fg text-fg-black">生成跨店调拨批次</p>
                  <p className="mt-1 text-xs font-medium leading-4.5 tracking-fg text-fg-grey-700">
                    优先合并慢病药品和儿科用药，减少配送拆单。
                  </p>
                  <div className="mt-4">
                    <Button color="purple" size="sm">进入调拨工作流</Button>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
