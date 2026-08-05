---
name: forge-starter-new-page
description: >
  Build a single admin page in Forge Starter by cloning a Forge official
  template layout (ecommerce / dashboard / CRM). Use for dashboards or
  non-CRUD screens, not full resource modules.
---

# Forge Starter New Page

One route, Forge template-first. For full CRUD domains use `forge-starter-new-module`.

**选型表（必读）**：仓库内 `docs/page-roles.md` — 先定页面角色再抄 template。  
不使用、不引用任何已废弃的设计插件。

## When to use

- 「做一个看板页」「照着 ecommerce-2」「单独一页」

## Inputs

- 路由：如 `/reports`
- 中文标题
- **页面角色**（dashboard / collection / detail / settings…）→ 查 `docs/page-roles.md`
- 对照模板：表中「首选」路径；旁路 monorepo `../forge/src/app/templates/...`
- 数据：mock / 接已有 store / 新 API（说明即可）

## Steps

1. 打开 `docs/page-roles.md`，锁定角色与首选 template。  
2. 在旁路 monorepo 读官方源码（若存在）。  
3. 在 `app/(app)/<route>/page.tsx` 实现；`"use client"` 若需交互。  
4. 组件仅 core；`siteConfig.accent`；solar icons。  
5. 注册 `config/menu.tsx` + `config/site.ts` routeShell（`hideHeader: true` 若页内自带 header）。  
6. 中文文案；去掉无行为控件。  
7. `pnpm typecheck`。

## Layout rules

- 页内自带 title + Breadcrumbs 时：`routeShells` 设 `hideHeader: true`。  
- Dashboard 类：grid + StatCard / Chart 家族，勿手搓图表 div。  
- 缺组件：`FORGE-GAP` 停下。

## Forbidden

- 复制官方模板里的紫色默认而不改 accent  
- 引入 recharts/echarts 若 core 已有等价图表  
- 一次做完整 CRUD（改走 new-module）  
