---
name: forge-starter-quick-start
description: >
  First-pass customize a Forge Starter admin project from a product brief
  (name, accent, menu labels, env). Emits a module backlog with page-role hints.
  Use when starting a new admin product or rebranding the scaffold.
---

# Forge Starter Quick Start

Bootstrap **branding + shell** only。不装支付/CMS/OAuth。

## When to use

- 「新开一个后台」「改成某某系统」「quick start」「初始化项目」

## Inputs

| 字段 | 默认 |
|------|------|
| 产品中文名 | `Forge Starter 基础后台` |
| 产品英文名 | `Forge Starter` |
| accent | `blue`（可选 purple、black） |
| 侧栏应用名 | 同中文名 |
| AUTH_MODE | `demo` 或 `local` |
| 首期模块（可选） | 名词列表，如：订单、客户 |

## Allowlist（第一遍只改这些）

1. `config/site.ts` — `name`、`teamName`、`accent`  
2. `config/apps.ts` — 默认应用 `name`、`subtitle`  
3. `config/menu.tsx` — 菜单 label（href 仅 brief 明确时改）  
4. `app/layout.tsx` — `metadata`  
5. `.env`、`.env.example` — `APP_URL`、`AUTH_MODE` 说明  
6. `README.md` — 顶部一句话（可选）  

**禁止**第一遍：业务 CRUD、新依赖、第二 UI 库。

## Steps

1. 复述 brief，列出将改文件。  
2. 应用 allowlist。  
3. `pnpm typecheck`。  
4. 提示：`pnpm dev --port 3020` 看品牌与菜单。  
5. 若 brief 含业务模块 → 输出 **模块 backlog**（见下），并说明执行顺序：  
   每个模块：`new-module` → `new-page`。  
6. 报告完成项 + backlog。

## 模块 backlog 格式（有业务 brief 时必出）

对每个模块名词填一行（可猜测，标「待确认」）：

```text
| 模块 | 建议路由 | 详情形态 | 理由 | 下一步 skill |
| 客户 | /customers | 全页 accounts | 档案+关联 | module → page |
| 订单 | /orders | 弹窗 approvals | 字段少 | module → page |
```

详情形态：`accounts`（重）| `approvals`（轻）| 待确认。  
组件选型提示用户/下一 agent 读：`docs/forge-components.md`。

## Checklist

- [ ] 侧栏/登录版权为新产品名  
- [ ] accent 一致  
- [ ] typecheck  
- [ ] 未引入无关模块  
- [ ] 有业务 brief 时已输出 backlog + module→page  
