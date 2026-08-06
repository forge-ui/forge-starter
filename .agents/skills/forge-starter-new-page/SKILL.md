---
name: forge-starter-new-page
description: >
  Add admin UI only in Forge Starter: list, form modal, detail (modal or full
  page), menu entry. Chooses layout by cloning accounts (heavy) or approvals
  (light). Requires API/store already present or created via new-module first.
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
- 第二 UI 库 / Tailwind 默认色 / 假按钮  
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
| collection 表格 | `/ref/list-table` | accounts / approvals |
| collection 卡片 | `/ref/list-cards` | — |
| form-modal | `/ref/form-modal` | *-form-dialog |
| form-page 整页 | `/ref/form-page`（CRM leads/new） | 字段极多时 |
| detail-modal | `/ref/detail-modal` | approval-detail-dialog |
| detail 业务对象 | `/ref/detail` | accounts/[id] |
| person CRM 人物 | `/ref/person`（john-bushmill） | — |
| profile 项目成员 | `/ref/profile`（members/[id]） | — |
| product 多 Tab | `/ref/product` | — |
| calendar | `/ref/calendar` | — |
| chat | `/ref/chat` | — |
| files | `/ref/files` | — |
| split 主从 | `/ref/split` | — |
| queue | `/ref/queue` | approvals 待办 |
| settings | `/ref/settings` | settings/* |
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
字段少、看完回列表？ → approvals（弹窗）
多区块 / Tab / 档案？ → accounts（全页）
拿不准？ → 问用户
```

交付说明里写 **选了哪种 + 一句话理由**。

## Step 2 — 实现

### 列表

- `app/(app)/<res>/page.tsx`  
- Header + **单行** ButtonGroup + 搜索 + DataTable + 空态  
- 新建按钮 → form dialog  
- `config/menu.tsx` + `config/site.ts`（`hideHeader: true`）  

### 表单弹窗

- `components/<res>-form-dialog.tsx`  
- 调 store/API；成功后关窗或打开详情（按选型）  

### 详情 · 弹窗

- 抄 `components/approval-detail-dialog.tsx`  
- 列表行点击打开；可选 `?id=`；`[id]/page` 可 redirect  

### 详情 · 全页

- 抄 `app/(app)/accounts/[id]/page.tsx`  
- 顶栏主操作；侧栏只 meta；页内 `←` 或面包屑  

### 数据层（UI 侧）

- **API 必须已存在**（new-module 产物）；没有 → 停，先 new-module。  
- **store 默认在本步创建：`components/<res>-store.tsx` + `app/(app)/layout.tsx` Provider（抄 accounts/approvals store）。  
- 也可页内直接 `fetch`，但列表+弹窗+详情共享状态时优先 store。  
- 业务持久化需要 `DATABASE_URL`；与 `AUTH_MODE=demo` 无关。  

### 删除确认

- 使用 `ConfirmationDialog` 时，外层必须包 `Modal` 或半透明遮罩宿主（抄 `accounts/page` 删除流程），不要只渲染裸 Dialog 卡。  

## Step 3 — Verify

```bash
pnpm typecheck
```

**浏览器**（必做）：

1. 菜单进入列表  
2. 筛选只有一行  
3. 新建 → 持久化（刷新还在）  
4. 打开详情（弹窗或全页），主操作可用  
5. 能回到列表（关弹窗 / 页内返回 / 面包屑）  

## Report

- 路由、菜单 label  
- 详情形态 + 理由  
- 对照样板：accounts 或 approvals  
