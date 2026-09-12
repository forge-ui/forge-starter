---
name: forge-starter-new-page
description: >
  Add admin UI only in Forge Starter: list, form modal, detail (modal or full
  page), menu entry. Chooses layout by cloning accounts (heavy) or
  /ref/detail-modal + Modal + ?id= (light). Requires API/store already
  present or created via new-module first.
  Use for dashboard pages or finishing a resource after new-module.
---

# Forge Starter New Page（只 UI）

**页面 + 导航**，不新建业务表/service（缺后端先跑 `new-module`）。

选型：`docs/page-roles.md`、`docs/module-template.md` §B。

## When to use

- 「加列表页」「做详情 UI」「看板页」  
- 「加 xxx 管理」的 **第二步**（数据已有或刚做完 new-module）  

## 禁止

- 在本 skill 里从零加 schema/service（应先 new-module）  
- 两行筛选 pills  
- 侧栏塞「返回列表」  
- 写死「默认全页详情」或「默认弹窗」  
- 第二 UI 库、Tailwind 默认色、假按钮  
- **`sortable: true` 却未实现排序**（DataTable 不会自动排序）  
- 只 curl 验收  

## Step 0 — 选组件（禁止跳过）

写代码前 **必须**：

1. 打开 **`docs/forge-components.md`**  
   - 按页面角色选组件包  
   - 记下要抄的 Starter 样板 + monorepo case 名  
2. 旁路有 monorepo 时：  
   - `../forge/.agents/skills/forge/SKILL.md`  
   - props 不确定 → 打开 `../forge/src/app/cases/<name>/page.tsx`（case 名见 forge-components 表）  
3. Modal 宿主：`components/ui/modal.tsx`  
4. 表里没有的组件 → `FORGE-GAP`，禁止 div 手搓  

交付报告里写一句：用了哪些 Kit 组件 + 对照了哪个 case/样板。  

## Step 1 — 定角色与样板

从用户描述确定。**先打开 `/ref/` 对照范式，再抄业务样板接真数据。**

| 角色 | 参考页（不进菜单） | 业务可运行样板 |
|------|-------------------|----------------|
| collection 表格 | `/ref/list-table` | accounts |
| collection 卡片 | `/ref/list-cards` | — |
| form-modal | `/ref/form-modal` | *-form-dialog |
| form-page 整页 | `/ref/form-page`（CRM leads/new） | 字段极多时 |
| detail-modal | `/ref/detail-modal` | **approvals**（轻样板）+ `Modal` + `?id=` |
| detail 业务对象 | `/ref/detail` | accounts/[id] |
| person CRM 人物 | `/ref/person`（john-bushmill） | — |
| profile 项目成员 | `/ref/profile`（members/[id]） | — |
| product 多 Tab | `/ref/product` | — |
| calendar | `/ref/calendar` | — |
| chat | `/ref/chat` | — |
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
字段少、看完回列表？ → approvals（轻样板）+ `/ref/detail-modal` + Modal + `?id=`
多区块、Tab、档案？ → accounts（全页）
拿不准？ → 问用户
```

交付说明里写 **选了哪种 + 一句话理由**。

## Step 2 — 实现

### 列表

- `app/(app)/<res>/page.tsx`  
- Header + **一条**筛选/搜索工具带 + DataTable + 空态。页头任选：Starter `h1`+`Breadcrumbs`+`Button`，或 Kit `PageTitleToolbar`（查 `/cases/toolbar`）。工具带任选：`ButtonGroup`+`TextField`，或 `Toolbar`+`ToolbarSearchInput`。禁止手搓页头/搜索。卡片列表的列用 `Grid`/`GridItem`（core `≥0.1.13`，查 `/cases/grid`），不要 Tailwind `grid-cols-*`。
- 新建按钮 → form dialog  
- 详情入口 → 名称/标题列的数据可点击，按已选详情形态打开全页或 `?id=` 弹窗；保留筛选上下文，支持键盘操作和可见焦点。对齐 accounts 的名称单元格，保持普通文字样式，不附加箭头。不要用带箭头的 `CellLink` 作为默认详情入口。
- 操作列只放编辑、删除等真实业务动作；不要另放箭头/眼睛“查看详情”按钮。无其他动作时不生成操作列。
- **菜单登记（缺一不可，只改 `menu.tsx` 不够）**  
  1. `config/apps.ts`：`APP_MODULE_IDS` + `APP_MODULE_META`（应用勾选白名单）  
  2. `config/menu.tsx`：`MODULE_MENU`（`BoldDuotone` `size={20}`）  
  3. `config/site.ts`：`routeShells` + `hideHeader: true`  
  4. `lib/rbac/constants.ts` + `lib/rbac/defaults.ts`：资源与种子 `:read`（侧栏按角色藏菜单）  
  5. `rbac_menus`：种子会补插缺失的内置 `code`；**自定义目录行不会进侧栏**  
  6. 应用登记在 `localStorage` 键 `forge-starter:app-registry`。当前产品 `accounts-admin` 会按 `[...APP_MODULE_IDS]` 刷新；同事看不见新侧栏 → 清该 key 或在应用管理勾齐。自己建的内部应用不会自动勾新模块。

### 表单弹窗

- `components/<res>-form-dialog.tsx`  
- 调 store/API；成功后关窗或打开详情（按选型）  

### 详情 · 弹窗

- 抄 **`approvals`**（业务轻样板）或 `/ref/detail-modal`，宿主用 `components/ui/modal.tsx`  
- 列表行点击打开；保留 `?id=`；`[id]/page` redirect → `?id=`  

### 详情 · 全页

- 抄 `app/(app)/accounts/[id]/page.tsx`  
- 顶栏主操作；侧栏只 meta；页内 `←` 或面包屑  
- 主次分栏用 `Grid`/`GridItem`（core `≥0.1.13`）。页级 8+4；主栏内辅栏+图用 `5+7` / `6+6`，不要再套页面 `4+8`。`gap` 是像素。  

### 数据层（UI 侧）

- **API 必须已存在**（new-module 产物）；没有 → 停，先 new-module。  
- **store 默认在本步创建：`components/<res>-store.tsx` + `app/(app)/layout.tsx` Provider（抄 accounts store）。  
- 也可页内直接 `fetch`，但列表+弹窗+详情共享状态时优先 store。  
- 业务持久化需要 `DATABASE_URL`；与 `AUTH_MODE=demo` 无关。  

### 删除确认

- 使用 `ConfirmationDialog` 时，外层必须包 `Modal` 或半透明遮罩宿主（抄 `accounts/page` 删除流程），不要只渲染裸 Dialog 卡。  

## Step 3 — Verify

```bash
pnpm check   # typecheck + 规范绊线
```

**浏览器**（必做）：

1. 菜单进入列表  
2. 筛选只有一行  
3. 新建 → 持久化（刷新还在）  
4. 打开详情（弹窗或全页），主操作可用  
5. 能回到列表（关弹窗、页内返回、面包屑）  

## Step 4 — Audit（必做，不可省略）

按 `.agents/skills/forge-starter-audit/SKILL.md` 对本次改动执行完整四步审计（对照 `docs/audit-checklist.md` 逐条核查 → 样板结构对照 → 截图 → 修复重验），修复全部红线后才算交付。

## Report

- 路由、菜单 label  
- 详情形态 + 理由  
- 对照样板：accounts（重）或 approvals（轻）  
- 是否已写入 `APP_MODULE_IDS` + `MODULE_MENU` + 种子/目录，以及如何处理 `forge-starter:app-registry`  
