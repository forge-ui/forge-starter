---
name: forge-starter-new-module
description: >
  Add a new admin CRUD module to Forge Starter by cloning the accounts
  vertical slice (list + modal form + API + Drizzle). Chooses detail-modal
  vs full detail page by content weight. Use when the user wants a new
  resource manager (orders, products, approvals, etc.).
---

# Forge Starter New Module

**不要无脑复制 accounts 全套。** 先定信息架构，再抄文件。

权威文档：`docs/module-template.md`、`docs/page-roles.md`。  
不依赖任何外部设计插件。

## When to use

- 「加一个 xxx 管理」「新模块」「CRUD」「列表增删改」
- OA/审批/简单单据等「列表 + 表单」业务

## Step 0 — 决策（写代码前必做）

### A. 详情用弹窗还是全页？

| 选 **detail-modal**（默认） | 选 **detail-page**（少用） |
|----------------------------|---------------------------|
| 字段 ≤ ~12，一眼看完 | 多 Tab / 图表 / 时间线 / 关联列表 |
| 操作是通过/驳回/简单编辑 | 档案式长内容（如客户、账号） |
| 从列表进、看完就回 | 需要深链、分享独立 URL 且内容重 |

**默认 detail-modal。** 只有用户明确要档案页，或字段/区块明显重于 `accounts/[id]`，才用全页。

Starter 对照：

- 轻：`approvals`（列表 + 发起弹窗 + **详情弹窗**）
- 重：`accounts`（列表 + 表单弹窗 + **全页详情**）

### B. 筛选维度

- 列表筛选 **只能一行**：`ButtonGroup`（pill）+ 右侧搜索，布局抄 `accounts/page.tsx`。
- **禁止**上下叠两行 `ButtonGroup`（scope 一行 + status 一行 = 错）。
- 多个维度时：合并进 **一组** pills，或主维度用 pills、次维度进列 badge / 搜索，不要叠第二行。

## Inputs

从用户获取（缺则问）：

- 资源英文复数路由名：`orders`
- 中文名：`订单`
- 字段列表（name/type/required）
- 状态/类型枚举
- **详情形态**：modal（默认）| page（需理由）

## Source files

### 共用（两种详情都要）

```text
lib/accounts/types.ts               → lib/<res>/types.ts
lib/accounts/service.ts             → lib/<res>/service.ts
app/api/accounts/**                 → app/api/<res>/**
components/accounts-store.tsx       → components/<res>-store.tsx
components/account-form-dialog.tsx  → components/<res>-form-dialog.tsx
app/(app)/accounts/page.tsx         → app/(app)/<res>/page.tsx   # 只抄列表结构
```

### 详情形态二选一

**detail-modal（默认）** — 抄审批：

```text
components/approval-detail-dialog.tsx → components/<res>-detail-dialog.tsx
# 列表行点击 setDetailId；?id= 深链打开弹窗
# 可选：app/(app)/<res>/[id]/page.tsx 仅 redirect → /<res>/?id=
```

**detail-page** — 抄账号：

```text
app/(app)/accounts/[id]/page.tsx → app/(app)/<res>/[id]/page.tsx
# 顶栏主操作（编辑/删除）；侧栏只读摘要；禁止在侧栏塞「返回列表」
```

然后全局 rename + 改字段。`lib/db/schema.ts` 加表 → `pnpm db:push`。

## Required UX

### 列表（collection）

| 区块 | 要求 |
|------|------|
| Header | `h1` + `Breadcrumbs` + 主按钮「新建」 |
| 筛选 | **单行** `ButtonGroup` + `TextField` 搜索（对齐 accounts） |
| 表 | `DataTable` + 分页 + 空态 |
| 新建/编辑 | `components/ui/modal.tsx` 表单弹窗 |
| 删除 | `ConfirmationDialog`（若有） |

### 详情

| 形态 | 要求 |
|------|------|
| **modal** | 标题/字段/状态；底栏关闭 + 主操作；关弹窗 = 回列表 |
| **page** | 顶栏操作按钮（对齐 accounts）；侧栏 **只** 只读 meta；返回用页内 `←` 或面包屑（`hideHeader: true` 时壳 `onBack` **不会渲染**） |

### API

session 守卫 + zod + 中文错误（`jsonOk` / `jsonError`）。

## Menu / shell

1. `config/menu.tsx`：`BoldDuotone` icon size 20  
2. `config/site.ts`：列表路由 `hideHeader: true`  
3. 全页详情才配 `shellForPath` 详情 title + app-shell `onBack`；**且**须知 hideHeader 时壳头不出现，页内仍要返回入口  

## Forbidden（本次真实踩坑，禁止再犯）

1. **两行筛选**（双 ButtonGroup 纵向堆叠）  
2. **轻内容硬开全页详情**（字段少仍抄 `accounts/[id]`）  
3. **侧栏/摘要卡里塞「返回列表」**（导航不属于 meta 卡）  
4. 以为传了 `onBack` 就有返回键（`hideHeader: true` 时 AppLayout 不渲染 page header）  
5. 整页表单当默认新建入口（应用 modal）  
6. 假导出 / 假通知 / 第二 UI 库 / Tailwind 默认色  
7. 业务表和 `users` 揉成一张  
8. **只 curl API 就算验收** — 必须浏览器打开列表/弹窗看一眼  

## Validation

```bash
pnpm typecheck
pnpm db:push   # 若改了 schema
```

**浏览器**（必做，不能只 API）：

1. 列表：筛选只有 **一行**，搜索在同行右侧  
2. 新建 → 弹窗 → 提交 → 刷新仍在  
3. 点行 → 详情（modal 或 page）内容正确  
4. detail-modal：关闭即回列表，无「找不到返回」  
5. detail-page：顶栏有操作；侧栏无导航按钮；返回可见  

## After done

- 说明：路由、表名、**详情形态（modal | page）及理由**  
- 对照样板：轻 → approvals；重 → accounts  
