---
name: forge-starter-new-module
description: >
  Add backend only for a Forge Starter resource: types, Drizzle schema/service,
  API routes. Client stores belong to new-page by default; exceptions require
  explicit authorization. Does NOT build list/detail UI — use
  forge-starter-new-page after. Use when the user needs data + API for a new
  admin domain (orders, tags, notifications, etc.).
---

# Forge Starter New Module（只后端）

**service + API**，不写页面。

地图：`docs/module-template.md` §A。  
通用规范入口：`docs/forge-skill/upstream/SKILL.md`；本 skill 只维护 Starter 后端装配。  
**API 齐 ≠ 侧栏有。** 本步不挂应用模块。  
UI 下一步：`forge-starter-new-page`（manifest 派生菜单）。

访问策略默认不声明 `access`，保留角色读授权与内部应用勾选交集。只有明确要求所有登录用户可见/可读才加 `access: "authenticated"`：它优先于角色读授权与内部应用勾选，API / Ask AI reader 同步获得 read，但匿名、行级隔离、脱敏与写权限不变。详见 `docs/module-template.md`；不得用它绕过普通模块配置遗漏。

## When to use

- 「加 xxx 的数据和接口」「后端模块」「表 + API」
- 「这是我们的 OpenAPI / Swagger，生成后台模块」
- 人类说「加 xxx 管理」时的 **第一步**（第二步是 new-page）

## 已有后端（OpenAPI）

用户给了 OpenAPI 文件或地址、后端已经存在时，不建表：先 `pnpm module:openapi <文件|URL>` 把模块清单（字段、页面角色、分页、写操作、跳过原因）给用户确认，再 `--yes [--only id,id]` 生成只读模块，并提醒在 `.env` 设 `EXTERNAL_API_BASE_URL` / `EXTERNAL_API_TOKEN`。生成的页面只是骨架，按清单里的页面角色交给 new-page。写操作不要自己补 API，按 `docs/module-template.md` 的写入要求和页面一起做。

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
- 加到 `lib/db/schema.ts`。开发库可 `pnpm db:push`；要提交的结构用 `pnpm db:generate`，其他环境用 `pnpm db:migrate`

### 2. types + service

```text
lib/<res>/types.ts
lib/<res>/service.ts
```

参考：`lib/accounts/service.ts`（业务规则，不抄 UI）。

- 校验与中文 `throw new Error("…")`  
- 列表/详情/写操作按需  

### 3. API

```text
app/api/<res>/route.ts          # GET list, POST create
app/api/<res>/[id]/route.ts     # GET one, PATCH/DELETE/POST actions
```

- `requireSession()`，未登录 401  
- 资源 API 独立执行 `requirePermission("<res>", "read"|"create"|"update"|"delete")`（`lib/rbac/access.ts`），先 session 再角色权限；403 无权限。菜单是否可见不改变认证、对象访问与动作权限要求。  
- `jsonOk`、`jsonError`（`lib/auth/http.ts`）  
- Zod 校 body  

模块权限、知识与菜单统一由 manifest 派生；先完成服务，再由 new-page 验收页面和入口。不要手改派生常量。

### 4. store 归属

**默认不在 new-module 建 store。**  
Client store（`components/<res>-store.tsx` + layout Provider）归 **new-page、UI 层**。  
本步只保证 REST API 可被 `fetch` 调用。

### 5. Ask AI 声明（必做）

创建 config/modules/<id>.json：知识 summary/fields/rules/source、权限资源、菜单入口与读取服务/导出名/字段白名单；不可读必须说明原因。运行 pnpm modules:generate，不再手写 SYSTEM_FEATURES 或拼接 lib/agent/registry.ts。专用工具通过 manifest.tools 挂接。读取复用当前会话并递归剔除敏感字段。

写草稿共用 API Zod，在 manifest 声明字段、动作与 pageAdapter；页面接收并保存，保留 If-Match、事务、回执和读回，工具不直接写库。页面适配未完成不得启用写动作。

pnpm module:new <id> [中文名称] 生成已注册的 service/API/页面开发骨架；数据服务在实现前明确报错，不是完整 CRUD。后端和 UI 仍分步完成。

### 6. Verify

```bash
corepack pnpm check
```

- 数据库迁移前声明目标环境并确认授权，再运行 `corepack pnpm db:migrate`；开发库迭代才用 `db:push`。未获授权或数据库不可用时不执行迁移，报告未验证项与原因。
- `AUTH_MODE=demo`：可不建 `users`，但 **CRUD API 仍要 DATABASE_URL**。  
- 可用 curl + 登录 cookie 打 API；**完整 UI 留给 new-page 浏览器测**。

## Report

告诉用户：

- 表名、API 路径与方法  
- Ask AI 自动登记的工具：工具 id，以及哪些是写入（需确认）  
- **声明齐 ≠ UI 完成。** 页面与真实持久化仍需独立验收。  
- **下一步**：`forge-starter-new-page`（store + 列表/表单/详情 UI，并挂应用模块）  
  - manifest 派生菜单：`APP_MODULE_IDS` + `APP_MODULE_META` + `MODULE_MENU`；默认应用种子勾齐新 id  
  - 重详情 → 对照 `accounts`  
  - 轻详情 → 对照 `/ref/detail-modal` + `components/ui/modal.tsx`（暂无第二业务样板）  

## 必做声明与按需写入适配

所有模块必须登记知识和读取；启用写动作时，按 `docs/agent-semantic-foundation.md` 登记业务契约，工具 JSON Schema 从共享 Zod 派生；写入回执必须与业务事务原子提交。后端完成不代表页面适配已完成。
