# Forge Starter

**Agent-native Forge 后台脚手架** — Next.js 16 + Tailwind v4 + `@forge-ui-official/core`。

面向 Coding Agent 与人类：从 0 搭 **管理后台 / 内部系统**。  
学 [ShipAny Next](https://docs.shipany.ai/zh/shipany-next) 的 **skill 拆分**，不对标支付/积分/CMS。

| | |
|--|--|
| 英文 | Forge Starter |
| 中文 | Forge 后台脚手架 |
| GitHub | https://github.com/forge-ui/forge-starter |

## Agent 怎么用（一眼）

1. 读 `AGENTS.md`  
2. 跑 skills（**加业务 = 先 module 再 page**）：

| Skill | 只做什么 |
|-------|----------|
| `forge-starter-quick-start` | 品牌 / accent / 菜单文案 / env + 模块 backlog |
| `forge-starter-new-module` | **后端**：schema + service + API |
| `forge-starter-new-page` | **UI**：列表 / 表单 / 详情 + 菜单 |

3. 选组件：`docs/forge-components.md`（角色 → Kit 组件 → 样板 → monorepo case）  
4. 详情形态 **无默认**：  
   - **重** → 抄 `accounts`（全页详情）  
   - **轻** → 抄 `approvals`（详情弹窗）  

Skills：`.agents/skills/`（与 `.claude/skills/` 同步）。

## 样板页（给 AI 抄的）

| 路径 | 形态 |
|------|------|
| `/accounts` + `/accounts/[id]` | 列表 + 弹窗表单 + **全页详情** |
| `/approvals` | 列表 + 弹窗发起 + **详情弹窗** |
| `/dashboard` | 工作台 |
| `/settings/*` | 设置 |

更多文档：`docs/agent-native.md` · `docs/module-template.md` · `docs/page-roles.md` · **`docs/forge-components.md`**

## 能力摘要

| 模块 | 说明 |
|------|------|
| 认证 | 用户名/邮箱 + 密码；demo \| local |
| 数据库 | PostgreSQL；**CRUD 必须 `DATABASE_URL`**（demo 只省登录用户表） |
| 邮件 | SMTP |
| 应用壳 | AppLayout + 应用切换 |
| Agent | skills + 双样板 + 组件选型表 |

## 快速开始

```bash
pnpm install
cp .env.example .env
# local 需要 Postgres：
# docker compose up -d
# AUTH_MODE=local
# AUTH_SECRET=至少16位
# DATABASE_URL=postgresql://forge:forge@127.0.0.1:5432/forge_starter
pnpm db:push
pnpm dev --port 3020
```

## 目录

```text
app/(auth)/ (app)/ api/
components/   app-shell, *-dialog, *-store, ui/modal
config/       site, menu, apps
lib/          auth, db, accounts, approvals, …
docs/         agent-native, module-template, page-roles, forge-components
.agents/skills/
AGENTS.md PRODUCT.md
```

## 常用命令

```bash
pnpm dev --port 3020
pnpm typecheck
pnpm db:push
```

## 边界

- 只 Forge Kit；缺组件 `FORGE-GAP`  
- 不做支付/IM/中台代码生成  
- UI 改完要浏览器点主路径，禁止只 curl  
