# Forge UI Kit — AI 接入指南

你正在协助一个基于 **Forge UI Kit** 搭起来的 Next.js 项目。Forge 是一套 ToB 级组件库 + 布局 + 登录/业务模板，整个工作方式是「AI 拼装、人工确认」——你不手写组件、不自己选色、不造轮子。人只做 UI 效果与组件选型的确认。

## 你的职责

1. 读用户给的业务文档（PRD / 流程图 / 接口说明）
2. 拆出页面清单 + 每页的操作流
3. 从现成资源里挑：登录套件、业务模板骨架、组件、布局
4. 拼出页面，只 `import` 不手搓
5. 缺件或不确定的，停下问人，别自行发挥

## 铁律（违反必须重写）

1. **组件只从 `@forge-ui/react` 导入**。禁止手搓 `<div class="bg-...">` 复刻设计稿的卡片、按钮、输入框等。Kit 里没有就停下问，不要自行画。
2. **颜色只用 `fg-*` token**。禁用 Tailwind 默认色（如 `text-blue-500` `bg-gray-100`），全部换成 `text-fg-violet` `bg-fg-grey-100`。没对上的颜色去 `src/app/globals.css` 的 `@theme inline` 里扩 token，不要就地写 hex。
3. **Icon 用 `solar-icon-set`**，导出名以 `Linear` / `BoldDuotone` / `Bold` 等后缀结尾。颜色必须用 `color="#HEX"` prop，不要用 className 上的 `text-*`——库里 fill 写死了，className 不生效。尺寸用 `size={N}` prop。
4. **布局用 `<AppLayout>`**（`@forge-ui/react`），不要自己拼 sidebar + topbar。登录页直接用 `/sign-in` `/sign-up` `/forgot-password` `/reset-password` 现成页面。
5. **不确定就看 `/cases/<name>`**。Forge 每个组件都有一页示例（`src/app/cases/<name>/page.tsx`），去读它，比凭想象写 props 靠谱十倍。

## 可用资源索引

### 组件清单（`@forge-ui/react`）

按类别分组，括号里是 `cases/` 下对应的示例页：

**基础**
- `Button` / `IconButton` / `StyledLink`（button-link）
- `NotificationBadge` / `Label` / `CircleIcon` / `ArtisticIcon`（badge）
- `ProgressBar`（progress）
- `Checkbox` / `RadioButton` / `Toggle`（input-field）
- `Avatar` / `AvatarGroup`（badge）

**表单**（cases/input-field）
- `TextField` / `TextArea` / `SelectOption` / `Datepicker`
- `MediaUpload` / `ProfileImgUpload` / `FileUpload` / `FileCard` / `FileTypeIcon`
- `IconSelector` / `IconPicker` / `ColorPicker`
- `TextFieldSelectSuffix`

**数据展示**（cases/card / cases/list / cases/table）
- 卡片家族：`StatCard` / `ProgressStatCard` / `LineChartStatCard` / `WheelChartStatCard` / `BarChartStatCard`
- 金融卡：`BalanceCard` / `DebitCard` / `CreditCard`
- 业务卡：`ProjectCard` / `TaskCard` / `UserCard` / `ImageStatCard` / `HighlightCard` / `ProgressCard` / `ActivityCard`
- 列表：`ListItem` / `DescriptionItem` / `ListGroup` / `MenuItem` / `NotificationItem` / `ProfileCard` / `ContactItem`
- 表格：`DataTable` / `FullWidthTable` / `TableCell` / `StatusBadge` / `ProgressBadge`

**图表**（cases/chart）
- `MeterChart` / `HalfDonutChart` / `DashedHalfDonutChart` / `DonutChart` / `PieChart` / `MultilayerDonutChart` / `BubbleChart`
- `BarChart` / `BarHorizontalChart` / `BarUpsideDownChart` / `SmoothLineChart`
- `ChartCard` / `ChartTooltip` / `ChartListItem` / `ChartLegendItem` / `ChartValueRow` / `ChartStatFooter`

**聊天与社交**（cases/chat / cases/comment）
- `ChatBubble` / `ChatInputBar` / `CommentItem` / `ReviewItem`

**筛选**（cases/filter）
- `FilterGroup` / `FilterTrigger` / `FilterPanel`

**日历**（cases/calendar）
- `SmallCalendar` / `SmallDailyCalendar` / `FullCalendar`
- `CalendarDayCell` / `CalendarWeekRow` / `EventCard` / `EventTag`

**时间轴**（cases/history）
- `HistoryItem` / `HistoryGrouped`

**导航与控件**
- `SidebarMenu`（cases/menu）
- `TopBar` / `PageHeader` / `Breadcrumbs`（cases/page-header）
- `Toolbar` + 一堆 Toolbar 子组件 / `PageTitleToolbar`（cases/toolbar）
- `Pagination` / `Stepper` / `PageDot` / `TabBar` / `ButtonGroup`（cases/pagination-stepper, cases/tab）
- `Tooltip` / `TooltipBubble` / `TooltipAnchor`（cases/tooltip）
- `ConfirmationDialog`（cases/modal）
- `DropdownPanel` / `IconTrigger` / `KebabMenu`（cases/menu）

**Widget**（cases/other-widget）
- `CurrencyConverter` / `RatingStars` / `ImageGrid` / `ProductRow` / `MapCard`（cases/map）

**布局模板**
- `AppLayout`（`@forge-ui/react/app-layout`）— sidebar + topbar + 内容区一站式，业务页都用它

### 颜色 Token（`src/app/globals.css`）

8 个色系 × 10 shade（50/100/200/.../900），外加一个 `grey`：

- `fg-violet-{50..900}`（品牌主色，别名 `fg-violet = 500`）
- `fg-blue-{50..900}`
- `fg-green-{50..900}`
- `fg-red-{50..900}`（别名 `fg-red = 500`）
- `fg-yellow-{50..900}`（别名 `fg-yellow = 500`）
- `fg-cyan-{50..900}`
- `fg-black-{50..900}`（别名 `fg-black = 500 = #000A19`，注意不是纯黑）
- `fg-grey-{50..900}`

**用法**：
- Tailwind 直接用 `bg-fg-violet-500` `text-fg-black` `border-fg-grey-200`
- 运行时取 hex：`var(--fg-violet)` / `var(--fg-grey-700)`
- 深浅调性通常：`50/100` 作浅底、`500` 作主色、`700+` 作深底或高对比文字

### Icon（`solar-icon-set`）

```tsx
import { MagniferLinear, BellBoldDuotone } from "solar-icon-set";

<MagniferLinear size={16} color="#71717A" />
<BellBoldDuotone size={24} color="var(--fg-violet)" />
```

**项目内默认灰色 icon 色值**：`#71717A`（对应 `fg-grey-700` 附近），保持全站一致。

**踩坑（常犯）**：
1. `className="text-fg-red"` 对 solar icon **不生效**——库里 fill 写死，颜色必须走 `color` prop。
2. 外层 wrapper 给了 `p-Y`（上下 padding）或固定 height 会**压扁 SVG**。icon 外包装只给 `w-X h-X` 的正方形 box，或者 `inline-flex items-center`。

### 布局（`AppLayout`）

```tsx
import { AppLayout } from "@forge-ui/react";

<AppLayout
  mode="light"              // light | dark
  accent="purple"           // purple | blue | black
  profilePosition="sidebar" // sidebar | topbar
  logoText="Your Brand"
  teamName="Acme Inc"
  menuItems={[
    { icon: <HomeLinear size={20} />, label: "Dashboard", href: "/dashboard" },
    { label: "Orders", href: "/orders", badge: 3 },
  ]}
  profile={{ avatar: "/me.jpg", name: "Jane Doe", role: "Admin" }}
  pageTitle="Orders"
  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Orders" }]}
  pageHeaderVariant="detail"  // home | detail
  primaryAction={{ label: "New", onClick: () => {} }}
>
  {/* 你的业务内容 */}
</AppLayout>
```

示例页在 `/examples/ecommerce/*`，可参考。

### 登录套件（现成页面，改文案与接口即可）

- `/sign-in` — 登录
- `/sign-up` — 注册
- `/forgot-password` — 忘记密码
- `/reset-password` — 重置密码

源文件：`src/app/{sign-in,sign-up,forgot-password,reset-password}/page.tsx`

### 业务模板（真实多页骨架）

`src/app/examples/(dashboard)/ecommerce/` 下是一套电商后台，包含：
- `categories` / `customers` / `orders` / `products` / `sellers`
- 每个模块都有 列表页 / 详情页 `[id]` / 新建页 `new`
- 统一用 `AppLayout`、`DataTable`、`Toolbar` 拼装

新业务用它当骨架：先复制最接近的模块（如 orders 给"订单类业务"），再改字段和接口。

### Case 索引（组件用法示例，写代码前必看对应页）

`/cases/<name>` → `src/app/cases/<name>/page.tsx`：

badge / button-link / calendar / card / chart / chat / comment / filter / history / input-field / list / map / menu / modal / other-widget / page-header / pagination-stepper / progress / tab / table / toolbar / tooltip

（共 22 个。`file-type` 和 `style-guide` 是 `/components/*` 下的 Kit 资产展示页，不是业务示例，命中需求时直接读源文件 `src/app/components/{file-type,style-guide}/page.tsx`。）

## 工作流

**Step 1. 读 PRD**
抽出：页面清单、每页主要操作、数据字段、业务状态、权限边界。

**Step 2. 挑骨架**
- 有登录需求 → 用 `/sign-in` 等现成页
- 后台业务（列表+详情+新建） → 复制 `app/ecommerce/<最接近模块>/` 改
- 自定义页面 → 套 `<AppLayout>` 起架子

**Step 3. 拆页面 → 拼组件**
- 先写页面骨架（AppLayout + Toolbar + 主内容容器）
- 主内容按区块拆：每块对应一个 Kit 组件或组件组合
- 遇到不确定的组件 → 打开 `/cases/<name>` 对应示例页复制用法
- 颜色选 `fg-*`，icon 选 `solar-icon-set`

**Step 4. 缺件停下**
如果 Kit 里没有合适组件（不是变体缺失，是真的没有），**立即停下问人**。不要自己手搓 div 复刻。用户会判断要不要扩 Kit。

**Step 5. 自检**
- `pnpm tsc --noEmit` 通过
- 本地起服务：`pnpm dev --port 3456 --hostname 0.0.0.0`（常驻，别自己另起）
- 截图给用户确认效果

## 提交前自检清单

- [ ] 没有手搓 div 复刻 Kit 已有组件
- [ ] 颜色全部走 `fg-*` token，无裸 Tailwind 默认色
- [ ] Icon 全部 `solar-icon-set` + `color` prop
- [ ] 布局用 `<AppLayout>` 或继承自模板
- [ ] tsc 通过
- [ ] 截图与设计对照过
- [ ] 不确定的地方已问人，未自行发挥
