---
name: forge-starter-new-page
description: >
  Add admin UI only in Forge Starter: list, form modal, detail (modal or full
  page), menu entry. Chooses layout by cloning accounts (heavy) or
  /ref/detail-modal + Modal + ?id= (light; no second business template).
  Requires API already present or created via new-module first; creates or
  reuses the UI store in this stage.
  Use for dashboard pages or finishing a resource after new-module.
---

# Forge Starter New Page（只 UI）

**页面 + 导航**，不新建业务表/service（缺后端先跑 `new-module`）。

选型：`docs/page-roles.md`、`docs/module-template.md` §B。

权限接线：默认模块仍需角色 `{module}:read` 与内部应用勾选。只有明确要求所有登录用户可见/可读才声明 `access: "authenticated"`，其读授权优先于角色与应用勾选，菜单、直链、API 和 Ask AI reader 统一生效；不扩匿名、行级数据或写权限。正式交付分别验无读角色、人工配置应用和写操作拒绝，不靠页面内临时拼菜单。

## When to use

- 「加列表页」「做详情 UI」「看板页」  
- 「加 xxx 管理」的 **第二步**（数据已有或刚做完 new-module）  

## 禁止

- 在本 skill 里从零加 schema/service（应先 new-module）  
- 只改 `config/menu.tsx` 就声称已挂侧栏（必须写manifest 派生菜单）  
- 两行筛选 pills  
- 侧栏塞「返回列表」  
- 写死「默认全页详情」或「默认弹窗」  
- 第二 UI 库、Tailwind 默认色、假按钮  
- 标题/正文写成 `text-fg-grey-500`（那是 disabled；主文字 `text-fg-black`，辅助 `text-fg-grey-700`）  
- 内容面贴死视口底、整页滚动才露出底边距（L10：壳列锁视口，面内滚）  
- **`sortable: true` 却未实现排序**（DataTable 不会自动排序）  
- 只 curl 验收  

## Step 0 — 选组件（禁止跳过）

写代码前 **必须**：

1. 先按 `docs/page-roles.md` 定角色与主 Screen，再打开 **`docs/forge-components.md`**  
   - 按主 Screen 选 Blocks，最后选 Components；通用规范读 `docs/forge-skill/upstream/SKILL.md`，线框读其 `references/page-design-dimensional.md` 与 `page-recommended-standard.md`  
   - 看板必须选一个官方 Screen 做主对照，记录实测栅格比例、区块尺寸和密度；尚未导出的 Blocks/Panel 标 `FORGE-GAP` 并询问，不虚构 import 或手搓替代  
   - 记下要抄的 Starter 样板 + monorepo case 名  
2. 旁路有 monorepo 时：  
   - `../forge/skills/forge-skill/SKILL.md`（实际 checkout 路径以当前环境为准）  
   - props 不确定 → 打开 `../forge/src/app/cases/<name>/page.tsx`（case 名见 forge-components 表）  
3. Modal 宿主：`components/ui/modal.tsx`  
4. 表里没有的组件 → `FORGE-GAP`，禁止 div 手搓  

交付报告里写一句：用了哪些 Kit 组件 + 对照了哪个 case/样板。  

## Step 1 — 定角色与样板

从用户描述确定。**先打开 `/ref/` 对照范式，再抄业务样板接真数据。** 下表只是 Starter 路由捷径；路由与角色目录以 `docs/reference-pages.md` 为准，通用选型以同步规范为准。

| 角色 | 参考页（不进菜单） | 业务可运行样板 |
|------|-------------------|----------------|
| collection 表格 | `/ref/list-table` | accounts |
| collection 卡片 | `/ref/list-cards` | — |
| form-modal | `/ref/form-modal` | *-form-dialog |
| form-page 整页 | `/ref/form-page`（CRM leads/new） | 字段极多时 |
| detail-modal | `/ref/detail-modal` | 暂无第二业务样板（`Modal` + `?id=`） |
| detail 业务对象 | `/ref/detail` | accounts/[id] |
| person CRM 人物 | `/ref/person`（john-bushmill） | — |
| profile 项目成员 | `/ref/profile`（members/[id]） | — |
| product 多 Tab | `/ref/product` | — |
| calendar | `/ref/calendar` | — |
| chat | `/ref/chat` | — |
| agent | `/ref/agent` | Ask AI 示范问答（按问题选用 Agent 组件，不整页丢英文 case） |
| checklist | `/ref/checklist` | `/ref/task` 清单（Kit `Checklist`，禁止手搓 Checkbox 行） |
| files | `/ref/files` | — |
| split 主从 | `/ref/split` | — |
| queue | `/ref/queue` | — |
| settings | `/ref/settings` | `settings/apps` + 头像菜单弹窗 |
| activity | `/ref/activity` | — |
| dashboard 通用/精简 | `/ref/dashboard-board` · `/ref/dashboard-kpi` | `/dashboard`（ecommerce-2 完整） |
| dashboard CRM | `/ref/dashboard-crm` | monorepo `dashboards/crm` |
| dashboard Analytics | `/ref/dashboard-analytics` | monorepo `dashboards/analytics` |
| dashboard Project | `/ref/dashboard-project` | monorepo `dashboards/project-1` |
| invoice 单据 | `/ref/invoice` | finance invoices/[id] |
| task 任务 | `/ref/task` | project tasks/[id] |
| resource-workspace | `/ref/resource-workspace` | `/models` 模型卡片台 |
| project 项目 | `/ref/project` | project projects/[id] |
| kanban 泳道 | `/ref/kanban` | 嵌在 project Task tab，独立抽出 |
| tickets 工单 | `/ref/tickets` | 工单线程语义 |
| api-keys | `/ref/api-keys` | Next settings/apikeys |
| credits 账本 | `/ref/credits` | Next settings/credits |
| billing 订阅 | `/ref/billing` | Next settings/billing |
| 空态 | `/ref/empty` | 各列表 empty |

目录：`docs/reference-pages.md`、`lib/reference/catalog.ts`。
详情：

```text
用户指定？ → 听用户
字段少、看完回列表？ → `/ref/detail-modal` + Modal + `?id=`（暂无第二业务样板）
多区块、Tab、档案？ → accounts（全页）
拿不准？ → 问用户
```

交付说明里写 **选了哪种 + 一句话理由**。

## Step 2 — 实现

### 列表

- `app/(app)/<res>/page.tsx`  
- Header + **一条**筛选/搜索工具带 + DataTable + 空态。业务页头统一用 Kit `PageTitleToolbar`（查 `/cases/toolbar`）；`breadcrumbs` 放 Kit `Breadcrumbs`，`actions` 放 `ToolbarActions` + 本仓 `AskAiEntry` + 主操作 `Button`，不另封装页标题组件。当前预设 API 无入口插槽，为保留全局助手实例采用仍受支持的组合接口。工具带任选：`ButtonGroup`+`TextField`，或 `Toolbar`+`ToolbarSearchInput`。禁止手搓页头/搜索。卡片列表的列用 `Grid`/`GridItem`（core `≥0.1.13`，查 `/cases/grid`），不要 Tailwind `grid-cols-*`。名称列用 `CellText`/`text-fg-black`，不要把主文字写成 `text-fg-grey-500`。Ask AI 用本仓槽位，不要传 `AppLayout.askAi`（`hideHeader` 下不渲染），不要浮钮或自研抽屉/全屏层（core `≥0.1.17` 已带）。
- 新建按钮 → form dialog  
- 详情入口 → 名称/标题列的数据可点击，按已选详情形态打开全页或 `?id=` 弹窗；保留筛选上下文，支持键盘操作和可见焦点。对齐 accounts 的名称单元格，保持普通文字样式，不附加箭头。不要用带箭头的 `CellLink` 作为默认详情入口。
- 操作列只放编辑、删除等真实业务动作；不要另放箭头/眼睛“查看详情”按钮。无其他动作时不生成操作列。
- **单一模块声明**：更新 config/modules/<id>.json 的菜单、知识和入口，运行 pnpm modules:generate。APP_MODULE_IDS / APP_MODULE_META / MODULE_MENU 自动派生；不手改三个导出。默认产品自动合并新模块，人工配置应用须显式勾选。rbac_menus 仍只是目录。
  启用写动作前，pageAdapter 必须实现页面接收、共享 Zod、页面保存/删除确认和事务回执；仅有文件不能代替验收。页面角色、动效和完整规范审计要求不变。
  无 `{module}:read` 进页时壳层 `replace` 回工作台（`AppShell` + `moduleIdForPath`），别只藏侧栏或停在空态/403 列表。

### 表单弹窗

- `components/<res>-form-dialog.tsx`  
- 调 store/API；成功后关窗或打开详情（按选型）  

### 详情 · 弹窗

- 抄 `/ref/detail-modal`，宿主用 `components/ui/modal.tsx`（暂无第二业务样板）  
- 列表行点击打开；保留 `?id=`；`[id]/page` redirect → `?id=`  

### 详情 · 全页

- 抄 `app/(app)/accounts/[id]/page.tsx`  
- 顶栏主操作；侧栏只 meta；页内 `←` 或面包屑  
- 主次分栏用 `Grid`/`GridItem`，比例、固定侧轨宽度和 gap 继承选定模板的实测值；8+4 只是可选比例，不是全局默认。`gap` 是像素。  

### 数据层（UI 侧）

- **API 必须已存在**（new-module 产物）；没有 → 停，先 new-module。  
- **store 默认在本步创建：`components/<res>-store.tsx` + `app/(app)/layout.tsx` Provider（抄 accounts store）。  
- 也可页内直接 `fetch`，但列表+弹窗+详情共享状态时优先 store。  
- 业务持久化需要 `DATABASE_URL`；与 `AUTH_MODE=demo` 无关。  

### 删除确认

- 独立确认直接用受控 `ConfirmationDialog` 的 `open` / `onOpenChange`，无需再套 Modal；省略 `open` 的内联卡模式才需要已有宿主。accounts 现有内联方式可保留，不做无关重构。  

## Step 3 — Verify

```bash
pnpm check   # typecheck + 规范绊线
```

**浏览器**（必做）：

1. 从侧栏点进列表（manifest 派生菜单已齐、默认应用勾齐；必要时清 `forge-starter:app-registry`）  
2. 筛选只有一行  
3. 新建 → 持久化（刷新还在）  
4. 打开详情（弹窗或全页），主操作可用  
5. 能回到列表（关弹窗、页内返回、面包屑）  

## Step 4 — Audit（必做，不可省略）

按 `.agents/skills/forge-starter-audit/SKILL.md` 对本次改动执行完整四步审计（对照 `docs/audit-checklist.md` 逐条核查 → 样板结构对照 → 截图 → 修复重验），修复全部红线后才算交付。

## Report

- 路由、菜单 label  
- 详情形态 + 理由  
- 对照样板：accounts（重）或 `/ref/detail-modal`（轻，暂无第二业务样板）  
- manifest 派生菜单：`APP_MODULE_IDS` + `APP_MODULE_META` + `MODULE_MENU`；默认应用是否勾齐新 id；是否已清 `forge-starter:app-registry`  
- 无权限直链是否 `replace` 回工作台（不要只藏侧栏）  

## 必做声明与按需写入适配

已登记语义契约的模块按 `docs/agent-semantic-foundation.md` 使用 `useSemanticPage` 暴露白名单状态并实现页面动作适配器。加载、未保存表单和过期记录必须明确处理；页面接收 ACK 不等于数据保存成功。仍执行完整页面审计。
