---
name: forge-starter-new-module
description: >
  Add a new admin CRUD module to Forge Starter by cloning the accounts
  vertical slice (list + modal form + detail + API + Drizzle). Use when
  the user wants a new resource manager (orders, products, customers, etc.).
---

# Forge Starter New Module

Clone the **accounts** paradigm. Full map: `docs/module-template.md`.  
角色固定为 **collection + form-modal + detail**（见 `docs/page-roles.md`）。  
不依赖任何外部设计插件。

## When to use

- 「加一个 xxx 管理」「新模块」「CRUD」「列表增删改」

## Inputs

从用户获取（缺则问）：

- 资源英文复数路由名：`orders`
- 中文名：`订单`
- 字段列表（name/type/required）
- 状态枚举（若有）
- 是否需要详情页（默认要）

## Source files to copy

```text
lib/accounts/types.ts          → lib/<res>/types.ts
lib/accounts/service.ts        → lib/<res>/service.ts
app/api/accounts/**            → app/api/<res>/**
components/accounts-store.tsx  → components/<res>-store.tsx
components/account-form-dialog.tsx → components/<res>-form-dialog.tsx
app/(app)/accounts/**          → app/(app)/<res>/**
```

Then global rename + field rewrite. Add table to `lib/db/schema.ts` → `pnpm db:push`.

## Required UX

| 页面 | 要求 |
|------|------|
| List | Header + 新建按钮 + 筛选/搜索 + DataTable + 空态 |
| Create/Edit | Modal dialog（`components/ui/modal.tsx`） |
| Detail | 只读 + 编辑/删除（可选但推荐） |
| API | session 守卫 + zod + 中文错误 |

## Menu

Register in `config/menu.tsx` with `BoldDuotone` icon size 20.

## Forbidden

- 整页表单当默认（除非用户坚持）
- 假导出/假通知按钮
- Tailwind 默认色 / 第二 UI 库
- 把业务表和 `users` 揉成一张

## Validation

```bash
pnpm typecheck
```

手动：列表空 → 新建 → 刷新仍在 → 编辑 → 删除。

## After done

- 简述新增路由与表名  
- 若官方 template 可对照，写明（如 customers / products）  
