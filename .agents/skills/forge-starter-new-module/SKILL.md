---
name: forge-starter-new-module
description: >
  Add backend only for a Forge Starter resource: types, Drizzle schema/service,
  API routes, optional client store. Does NOT build list/detail UI — use
  forge-starter-new-page after. Use when the user needs data + API for a new
  admin domain (orders, tags, notifications, etc.).
---

# Forge Starter New Module（只后端）

**service + API**，不写页面。

地图：`docs/module-template.md` §A。  
UI 下一步：`forge-starter-new-page`。

## When to use

- 「加 xxx 的数据和接口」「后端模块」「表 + API」
- 人类说「加 xxx 管理」时的 **第一步**（第二步是 new-page）

## 禁止

- 创建/大改 `app/(app)/…/page.tsx` 或详情 UI（交给 new-page）  
- 规定详情必须全页或必须弹窗  
- 业务表并进 `users`  
- 假接口、假按钮  

## Inputs

- 资源英文名（复数路由优先）：`orders`  
- 字段与枚举  
- 需要的操作：list、get、create、update、delete、自定义 action  

## Steps

### 1. 命名与表

- 路由段、API：`/<res>/`  
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
- `jsonOk`、`jsonError`（`lib/auth/http.ts`）  
- Zod 校 body  

### 4. store 归属

**默认不在 new-module 建 store。**  
Client store（`components/<res>-store.tsx` + layout Provider）归 **new-page、UI 层**。  
本步只保证 REST API 可被 `fetch` 调用。

### 5. Verify

```bash
pnpm typecheck
pnpm db:push   # 业务表必须 Postgres；demo 登录模式不能代替 DATABASE_URL
```

- `AUTH_MODE=demo`：可不建 `users`，但 **CRUD API 仍要 DATABASE_URL**。  
- 可用 curl + 登录 cookie 打 API；**完整 UI 留给 new-page 浏览器测**。

## Report

告诉用户：

- 表名、API 路径与方法  
- **下一步**：`forge-starter-new-page`（含 store + 列表/表单/详情 UI）  
  - 重详情 → 对照 `accounts`  
  - 轻详情 → 对照 `approvals`  
