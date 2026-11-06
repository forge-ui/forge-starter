# Forge 页面审计（Starter 适配）

通用规范唯一正文：[forge-skill](https://github.com/forge-ui/forge/tree/main/skills/forge-skill)，通用编号清单为主仓 `skills/forge-skill/references/audit-checklist.md`；版本同步入口见 [forge-skill/README.md](forge-skill/README.md)，同步后读 `forge-skill/upstream/references/audit-checklist.md`。本文件仅维护 Starter 接线差异，不是第二份通用规范。

执行 `.agents/skills/forge-starter-audit/SKILL.md`：先定角色/主 Screen，再按 S 页面结构 → O 内容根 → N 区块外壳 → C 组件取证；通用清单与本地适配每条记录通过/违规/不适用及文件行号。缺失上游副本或无法打开主清单时不得声称完整审计通过。技术检查、规范审计、浏览器验收分别记录。

## 通用条目入口

- **L8** 按所选 Screen 判定表格外壳：官方 ecommerce-2 的卡内 `DataTable` 合法；不得一刀切禁止包卡，也不得无依据新增卡壳。继承主模板的边框、圆角、内边距与密度。
- **V3 / M2** Solar 统一从 `@forge-ui-official/core/icons` 导入；Starter 侧栏保持 `BoldDuotone`、`size={20}`。支持 `color` 和 `currentColor`（含 className 继承），不得沿用旧库的 className 禁法。
- **H6** 检查实际 JSX 与所选壳上下文，不能因注释或未使用 import 判违规；不能证明场景时列待复核。
- **V7** h1 主标题不用 `text-fg-grey-300/400/500/600`；正文、label、caption 按主清单的语义层级审查，机械检查仅覆盖标题子集。
- **C1 / C8** core 0.4.7 已导出 Modal、Drawer、ToastProvider/useToast。独立 ConfirmationDialog 使用受控 open/onOpenChange；已有内联确认继续复用本地 Modal，不再二次包受控 Dialog。
- **V6** 保留 Starter 的语义状态默认 soft StatusBadge；分类/角色为纯文字，一张表最多一列状态胶囊。

## Starter 检查项

- **M3** 🔴 新模块必须声明 `config/modules/<id>.json` 并运行 `pnpm modules:generate`，自动派生 `APP_MODULE_IDS`、`APP_MODULE_META`、`MODULE_MENU`、权限资源、知识与服务端工具注册；禁止手改生成文件或只改 `menu.tsx`。用 `pnpm modules:check` 核对遗漏与漂移。默认应用种子勾齐新 id。`rbac_menus` 可选，只写目录不进 `APP_MODULE_IDS` 侧栏仍看不见。默认产品自动合并新模块；自建应用手动勾选，仅明确重置时清 `forge-starter:app-registry`。无 `{module}:read` 直链业务页必须壳层 `replace` 回工作台，禁止只藏侧栏或停在空态/403 列表。新路由需在 `config/site.ts` 的 `routeShells` 注册（业务页通常 `hideHeader: true`）。检查是否有页面绕开 config 在别处（layout、页面内）拼菜单。漏注册的典型症状：兜底壳页头与页内 h1 叠成两套页头。

- **M6** 🔴 菜单 `href` 尾斜杠风格与样板一致（样板用 `"/accounts/"` 带尾斜杠）。

- **R2** 🔴 详情形态二选一且成对实现：重详情 = `[id]/page.tsx` 全页（对照该角色的 detail 参照；本仓捷径是 `accounts/[id]`）；轻详情 = 详情弹窗（`/ref/detail-modal` + `components/ui/modal.tsx` + `?id=`）。同一模块同时铺两套、或该轻做重/该重做轻（字段少却做全页档案）判违规。

- **R4** 🟡 深链约定：弹窗表单/详情支持 `?create=1` / `?edit=<id>` / `?id=<id>` query 打开，`useEffect` 消费后 `router.replace` 清理。新模块缺深链不算红线，但样板兼容 redirect 页不得指向不存在的 query。

- **R5** 🔴 兼容 redirect 页（`/new`、`[id]/edit` 等）只允许 `redirect(...)` 一行逻辑，不得渲染真实 UI。

- **H1** 🔴 业务页必须有 Forge 页头，用 Kit 组件实现。同一页只选一套，禁止叠两套（含壳 `pageTitle` 与页内页头叠加）。合法形态：
  - **A. Starter 紧凑**：`h1.text-display-l.font-semibold` + `Breadcrumbs` + 右侧 `PageTitleActions`（Kit `AskAi` 槽 + 主操作 `Button`，`color={siteConfig.accent}`）。无主操作时可只挂 `AskAiEntry`。
  - **B. Kit 正文页头**：`PageTitleToolbar`（列表/详情/看板都可用）。**面包屑写进这个组件**，不要写在它外面再挂一行。
    - core `≥ 0.1.12`：`variant` 对上角色（`collection` / `overview` / `detail` / `action`）+ `breadcrumbItems` + 结构化 action，对照 `/cases/toolbar`。Ask AI 与标题同一条；全局保活入口参照 `docs/forge-components.md` 的 `PageTitleToolbar` + `ToolbarActions` + `AskAiEntry` 组合。
    - core `≤ 0.1.11`：只有 `title` + `breadcrumbs={<Breadcrumbs … />}` + `actions`。视觉与模板相同，**不得因没写 `variant` 判违规**。
  - **C. 壳顶栏**：`AppLayout` / `AppShell` 的 `PageHeader variant="title"`（`hideHeader` 未开）。只用于「顶栏返回+标题」。面包屑若需要，走 AppLayout 的 `breadcrumbs` 槽，**页内不得再画 h1 / `PageTitleToolbar`**。
  **不要**用 `PageHeader variant="search"` 当列表/详情页头。
  口径：只读/受限操作的列表可无右侧主按钮——**禁止为凑结构造功能**。选了 B/C 不得再要求必须长得像 accounts 的 h1。
  违规：无页头；手搓 `h1`/`<input>`/`<button>`/`span` 仿标题或面包屑；裸 hex 字号（如 `text-[28px] text-[#000A19]`）；用 `PageHeader` 冒充正文页头。

- **H4** 🔴 面包屑首层为工作台/首页（对齐样板 `{ label: "工作台", href: "/dashboard/" }`），层级与菜单结构一致，不得虚构不存在的中间层。

- **H5** 🔴 全页详情的返回动线跟第 0 步选的 chrome：A/B 靠面包屑祖先项，**不要求**圆形返回按钮；C 必须 `showBackButton` + `onBack`。**禁止在侧栏 meta 卡塞「返回列表」**。`hideHeader: true` 时壳 `onBack` 不渲染，不能当返回动线。

- **L1** 🔴 登录后页面必须处于 `AppShell`（`app/(app)/layout.tsx` 已包）内，页面自身**不得**再渲染 sidebar / topbar / 第二套 `AppLayout`，不得手搓 `<aside>` 导航。

- **L10** 🔴 右侧内容壳的四周 gutter 必须始终可见：顶、右、底与 Kit `AppLayout` 一致（外层 `data-forge-app-content` 的 `md:p-2`，内层主列 `p-4 sm:p-5`），**禁止**靠整页向下滚动才露出底边距。
  合法：壳列锁在视口（父级 `h-dvh` / `overflow-hidden` + 子级 `min-h-0`）；圆角内容面（灰底/白底）与视口底边之间始终能看到与右侧同等的固定间距；页头、工具带留在面内，超高的表/正文在面内滚动（`min-h-0 flex-1 overflow-auto`）。
  违规：内容面贴死浏览器底边；窗口滚动条是主滚动、底 gutter 被顶出视口；页面根或壳用 `min-h-screen` 随内容长高，把 `md:p-2` 推到折页下方。
  口径：未登录 auth 页不适用。短页不溢出时底 gutter 仍必须在首屏可见，不要把内容面拉满贴底。L2 禁止页面再垫一层 `p-6`，本条管的是**壳已有的间距不能滚没**。Kit 若仍写 `min-h-screen`，宿主 `AppShell` / 页面 stack 必须把列高锁回视口，不要在每个业务页手搓第二套 padding。
  截图核（首屏、侧栏展开、**不必先滚**）：指着内容面底边问「和右侧是不是同一圈灰边」；没有、或要往下滚才出现 → 本条违规。

- **F1** 🔴 新建/编辑弹窗表单实现对齐样板：`Modal`（`@/components/ui/modal`）宿主 + `TextField`/`SelectOption`/`TextArea` + 底部操作；状态由列表页 `useState`（`formOpen`/`editId`）管理。

- **F4** 🔴 操作反馈用全站 toast（`import { toast } from "@/lib/toast"`），**禁止页面内嵌"创建成功"绿条**。

- **D1** 🔴 列表页三态齐全：`error`（可重试）→ `loading` → 空态 → 数据。空态必须区分"真无数据（引导新建）"与"筛选无结果（清除筛选）"。对照第 0 步选定的列表参照做双分支，不要对行号。口径：纯同步 mock 数据页（无异步数据源）的 `error`/`loading` 两态判**不适用**，空态双分支仍必须做；无新建能力的只读列表，"真无数据"分支给业务合理的说明或引导即可（不强求"引导新建"，也不得为此造假按钮）。

- **D2** 🔴 全页详情处理 `loading && !entity`（加载中）与 `!entity`（不存在 + 返回列表）两态。

- **D3** 🔴 业务数据走 `lib/<resource>/service.ts` + `app/api/<resource>/**` + client store（`components/<resource>-store.tsx`，Provider 挂 `app/(app)/layout.tsx`）；页面不得内联持久化逻辑或假内存 CRUD 冒充落库。演示页可用 `_data.ts` mock，但必须显式标注。口径：项目或用户任务**显式声明为 mock 演示仓**时，本条与铁律 8 的持久化要求不适用——此时 mock 放 `lib/<resource>/mock-data.ts` + 页面 state，文件头标注演示约定，且不得暗示数据已持久化；未显式声明的一律按本条原文执行。

- **E1** 🔴 模块文件就位：页面 `app/(app)/<resource>/`、弹窗 `components/<resource>-form-dialog.tsx`、store `components/<resource>-store.tsx`、后端 `lib/<resource>/` + `app/api/<resource>/`。不得把整套逻辑堆在单个 page.tsx（>400 行且含 dialog+store+service 逻辑判违规）。口径：显式声明的 mock 演示模块（见 D3 口径）只要求页面 + `lib/<resource>/mock-data.ts`（+ 需要时的弹窗组件），**不要求也不允许**为凑结构补 store/service/API——造一套假 API 冒充完整模块同样判违规。

- **E2** 🔴 API 形态对齐样板：session 守卫（未登录 `jsonError("未登录", 401)`）、`jsonOk/jsonError`、Zod 校验、中文错误信息。

- **E4** 🔴 页面文件为 client 组件时必须 `"use client"` 且实际用到交互；纯展示 server 组件不得误标。

- **Q1** 🔴 `pnpm check`（类型、绊线、自检与规范漂移检查）通过。

- **Q2** 🔴 UI 变更后必须浏览器实际打开主路径验证（截图留档），禁止只 curl。

- **Q3** 🟡 对照物必须来自 skill 第 0 步。先认定 H1 的 A/B/C，再与**该对照页 / case** 做结构 diff（区块顺序、组件选型、状态处理）。每个偏差判定「合理业务差异 / 违规」。**不得把「没用 accounts 的 h1」当成违规。写不出对照物本条判违规。**

- **Q4** 🟡 浏览器验证时同时检查 console / Next dev overlay：本次改动不得新增 console error 或 React 警告；发现范围外的既有警告记入报告"建议复核"，不擅自修。

- **Q5** 🔴 页面切换与刷新动效：遵循 `docs/page-motion.md`。新业务页必须沿用现有 `AppShell` / `PageTransition`，禁止整壳按路由重挂载或逐页复制动画。浏览器实际验证：① 侧栏普通链接切页先淡出、进入后按实际页面区块错峰淡入，侧栏保持常驻且分组展开正常；② 目标页直接刷新后进入正常、最终可见；③ 对照计算样式核220ms ease-out、6px位移、0/20/40/60ms错峰上限，观察内容面gutter/滚动和布局，不以“用了transform”代替实测；④ 减少动态效果时动画关闭且无额外100ms等待；⑤ 同路径筛选/query/弹窗保留原交互，外链/下载/修饰键不被误拦截；⑥ 涉及动效实现修改时补验慢路由恢复。记录适用项及证据，其余写明不适用理由。程序化导航和前进后退按当前“进入动效”边界记录，不能当作完整离场已实现。动效时长不含网络/编译等待，异步数据导致的布局变化须另核；详见文档。

## 样板债（禁止照抄的已知问题）

1. ~~业务表 `sortable: true` 无排序~~ **已修**（2026-09-11）。`/ref/**` 画廊若仍带假排序，抄范式时不要带回。
2. `dashboard/page.tsx` 图表 series/图例仍用裸 hex（`#2563eb` 等）与 `bg-[#…]` 任意值 class——违反 V4，新代码用 `var(--fg-*)`。
3. `/ref/**` 画廊多页存在 Tailwind 默认色（amber/emerald 等）——违反 V1，抄 `/ref` 范式时颜色必须换成 `fg-*`（绊线对 `/ref` 降级为警告）。
4. `account-form-dialog.tsx` 的校验错误为表单级 `<p>` 汇总文案——违反 F3，新代码必须字段级 `TextField state="error" + errorMessage`，不得以"对齐样板"为由放行。资料/改密弹窗已按字段级错误改过。
5. `accounts/[id]` 会话表的白卡不能单凭“包表”判违规；按所选模板核 L8。
6. `/ref/**` 画廊仍用 Tailwind `grid grid-cols-*` 做页面分栏——违反 L9。抄 `/ref` 范式时必须换成 `Grid`/`GridItem`。业务样板 `dashboard`、`accounts/[id]` 已迁，不要回抄画廊。

## 决策记录

- 2026-09-11：收一轮样板债：业务表去掉假 `sortable`；登录/注册文案跟 `AUTH_MODE`；详情顶栏/返回进 `routeShells`；旧设置页只跳 `/settings/apps/`，不再用 `?dialog=`。
- 2026-09-11：头像菜单「编辑资料 / 修改密码 / 系统设置」改为 `settings-account-dialog` form-modal，停在当前页。
- 2026-09-11：L9 补用法：视口断点 ≠ 内容宽；`gap` 是像素；嵌套栅格相对父列，主栏内禁止再套页面 `4+8`。账号详情概览改为主栏内 `5+7`。
- 2026-09-11：新增 **L9**：页面分栏用 Kit `Grid`/`GridItem`（npm `0.1.13`）。未导出则不适用，禁止虚构 import。不把 `className="grid"` 写进绊线。一维工具带仍 Flex。
- 2026-09-10：新增 **C10**：详情指标卡不得只重复本页已有字段。由衍生仓详情侧栏进度卡（数字与阶段列表重复、subtitle 抄行业）漏检反哺。
- 2026-09-10：新增 **H7**：状态胶囊必须能读出「谁的状态」。由衍生仓详情页头下孤飘「进行中」漏检反哺。H6「状态放正文」被执行成无 label 的裸徽章，V6 过关不能代替本条。
- 2026-09-10：L8 口径补正：描述 / History / 文件 / 阶段列表必须用官方 Panel 卡；禁止把「表不准套卡」理解成正文列表也裸铺，禁止用整页宽进度条撑面积。
- 2026-09-10：L4 去掉「PageHeader 详情」说法（详情对照 A/B，不是壳顶栏）。`accounts/[id]` 表外套白卡列入样板债，L8 新代码不得照抄。
- 2026-09-10：审计改为 **由外到内四层**（skill）再勾清单。由衍生仓详情「用了 DataTable 却套白卡 / 假进度卡 / 手搓流程胶囊」漏检反哺。新增 **L8**；L7 明确覆盖详情嵌套表。H1-B 以 npm `≥0.1.12` 的 `variant` API 为标准，`≤0.1.11` 仍认 legacy。
- 2026-08-21（**已废止**）：曾写「业务页禁用 PageTitleToolbar、只许 h1 + Breadcrumbs」。2026-09-02 改为按 Forge 组件/token/内容区审，PageTitleToolbar 合法。
- 2026-09-02：审计以 Forge 样式规范为准，不以「是否抄成 accounts」为准。页头合法形态见 H1（A 紧凑 / B PageTitleToolbar / C PageHeader title）。同一页只许一套，禁止与壳页头叠加。
- 2026-08-25：mock 演示模块（无数据库）缺 `?create=1` 深链、创建成功后不自动开详情弹窗，均判"合理低配"（与 users/roles 先例一致）；接真实 API 的模块仍按 R4/F5 原文执行。
- 2026-08-25：本审计只覆盖规范符合性，不覆盖功能正确性（NaN 边界、分页越界等逻辑 bug 属开发自测与 code review 范畴）。
- 2026-09-02：Kit `@forge-ui-official/core@0.1.11` 已默认 soft。业务页状态列改回 `StatusBadge`；`StatusText` 弃用。权限/角色等类目仍用纯文本。
- 2026-09-12：轻详情对照 `/ref/detail-modal` + `Modal` + `?id=`（**暂无第二业务样板**，不要指向已删的 approvals）。
- 2026-09-12（已被 manifest 生成机制取代，不再执行）：新菜单曾要求手改**菜单三处**（`APP_MODULE_IDS` + `APP_MODULE_META` + `MODULE_MENU`）；默认应用勾齐新 id；`rbac_menus` 只是目录。加完清 `forge-starter:app-registry`。侧栏再按登录角色 `:read` 过滤。
- 2026-09-21：Ask AI 四条示范问题走 `POST /api/ask-ai`：有 `ASK_AI_LLM_API_KEY` 问模型，并带账号表快照；没密钥用本地规则。禁止请求体传 key。
- 2026-09-21：Ask AI 演示改成四条中文问答，按问题选用 Agent 组件；禁止把 `/cases/agent` 英文原文整页塞进抽屉。
- 2026-09-21：Ask AI 跟到 core `0.1.17`：Kit 自带全屏层与 `sessions` 栏。禁止再自研全视口层。
- 2026-09-20：Ask AI 用 Kit `AskAi`。Starter `hideHeader` 下入口挂页头右侧槽，不走 `AppLayout.askAi`，禁止浮钮/自研抽屉。
- 2026-09-20：新增 **L10**：右侧内容壳顶/右/底 gutter 必须锁在首屏，溢出在内容面内滚动。由「列表一长，底边距要往下滚才看见」反哺。L2 只管页面不要再垫 padding，不覆盖本条。
- 2026-09-18：新增 **V7**：字色按 Forge `--text-primary/secondary/muted/disabled` 分层。由「新页面正文也写成浅灰、V1 只验 token 家族漏检」反哺。V5 不再把辅助色写成 `text-fg-grey-500`（那是 `--text-disabled`）。
- 2026-09-12：审批中心再次从公共 starter 删除，勿当轻样板对照。
- 2026-09-09：审计必须先定角色再选对照页（skill 第 0 步）。`accounts` 不是全站基线；卡片列表对照 `/ref/list-cards`，看板对照 dashboard / ecommerce-2。L4/C2 按所选角色适用，不因「不像 accounts」打红线。
- 2026-09-09：重写 **H1**、收紧 **H2/H5**、新增 **H6**：`PageHeader`（AppLayout 顶栏）≠ `PageTitleToolbar`（正文页头+面包屑）。由衍生仓详情误把 `PageHeader` 当业务页头、包白卡片反哺。core `0.1.9` 无 `variant`/`breadcrumbItems` 不算 B 违规。
- 2026-09-09：新增 **L7**：`DataTable` 列宽与剩宽分配。由衍生仓列表审计漏检（首列 `flex` 挤爆日期列）及错误修复（把 `flex` 挪到末列造成右侧空洞）反哺。L6 只管卡片密度，不覆盖本条。
