---
name: forge-starter-quick-start
description: >
  First-pass customize a Forge Starter admin project from a product brief
  (name, accent, menu labels, env). Use when starting a new admin product
  or rebranding the scaffold. Agent-native bootstrap, not full SaaS setup.
---

# Forge Starter Quick Start

Bootstrap **branding + shell** only. Do **not** add payment/CMS/OAuth unless the user asks.

## When to use

- 「新开一个后台」「改成某某系统」「quick start」「初始化项目」

## Inputs（从用户话里整理）

| 字段 | 默认 |
|------|------|
| 产品中文名 | `Forge Starter 基础后台` |
| 产品英文名 | `Forge Starter` |
| accent | `blue`（可选 purple / black） |
| 侧栏应用名 | 同中文名 |
| AUTH_MODE | `demo` 或 `local` |

## Allowlist（第一遍只改这些）

1. `config/site.ts` — `name` / `teamName` / `accent`
2. `config/apps.ts` — `DEFAULT_APP_ENTRIES[0].name` / `subtitle`
3. `config/menu.tsx` — 菜单 label（href 先不动，除非 brief 明确）
4. `app/layout.tsx` — `metadata.title` / `description`
5. `.env` / `.env.example` — `APP_URL`、`AUTH_MODE` 说明（无密钥硬编码）
6. `README.md` — 顶部一句话定位（可选，简短）

**禁止**第一遍改：业务 CRUD 逻辑、任意新依赖、第二套 UI 库。

## Steps

1. 复述 brief，列出将改的文件。
2. 应用 allowlist 修改。
3. `pnpm typecheck`。
4. 提示用户：`pnpm dev --port 3020`，用 demo 登录看侧栏标题与菜单。
5. 若 brief 含新业务模块 → 引导下一步 skill：`forge-starter-new-module`。

## Checklist

- [ ] 侧栏 / 登录版权显示新产品名  
- [ ] accent 全站一致  
- [ ] typecheck 绿  
- [ ] 未引入无关模块  
