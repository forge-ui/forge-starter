---
name: forge-starter-new-module
description: >
  Add backend only for a Forge Starter resource: types, Drizzle schema/service,
  API routes, optional client store. Does NOT build list/detail UI — use
  forge-starter-new-page after. Use when the user needs data + API for a new
  admin domain (orders, tags, notifications, etc.).
---

# Forge Starter New Module（只后端）

对齐 ShipAny Next 的 `/new-module`：**service + API**，不写页面。

地图：`docs/module-template.md` §A。  
UI 下一步：`forge-starter-new-page`。

## When to use

- 「加 xxx 的数据和接口」「后端模块」「表 + API」
- 人类说「加 xxx 管理」时的 **第一步**（第二步是 new-page）

## 禁止

- 创建/大改 `app/(app)/…/page.tsx` 或详情 UI（交给 new-page）  
- 规定详情必须全页或必须弹窗  
- 业务表并进 `users`  
- 假接口 / 假按钮  

## Inputs

- 资源英文名（复数路由优先）：`orders`  
- 字段与枚举  
- 需要的操作：list / get / create / update / delete / 自定义 action  

## Steps

### 1. 命名与表

- 路由段 / API：`/<res>/`  
- 表名：清晰英文（如 `orders`）  
- 加到 `lib/db/schema.ts` → `pnpm db:push`  

### 2. types + service

```text
lib/<res>/types.ts
lib/<res>/service.ts
```

参考：`lib/accounts/service.ts` 或 `lib/approvals/service.ts`（业务规则，不抄 UI）。

- 校验与中文 `throw new Error("…")`  
- 列表/详情/写操作按需  

### 3. API

```text
app/api/<res>/route.ts          # GET list, POST create
app/api/<res>/[id]/route.ts     # GET one, PATCH/DELETE/POST actions
```

- `getSessionUser()`，未登录 401  
- `jsonOk` / `jsonError`（`lib/auth/http.ts`）  
- Zod 校 body  

### 4. 可选 store

若后续列表为 client fetch：

```text
components/<res>-store.tsx
```

可先不建，等 new-page 需要再加。若建了，在 `app/(app)/layout.tsx` 挂 Provider（与 accounts/approvals 一致）。

### 5. Verify

```bash
pnpm typecheck
```

有表变更：`pnpm db:push`。  
可用 curl + 登录 cookie 打 API（后端步允许）；**完整 UI 留给 new-page 浏览器测**。

## Report

告诉用户：

- 表名、API 路径与方法  
- store 是否已加  
- **下一步**：`forge-starter-new-page` — 列表/表单/详情 UI；详情对照  
  - 重 → `accounts`  
  - 轻 → `approvals`  
