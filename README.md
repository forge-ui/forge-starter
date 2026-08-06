# Forge Starter

**用 Forge UI 快速搭建管理后台** — 给人和 AI 编程助手一起用的脚手架。

技术栈：Next.js 16 + Tailwind v4 + `@forge-ui-official/core`。你可以自己写，也可以让 AI 助手按仓库里的真实样板页和 skills 加业务模块。方法借鉴 [ShipAny Next](https://docs.shipany.ai/zh/shipany-next) 的协作方式，**不是** 它那套支付 / 积分 / CMS / 落地页 SaaS 全家桶。

| | |
|--|--|
| 英文名 | Forge Starter |
| 中文名 | Forge 后台脚手架 |
| GitHub | https://github.com/forge-ui/forge-starter |

## 快速开始

```bash
pnpm install
cp .env.example .env
# 本地业务 CRUD / AUTH_MODE=local 需要 Postgres：
# docker compose up -d
# AUTH_MODE=local
# AUTH_SECRET=<至少16位>
# DATABASE_URL=postgresql://forge:forge@127.0.0.1:5432/forge_starter
pnpm db:push
pnpm dev
```

打开 `http://localhost:3000`。默认 `AUTH_MODE=demo`，任意账号可登录（**demo 不会持久化业务数据**）。

> **做 CRUD 一定要配 Postgres。** `AUTH_MODE=demo` 只跳过登录用户表。账号、审批、新业务模块都需要 `DATABASE_URL` + `pnpm db:push`。

## 这是什么 / 不是什么

| 是 | 不是 |
|----|------|
| 只用 Forge 的后台壳 + 双 UI 样板 | ShipAny 全量 SaaS（计费、积分、CMS…） |
| skill 流水线：先 module 再 page | 一句话生成完整产品 |
| `/ref/*` 给 AI 抄的布局画廊 | 侧栏里的产品功能 |
| Postgres + SMTP + 账密登录 | 多数据库 / OAuth / 云邮件 SDK |

Agent 合约：**`AGENTS.md`**。产品边界：**`PRODUCT.md`**。

## Agent 工作流

```text
1. 读 AGENTS.md + docs/forge-components.md
2. 品牌 / 环境        → forge-starter-quick-start
3. 每个业务对象：
     a. forge-starter-new-module  → schema + service + API
     b. forge-starter-new-page    → 列表 / 表单 / 详情 + 菜单
4. 纯看板 / 非 CRUD 单页 → 只跑 new-page
5. pnpm typecheck · 浏览器点主路径（禁止只 curl）
```

**详情形态没有全局默认：**

- **重**（多 Tab、档案、多区块）→ 抄 **`accounts`**（全页详情）
- **轻**（字段少、看完回列表）→ 抄 **`approvals`**（详情弹窗）
- 拿不准 → 问用户

**选组件优先级：** 可运行样板 → `/ref/*` → forge monorepo cases（有旁路时）

## 可运行样板

| 路径 | 形态 |
|------|------|
| `/accounts` · `/accounts/[id]` | 列表 + 弹窗表单 + **全页详情** |
| `/approvals` | 列表 + 新建弹窗 + **详情弹窗** |
| `/dashboard` | 工作台 |
| `/settings/*` | 个人资料、改密、应用、通知偏好 |
| **`/ref/`** | **AI 参考画廊**（真路由，**不进**产品菜单） |

开发环境默认开放 `/ref`；生产默认 404，需要时设 `SHOW_REF_PAGES=true`。目录见 `docs/reference-pages.md`。

画廊含列表表格/卡片、CRM 人物与产品多 Tab、整页表单、日历、对话、文件、Kanban、多种 Dashboard、发票、工单、API Key、积分账本、订阅等——**给 AI 抄布局的 mock UI**，不是要交付的 SaaS 模块。

## 技术栈

- **框架：** Next.js 16、React 19、TypeScript  
- **UI：** `@forge-ui-official/core` + Tailwind CSS v4 + solar-icon-set  
- **认证：** 用户名/邮箱 + 密码 · jose session · demo \| local  
- **数据库：** 仅 PostgreSQL · Drizzle ORM  
- **邮件：** 仅 SMTP（nodemailer）

## 目录结构

```text
app/
  (auth)/          # 登录 · 注册 · 找回/重置密码
  (app)/           # 工作台 · 账号 · 审批 · 设置 · ref/*
  api/             # auth · accounts · approvals
components/        # app-shell · *-store · *-dialog · ui/modal
config/            # site · menu · apps
lib/               # auth · db · accounts · approvals · reference
docs/              # agent-native · page-roles · forge-components · …
.agents/skills/    # 唯一维护的 skills（quick-start · new-module · new-page）
.claude/skills → .agents/skills   # symlink，给 Claude Code 发现用
AGENTS.md PRODUCT.md CLAUDE.md
```

## Skills

| Skill | 边界 |
|-------|------|
| `forge-starter-quick-start` | 品牌、accent、菜单文案、env、模块 backlog |
| `forge-starter-new-module` | **只后端：** schema + service + API |
| `forge-starter-new-page` | **只 UI：** 列表 / 表单 / 详情 + 菜单（API 须先有） |

只改 **`.agents/skills/`**，不要再复制一份到别处。

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm typecheck` | TypeScript 检查 |
| `pnpm db:push` | 同步 schema（开发） |
| `pnpm db:generate` | 生成 migration |
| `pnpm db:studio` | Drizzle Studio |

## 环境变量

```env
AUTH_MODE=demo
AUTH_SECRET=change-me-to-a-long-random-string
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://forge:forge@127.0.0.1:5432/forge_starter
# AUTH_GUARD=true
# SHOW_REF_PAGES=true
# SMTP_*  （可选）
```

完整模板见 `.env.example`。本地库：`docker compose up -d`。

## 文档索引

| 文档 | 用途 |
|------|------|
| `AGENTS.md` | Agent 合约（必读） |
| `PRODUCT.md` | 产品意图与非目标 |
| `CLAUDE.md` | Claude Code 短入口 |
| `docs/agent-native.md` | 工作流与 skill 边界 |
| `docs/forge-components.md` | 角色 → 组件 → 样板 |
| `docs/page-roles.md` | 页面角色与详情选型 |
| `docs/module-template.md` | 模块 + 页面双样板 |
| `docs/reference-pages.md` | `/ref/*` 目录 |

## 边界

- **只用 Forge** — 不引入第二套 UI 库；缺能力写 `FORGE-GAP`
- 颜色用 `fg-*`；业务控件 `color={siteConfig.accent}`
- 列表筛选：**一行** pills + 搜索
- 交付门禁：`pnpm typecheck` + **浏览器**点主路径

---

**Forge Starter** — 用 Forge 搭真实管理后台，人和 AI 助手都能上手。
