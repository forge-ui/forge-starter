# 页面 Blocks（复制到项目）

## 默认即 Screen 效果

以 ecommerce-2 为主对照时，KpiMetrics 数据入口默认首张 purple 主卡、其余白卡，并交替迷你折线/柱图；`visualization` 与 `data` 可逐指标替换，`variant="plain"` 才使用无图 StatCard。未提供 data 时迷你图仅是 core 的装饰性示意，不代表真实历史；生产数据须映射真实序列，不能从单个总数伪造趋势。

TrendChart 默认保留周期控件、带图标的指标行及 tooltip。`periods: [{label, chart?, countChart?}]` 每期传自己的真实数据，柱图与折线二选一；切换更新图、总数与 tooltip，受控模式由 activePeriod/onPeriodChange 管理。只传一个 chart 时只显示「本期」，不能伪造日/周/月切换；指标 value 可传业务口径，否则按输入序列求和。plain 才省略这些装饰。

RankingList 用 `entries: [{id,title,subtitle,value,avatar?,icon?,accent?}]`，未传 icon/accent 默认 Solar 商品图标与交替主题色；avatar 传首字母。默认 w-full，plain 为显式文字列表。items/children 是已验收 Screen 的完整插槽，不是推荐业务数据映射入口；使用插槽必须自行保留视觉元素，不能用 span 替代整张列表。

RegionDistribution 始终保留世界地图；地区传 name/salesLabel/value，可传 flag 图片或 ISO 两位 countryCode 自动生成旗帜；未知国家用名称缩写，不猜旗帜。中国大区等不对应国家的业务区域不要伪造国家映射。highlights 明确传入；默认高亮仅为展示示意，不代表地区业务统计。

CompositionCard 默认紫色起始配色与图例，segments 含 label/value，可覆盖颜色；plain 省略图例。DashboardHeader 保留 action/dateSelection/primaryAction 插槽，onExport 自动使用带下载图标的真实回调按钮；无授权或未接入操作时不显示假按钮，需在审计中注明原因。示例操作仅为接入边界，不声明导出已经实现。

最小配方见各单项生成文档与 `/r/index.json` 的 meta.example；结构化入口优先，其他 Screen 已验收的 children/items 插槽保持原输出。[表格列宽与数字对齐](component-selection/data-table.md) 适用于 RecentRecords。

17 类区块已实现为仓内源码与 registry-item，覆盖看板与业务模板；不是 core 包导出，也不意味着已发布或通过截图验收。

| 区块 | 导出名 | 源码目录 | 支持内容 |
|---|---|---|---|
| KPI 指标行 | KpiMetrics / FinanceMetricCard | blocks/kpi-metrics/ | metrics 或 children，compact 指标卡 |
| 最近记录表卡 | RecentRecords | blocks/recent-records/ | Panel + 泛型 DataTable，或 children |
| 趋势图表卡 | TrendChart | blocks/trend-chart/ | Panel + GroupedBarChart，或图域插槽 |
| 排行列表卡 | RankingList | blocks/ranking-list/ | ListGroup 的 items/tabs/action，默认 compact |
| 构成占比卡 | CompositionCard | blocks/composition-card/ | Panel + DonutChart，或 children |
| 页头 | DashboardHeader | blocks/dashboard-header/ | title/description/action 或原始标题内容 |
| 地区分布卡 | RegionDistribution | blocks/region-distribution/ | MapCard 的地区、范围、度量 |
| 成员列表 | MemberList | blocks/member-list/ | UserCard 成员数据或自定义 items |
| 目标进度列表 | GoalProgressList / WalletProgressPanel | blocks/goal-progress-list/ | WalletGoalCard 列表 / 财务储蓄面板 |
| 活动流 | ActivityFeed | blocks/activity-feed/ | ActivityCard 事件或自定义 items |
| 日程/甘特 | ScheduleCard / GanttSchedule | blocks/schedule-card/ | FullCalendar、六时段只读 GanttSchedule 或 children；不提供甘特编辑器 |
| 卡片轮播 | CardCarousel | blocks/card-carousel/ | CreditCard 数据、受控/非受控页码、可选翻页 |
| 客户经营摘要 | CrmSurface / CrmStat / DetailLine / CrmMetricCard | blocks/crm-summary/ | 客户分区、指标与趋势；业务文案和操作由宿主传入 |
| 财务工作区 | FinanceSurface / FieldLine / VisualCard / FinanceMetricCard / WalletProgressLine / FinanceGoalCell / FinanceTransactionCell / FinanceExpenseGauge / FinanceBudgetPanel | blocks/finance-workspace/ | 卡片主题、钱包进度、交易与预算，数据和回调由宿主提供 |
| 模板内容分区 | TemplateSurface | blocks/template-surface/ | 标题、说明、操作和内容；p-0 兼容原模板无内边距分区 |
| 对话标题栏 | ConversationHeader | blocks/conversation-header/ | 标题、工作区说明与操作插槽；不包含会话存储或流式请求 |
| 项目详情分区 | ProjectSection | blocks/project-section/ | 标题操作栏与紧凑内容区；className 从选定 Screen 保留 |

## 使用边界

每个 registry item 的 `meta.example` 是完整最小示例，`meta.props` 是从当前 TypeScript 导出生成的 Props 表（含所有导出及继承属性），`meta.core` 列出实际依赖组件和版本；示例与复制源码一起编译校验。对应可读文档位于本目录的 `blocks/<name>.md`，由 `blocks:generate` 同步，不手工维护第二份 API。`CellText` 使用 children：`<CellText>订单 1</CellText>`，没有 text prop。

## 看板配方

| Screen | 推荐组合（按阅读顺序） | KPI 选型 |
|---|---|---|
| ecommerce-3 | DashboardHeader → KpiMetrics → TrendChart + CompositionCard → RankingList + RegionDistribution → RecentRecords | 默认 chart，主题色 BarChartStatCard |
| analytics | DashboardHeader → KpiMetrics → TrendChart → RankingList + GoalProgressList | children 传 ProgressStatCard，保持原模板 |
| ecommerce-1 / ecommerce-2 | DashboardHeader → KpiMetrics → TrendChart → CompositionCard + RecentRecords → RegionDistribution + RankingList | ecommerce-2 默认紫色主卡、红色迷你折线、紫色迷你柱图；精确复用既有 Screen 时保留 children |
| finance-1 / finance-2 / finance-3 | DashboardHeader → FinanceSurface + KpiMetrics → CardCarousel → TrendChart + GoalProgressList → RecentRecords | FinanceMetricCard / 模板插槽 |
| project-1 / project-2 | DashboardHeader → KpiMetrics → TrendChart → MemberList + ScheduleCard + ActivityFeed | 按项目 Screen 传 children |
| crm | DashboardHeader → KpiMetrics → TrendChart → RankingList + RecentRecords | CrmMetricCard |

`KpiMetrics variant="plain"` 还原纯指标卡；默认 `chart` 首卡为紫色主题，其余为白底，交替使用迷你折线与柱图。逐项使用 `data` 提供真实序列，`visualization` 指定图型，`theme` 覆盖主题；`bars` 可统一提供柱图序列。未传序列的迷你图仅为模板演示，不是业务统计。已有 children 优先，默认装饰不包裹插槽内容。

### 周期切换

`TrendChart periods={[{ label: "日", chart: daily }, { label: "周", chart: weekly }, { label: "月", chart: monthly }]}` 提供非受控切换；每项也可使用 `countChart` 提供折线序列。`activePeriod/onPeriodChange` 提供受控方式，每项传对应聚合数据，不只换标签。Block 默认含周期控件、指标图标和 tooltip；没有多周期数据时仅显示「本期」，不伪造其他周期。显式 `variant="plain"` 移除这些装饰。底层 `ChartHeader` 本身默认无 tabs，与 Block 默认策略不同。

### 长周期计数：30 天与上一周期

用 `TrendChart countChart` 接受 SmoothLineChart 配置：series 两条分别为本期/上期订单笔数，各 30 个非负数；xAxisLabels 只标起止日期，showYAxis=true，yDomain 从 0 到两期最大值，yAxisLabels 用整数，不用货币。按序号对齐两个连续的 30 天窗口，说明时区、是否含退款、缺日补零。上期合计为零时不展示增长百分比。

```tsx
<TrendChart title="近 30 天订单趋势" subtitle="与上一周期逐日对齐 · 单位：笔" countChart={{
  series: [{ label: "本期", data: currentCounts }, { label: "上期", data: previousCounts }],
  showYAxis: true, yDomain: [0, maximum], yAxisLabels: [String(maximum), "0"],
  xAxisLabels: [startDate, endDate], interpolation: "linear",
}} />
```

宿主提供 currentCounts/previousCounts（各 30 项）、maximum（至少 1）及起止日期。dateSelection 可放真实 Datepicker，primaryAction 放导出等主操作；不要用 disabled 假按钮代替可用操作。

- 画廊：`/blocks`（17 项均有预览）；公共 API 对照：`/cases/dashboard-kit`。来源为[完整 Screens](screens.md)。
- 源码只依赖 React、`@forge-ui-official/core` 及其公开 icons 子路径；配色只使用 fg-* Token（白色/透明基础色除外），不依赖站点私有组件。
- 生成：`corepack pnpm blocks:generate`；校验：`corepack pnpm blocks:check`。`public/r/index.json` 为目录，`public/r/<name>.json` 内嵌完整源码，安装目标为 `@components/blocks/<name>.tsx`（遵循用户 components.json 别名）。
- 依赖 core `^0.6.0`。本次只修改版本，不发布 npm 或网站；公网安装须等待发布授权。可先在本仓使用 workspace core、本地访问 registry。
- 本地示例：`npx shadcn@latest add http://localhost:3000/r/kpi-metrics.json`。宿主须已有 React 19、Tailwind 4、core 样式及 Token，复制后的文件由用户维护。沿用[安装说明](../SKILL.md)配置，不附带后台、数据请求、鉴权或持久化。
- API 以各目录 TSX 类型为准。插槽不会额外套内容容器；接入时保留 Screen 的轨道、className、图域高与 compact 密度。图片、文案、业务回调由宿主提供，未绑定回调不代表业务已实现。

## 公共组件决策

新增 `Panel`，不改变 `SurfaceCard`；dashboard 变体为圆角 24px/边框/padding16，template 变体兼容旧共享 Panel 的圆角 Token/outline/padding24。
`ChartHeader`、`ChartMetricRow`、`GroupedBarChart`、`DivergingBarChart` 归 charts；`WalletGoalCard` 归 core。
原 DashboardShell 只有 AppLayout 默认值，无独立抽象价值，Screens 直接用 AppLayout；财务轮播和特定储蓄面板归 Blocks，不扩大业务化 core API。

业务模板迁移新增 `FileInput` / `InfoRow` 及类型导出；Button 的 `unstyled` 不增加默认类名、图标或文字包装，适用于已验收的模板按钮。Panel 的 `custom` 保留原始几何，`as` 保留 section/aside/article 语义；`asChild` 仅允许 custom、单一子元素且无标题/页脚插槽，用于保留 Next Link 根节点。新页面应优先选标准变体，不以 custom 自由设计另一套卡片。Modal 的 `template` 保留标题和分割线，用共享 dialog 处理焦点与 Escape；窄屏最大宽高受视口约束，需单独比对。

## 验收状态

源码、类型、单测、registry 与构建检查分开记录；1440/375 的前后截图与像素 diff 是独立门禁。本次环境 Chromium 启动被 macOS sandbox MachPort 拒绝，不能把静态迁移或构建通过当成视觉一致性通过。重放脚本、基线源码和实际结果记录在 `/tmp/forge-impl/G-shots/`。

其余模板的 T 轮提供 81 条可访问路径作为外部基线输入；本轮未自行完成浏览器截图与像素验收。G 轮浏览器失败是历史记录，不代表本轮进行过同一尝试。图表和品牌演示色仅可保留在 mock 数据中；project 的品牌色集中在 `_mock-palette.ts`，不据此声称已完成视觉验收。
