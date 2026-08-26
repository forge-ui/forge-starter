# Forge 页面审计清单（audit-checklist）

> 本清单是 `/forge-starter-audit` skill 的执行依据，也是本仓页面规范的**单一事实来源**。
> 适用对象：本仓（及由 forge-starter 衍生的业务仓）中所有 `app/(app)/**` 业务页面。
>
> **使用方式**：审计者（LLM）必须逐条核查，每条输出 `通过 / 违规 / 不适用` 三态之一；
> 判定为「违规」时必须给出**文件路径 + 行号证据**；禁止跳条、禁止笼统输出"整体符合规范"。
>
> **严重级**：🔴 红线（必须修复，多数可直接改）；🟡 判断（列出证据与建议，标注"建议复核"，除非明显才直接改）。
>
> **例外口径**：条目内以「口径：」开头的文字是该条的**正式例外**，与红线正文同等效力，
> 判定时必须一并读取——不要只看红线正文就判违规，也不要因发现例外就整条跳过。
> 文末「决策记录」只存决策背景，不引入新规则。
>
> **反哺机制**：审计中发现本清单未覆盖的新违规模式时，审计者应在报告中提出新增条目建议
> （编号顺延），经确认后追加到对应维度。样板本身的已知债务见文末「样板债」，禁止照抄。

---

## 标准参照（黄金样板）

| 角色 | 参照 |
|------|------|
| 列表（collection） | `app/(app)/accounts/page.tsx`（重）、`app/(app)/approvals/page.tsx`（轻） |
| 全页详情（detail） | `app/(app)/accounts/[id]/page.tsx` |
| 详情弹窗（detail-modal） | `components/approval-detail-dialog.tsx` |
| 表单弹窗（form-modal） | `components/account-form-dialog.tsx`、`components/approval-form-dialog.tsx` |
| 菜单/壳 | `config/menu.tsx`、`config/site.ts`、`components/app-shell.tsx` |
| 各角色范式画廊 | `/ref/*`（索引：`lib/reference/catalog.ts`，说明：`docs/reference-pages.md`） |
| Kit 级规范 | `../forge/docs/for-agents/`、`docs/forge-components.md` |

---

## M — 信息架构与菜单

- **M1** 🔴 主菜单只挂模块入口。逐项检查 `config/menu.tsx`：菜单项 `href` 不得指向 `/new`、`/edit`、`[id]` 详情、纯弹窗状态页、`/ref/**`。
  修复：从菜单移除，改为列表页内入口（按钮/行点击）。
- **M2** 🔴 菜单 icon 必须是 `solar-icon-set` 的 **`*BoldDuotone`** 变体、`size={20}`。检查 `config/menu.tsx` 全部 import 与 JSX。
  错误示例：`<UserLinear size={20} />`、`<UsersGroupTwoRoundedBold className="w-5" />`。
  修复：换成对应 BoldDuotone 变体 + `size={20}`，颜色不传（跟 accent）。
- **M3** 🔴 菜单只能改 `config/menu.tsx`（应用模块另加 `config/apps.ts`），新路由需在 `config/site.ts` 的 `routeShells` 注册（业务页通常 `hideHeader: true`）。检查是否有页面绕开 config 在别处（layout、页面内）拼菜单。漏注册的典型症状：兜底壳页头与页内 h1 叠成两套页头。
- **M4** 🔴 不得出现 `href: "#"` 或指向不存在路由的占位菜单项。逐个 `href` 与 `app/(app)/**` 目录对账。
- **M5** 🟡 菜单结构合理性：模块分组、顺序、命名是否符合业务动线；个人资料/安全设置类应走 profile 菜单而非主菜单。给出建议，标注"建议复核"。
- **M6** 🔴 菜单 `href` 尾斜杠风格与样板一致（样板用 `"/accounts/"` 带尾斜杠）。

## R — 路由与页面角色

- **R1** 🔴 每个业务模块必须能明确归入一种页面角色（dashboard / collection / detail / detail-modal / form-modal / form-page / settings），并与 `docs/page-roles.md` 的骨架对应。无法归类或骨架杂交（列表页里嵌全页表单等）判违规。
- **R2** 🔴 详情形态二选一且成对实现：重详情 = `[id]/page.tsx` 全页（对齐 accounts）；轻详情 = 详情弹窗（对齐 approvals）。同一模块同时铺两套、或该轻做重/该重做轻（字段少却做全页档案）判违规。
- **R3** 🔴 表单默认弹窗（form-modal）。独立表单页仅当字段极多（成区块、含上传/分步）且有明确理由。检查每个 `/new` 或 `/edit` 独立页是否有存在的必要。
  修复：改为列表页上的 `*-form-dialog`，原路由保留 redirect（对齐 `accounts/new/page.tsx` 的 `redirect("/accounts/?create=1")` 书签兼容模式）。
- **R4** 🟡 深链约定：弹窗表单/详情支持 `?create=1` / `?edit=<id>` / `?id=<id>` query 打开，`useEffect` 消费后 `router.replace` 清理。新模块缺深链不算红线，但样板兼容 redirect 页不得指向不存在的 query。
- **R5** 🔴 兼容 redirect 页（`/new`、`[id]/edit` 等）只允许 `redirect(...)` 一行逻辑，不得渲染真实 UI。

## H — 页头与面包屑

- **H1** 🔴 业务页页头必须对齐样板结构：左侧 `h1.text-display-l.font-semibold` + 下方 `Breadcrumbs`，右侧主操作 `Button`（`color={siteConfig.accent}`）。参照 `accounts/page.tsx` 262-282 行。口径：只读/受限操作的列表页可无右侧主按钮——**禁止为凑页头结构造功能**（如无业务意义的"重置/导出"按钮）。
  违规形态：无页头；手搓其他标题排版；同页出现两套页头；用 AppLayout `pageTitle` 与页内页头叠加。
- **H2** 🔴 `Breadcrumbs` 用法：`color={siteConfig.accent}`；`items` 为 `{ label, href? }` 数组；**末项为当前页、不带 `href`**；祖先项必须带真实 `href`。
- **H3** 🔴 动态路由 `[id]` 页面的面包屑末项 label 必须来自路由参数对应的**实体数据**（如 `account.name`）或页面类型文案（如"账号详情"），且中间层必须含列表页（如 `工作台 > 账号管理 > {account.name}`）。
  违规形态：末项硬编码与实体无关的字符串、直接渲染裸 `params.id`（uuid）、缺列表层级。
- **H4** 🔴 面包屑首层为工作台/首页（对齐样板 `{ label: "工作台", href: "/dashboard/" }`），层级与菜单结构一致，不得虚构不存在的中间层。
- **H5** 🔴 全页详情的返回动线：顶栏/页内提供返回（对齐 accounts `[id]`），**禁止在侧栏 meta 卡塞"返回列表"**。

## L — 布局与骨架

- **L1** 🔴 登录后页面必须处于 `AppShell`（`app/(app)/layout.tsx` 已包）内，页面自身**不得**再渲染 sidebar / topbar / 第二套 `AppLayout`，不得手搓 `<aside>` 导航。
- **L2** 🔴 页面根容器为纵向 stack（样板：`flex flex-col gap-5` 或 `gap-6`），不得在根部再加大内边距（`p-6`/`p-8`）——壳已管 padding。
- **L3** 🔴 列表页骨架顺序：页头 → 单行筛选（`ButtonGroup` pills + 右侧搜索 `TextField`）→ `DataTable` → 分页/空态 → 各弹窗。**筛选禁止两行 pills**。
- **L4** 🔴 全页详情骨架：主栏（Tab/区块/表格）+ 侧栏 meta 卡的两栏结构（对齐 accounts `[id]`）；侧栏只放元信息与轻操作。
- **L5** 🟡 Dashboard 骨架：指标卡行（StatCard 家族）→ 图表区 → 次级列表/榜单；栅格用 `grid` 并保证等高（`items-stretch`），不同断点合理折行。与 `/ref/dashboard-*` 对照，明显偏离时列出差异。
- **L6** 🟡 视觉密度与对齐：卡片圆角/留白与样板一致（样板空态卡 `rounded-[28px] border-dashed`）；同行卡片高度不齐、区块间距忽大忽小判违规。结合截图判断。

## C — 组件用法

- **C1** 🔴 UI 组件只从 `@forge-ui-official/core` import；本仓自有的仅 `@/components/ui/modal`、`@/lib/toast` 等既有封装。**禁止** MUI / Ant / shadcn / 自研重复轮子。Kit 缺能力标 `FORGE-GAP` 并停下询问，不就地手搓。
- **C2** 🔴 全页数据列表必须用 `DataTable`（或 `FullWidthTable` + `Cell*`），禁止手搓 `<table>`/div-grid 冒充表格。
- **C3** 🔴 `DataTable` 列的 `sortable: true` 只画 UI 不实现排序——未实现点击排序逻辑时禁止设置（假按钮）。
- **C4** 🔴 `ConfirmationDialog` 只是内容卡，必须包宿主：`@/components/ui/modal` 或半透明遮罩层（对齐 accounts 删除确认 `fixed inset-0 bg-black/30`）。裸用判违规。
- **C5** 🔴 状态展示必须带文字（用 `StatusText` 纯文本，见 V6），禁止仅用颜色点/色块表达状态。
- **C6** 🔴 无行为的装饰按钮/假操作（点了没反应的 Export、更多菜单等）：要么实现，要么删除。假操作还包括"假提交"——提交处理器只 toast 成功 + 跳转、数据不写入任何数据源（连 mock state 都不写），用户在列表看不到结果。
- **C7** 🟡 组件 props 按 case/样板用法传（常见错误：`DescriptionItem` 误用 `value`（应 `content`）、`TabBar` 误用 `items/value`（应 `tabs`）、给无内容的 slot 传 `null`（应省略 prop）、`DonutChart` 的 `segments.value` 为百分比 0–100 而非 0–1 小数——传小数会导致图形几乎为空且 tsc 不报错）。发现可疑 props 时对照 `docs/forge-components.md` 与 `../forge/src/app/cases/` 源码。
- **C8** 🔴 不得从 core import 不存在的组件（Toast / Drawer / Sheet 等）。反馈用 `@/lib/toast`。

## V — 视觉 token（颜色 / 图标 / 排版）

- **V1** 🔴 颜色只用 `fg-*` token（`text-fg-grey-700`、`bg-fg-grey-50`、CSS `var(--fg-violet)`），**禁止 Tailwind 默认色**（`text-blue-500`、`bg-gray-100`…）与未经确认的裸 hex。例外白名单（仅限 solar 图标 `color` prop、样板已确认）：`#71717A`（行内 muted）、`#EA580C`（删除确认危险图标）；白名单外的 hex 一律违规。
- **V2** 🔴 业务控件颜色统一 `color={siteConfig.accent}`（Button / Breadcrumbs / ButtonGroup / TextField / DataTable 等），不得各页各配色。口径：`siteConfig.accent` 的合法值只有 `"purple" | "blue" | "black"`（Kit 的 `AccentColor`/`AppLayoutAccentColor` 类型），写 `green`/`red` 等会直接导致壳层类型报错——改主题色只能在这三个值里选，其它色彩诉求走 `fg-*` token，不改 accent。
- **V3** 🔴 图标只用 `solar-icon-set`：侧栏 `*BoldDuotone` 20；页头/按钮 `*Linear` 16-18；行内 muted 色用 `color="#71717A"` 或 token。**禁止用 className 给 solar 图标上色**（fill 会硬编码失效），必须走 `color` prop。
- **V4** 🔴 图表颜色合法形态仅两种：`var(--fg-*)` CSS 变量字符串（`SmoothLineChart` 等 color prop），或组件明确支持的 `bg-fg-*` class（`ChartLegendItem`、`BubbleChart` 等）。禁止裸 hex（样板 dashboard 的 hex 是样板债，禁照抄）与 Tailwind 默认色 class。
- **V5** 🟡 排版层级与样板一致：页面主标题 `text-display-l font-semibold`，卡片标题/正文/辅助文字的字号与颜色（`text-fg-grey-500` 辅助）不混用。
- **V6** 🔴 彩色胶囊（`StatusBadge`/`Label` 及手搓的圆角底色 pill）在业务页**一律不用**——包括状态列。状态字段用 `components/ui/status-text.tsx` 的 `StatusText` 纯文本呈现（props 与 `StatusBadge` 同形；red=危险/禁用红字、grey=失效/撤销灰字、其余黑字）；分类、角色、标签等类目字段用 `CellText`/`CellMuted`。给枚举字段配胶囊底色（"彩虹胶囊"）是典型 AI 味，一票违规。绊线 `V6-status-badge` 会机械拦截。口径：确有产品方明确要求使用彩色徽章时需人工批准并记入决策记录；`/ref/` 展廊页的历史用法不在本条范围。

## F — 表单与交互 surface

- **F1** 🔴 新建/编辑弹窗表单实现对齐样板：`Modal`（`@/components/ui/modal`）宿主 + `TextField`/`SelectOption`/`TextArea` + 底部操作；状态由列表页 `useState`（`formOpen`/`editId`）管理。
- **F2** 🔴 删除等危险操作必须有确认（`ConfirmationDialog` + 宿主，`color="red"`），禁止点删即删。
- **F3** 🔴 表单校验错误落到字段：`TextField state="error"` + `errorMessage`；不允许只 toast 或 alert。
- **F4** 🔴 操作反馈用全站 toast（`import { toast } from "@/lib/toast"`），**禁止页面内嵌"创建成功"绿条**。
- **F5** 🟡 创建成功后的动线：重模块跳全页详情（accounts 模式）或轻模块开详情弹窗（approvals 模式），与该模块详情形态一致。
- **F6** 🔴 不得默认引入 Drawer/Sheet 交互（Kit 未导出）；确有需要标 `FORGE-GAP` 询问。

## D — 数据与状态

- **D1** 🔴 列表页三态齐全：`error`（可重试）→ `loading` → 空态 → 数据。空态必须区分"真无数据（引导新建）"与"筛选无结果（清除筛选）"，对齐 accounts 310+ 行。口径：纯同步 mock 数据页（无异步数据源）的 `error`/`loading` 两态判**不适用**，空态双分支仍必须做；无新建能力的只读列表，"真无数据"分支给业务合理的说明或引导即可（不强求"引导新建"，也不得为此造假按钮）。
- **D2** 🔴 全页详情处理 `loading && !entity`（加载中）与 `!entity`（不存在 + 返回列表）两态。
- **D3** 🔴 业务数据走 `lib/<resource>/service.ts` + `app/api/<resource>/**` + client store（`components/<resource>-store.tsx`，Provider 挂 `app/(app)/layout.tsx`）；页面不得内联持久化逻辑或假内存 CRUD 冒充落库。演示页可用 `_data.ts` mock，但必须显式标注。口径：项目或用户任务**显式声明为 mock 演示仓**时，本条与铁律 8 的持久化要求不适用——此时 mock 放 `lib/<resource>/mock-data.ts` + 页面 state，文件头标注演示约定，且不得暗示数据已持久化；未显式声明的一律按本条原文执行。
- **D4** 🔴 业务表独立建（`lib/db/schema.ts`），**禁止**把业务实体混进登录表 `users`。
- **D5** 🟡 应当可分享的列表筛选/搜索状态进 URL query；纯临时态留 React state。
- **D6** 🔴 密码、token、密钥类敏感字段不得在列表、详情、mock 数据中明文展示；确需展示用 `••••••` 掩码；mock 数据不得包含真实形态的敏感值。

## E — 工程组织

- **E1** 🔴 模块文件就位：页面 `app/(app)/<resource>/`、弹窗 `components/<resource>-form-dialog.tsx`、store `components/<resource>-store.tsx`、后端 `lib/<resource>/` + `app/api/<resource>/`。不得把整套逻辑堆在单个 page.tsx（>400 行且含 dialog+store+service 逻辑判违规）。口径：显式声明的 mock 演示模块（见 D3 口径）只要求页面 + `lib/<resource>/mock-data.ts`（+ 需要时的弹窗组件），**不要求也不允许**为凑结构补 store/service/API——造一套假 API 冒充完整模块同样判违规。
- **E2** 🔴 API 形态对齐样板：session 守卫（未登录 `jsonError("未登录", 401)`）、`jsonOk/jsonError`、Zod 校验、中文错误信息。
- **E3** 🟡 复用优先：域内重复 3 次以上的 UI 块应提取组件；但禁止过度抽象（单处使用不提取）。
- **E4** 🔴 页面文件为 client 组件时必须 `"use client"` 且实际用到交互；纯展示 server 组件不得误标。

## Q — 交付验证

- **Q1** 🔴 `pnpm typecheck` 通过。
- **Q2** 🔴 UI 变更后必须浏览器实际打开主路径验证（截图留档），禁止只 curl。
- **Q3** 🟡 与对应黄金样板做整体结构 diff（区块顺序、组件选型、状态处理），列出所有偏差并逐个判定"合理业务差异 / 违规"。
- **Q4** 🟡 浏览器验证时同时检查 console / Next dev overlay：本次改动不得新增 console error 或 React 警告；发现范围外的既有警告记入报告"建议复核"，不擅自修。

---

## 样板债（禁止照抄的已知问题）

1. `accounts/page.tsx`、`accounts/[id]/page.tsx`、`approvals/page.tsx`、`dashboard/page.tsx`、`settings/apps/page.tsx` 多列 `sortable: true` 但无排序逻辑——违反 C3，新代码禁止照抄。
2. `dashboard/page.tsx` 图表 series/图例仍用裸 hex（`#2563eb` 等）与 `bg-[#…]` 任意值 class——违反 V4，新代码用 `var(--fg-*)`。
3. `/ref/**` 画廊多页存在 Tailwind 默认色（amber/emerald 等）——违反 V1，抄 `/ref` 范式时颜色必须换成 `fg-*`（绊线对 `/ref` 降级为警告）。
4. `account-form-dialog.tsx`、`settings-security-panel.tsx` 的校验错误为表单级 `<p>` 汇总文案——违反 F3，新代码必须字段级 `TextField state="error" + errorMessage`，不得以"对齐样板"为由放行。

## 决策记录

- 2026-08-21：页头标准定为 starter 样板模式（h1 + Breadcrumbs + 主按钮）。forge monorepo 模板的 `PageTitleToolbar` 体系不用于本仓业务页（避免两套页头并存）。
- 2026-08-25：mock 演示模块（无数据库）缺 `?create=1` 深链、创建成功后不自动开详情弹窗，均判"合理低配"（与 users/roles 先例一致）；接真实 API 的模块仍按 R4/F5 原文执行。
- 2026-08-25：本审计只覆盖规范符合性，不覆盖功能正确性（NaN 边界、分页越界等逻辑 bug 属开发自测与 code review 范畴）。
