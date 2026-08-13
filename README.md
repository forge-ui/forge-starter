# Forge Starter

**用 Forge UI 快速搭建管理后台** — 给人和 AI 编程助手一起用的脚手架。

技术栈：Next.js 16 + Tailwind v4 + `@forge-ui-official/core`。开箱即用的后台壳、登录与业务样板；配上 skills，按固定流程加模块，页面长得像 Forge 官方产品。

| | |
|--|--|
| 英文名 | Forge Starter |
| 中文名 | Forge 后台脚手架 |
| GitHub | https://github.com/forge-ui/forge-starter |

## 亮点

| 亮点 | 你得到什么 |
|------|------------|
| **官方级 Forge 体验** | 统一用 `@forge-ui-official/core`，颜色与布局跟官方后台一致 |
| **双详情样板** | `accounts` 全页档案 + `approvals` 弹窗处理，两种常见后台形态直接抄 |
| **AI 友好流水线** | skills 拆开「数据接口」和「页面菜单」，Agent 不容易一次抄乱 |
| **`/ref` 布局画廊** | 几十种真路由页面：列表、人物/产品多 Tab、表单、日历、对话、看板… 对着抄布局 |
| **从 0 能跑** | 登录注册、工作台、设置、应用切换；接上 Postgres 就能落库 CRUD |
| **文档即合约** | `AGENTS.md` + `docs/*` 写清怎么选组件、怎么选详情形态 |

## 快速开始

```bash
pnpm install
cp .env.example .env
# 本地业务 CRUD、AUTH_MODE=local 需要 Postgres：
# docker compose up -d
# AUTH_MODE=local
# AUTH_SECRET=<至少16位>
# DATABASE_URL=postgresql://forge:forge@127.0.0.1:5432/forge_starter
pnpm db:push
pnpm dev
```

打开 `http://localhost:3000`。默认 `AUTH_MODE=demo`，任意账号可登录，方便先看界面。

> 账号管理、审批等业务数据需要 Postgres：配置 `DATABASE_URL` 后执行 `pnpm db:push`。`demo` 模式只简化登录，业务表仍走数据库。

## 适合做什么

- 内部运营、管理后台、OA 类轻应用  
- 用 AI 助手从 0 搭第一版 B 端，并保持 Forge 视觉一致  
- 需要「列表 + 表单 + 详情」标准 CRUD，以及日历、看板、档案等多页范式  

Agent 合约：**`AGENTS.md`**。产品说明：**`PRODUCT.md`**。

## Agent 工作流

```text
1. 读 AGENTS.md + docs/forge-components.md
2. 品牌、环境        → forge-starter-quick-start
3. 每个业务对象：
     a. forge-starter-new-module  → schema + service + API
     b. forge-starter-new-page    → 列表、表单、详情 + 菜单
4. 纯看板、非 CRUD 单页 → 只跑 new-page
5. pnpm typecheck · 浏览器点主路径验收
```

**详情怎么选：**

- 内容多、有 Tab、档案 → 抄 **`accounts`**（全页详情）  
- 字段少、处理完回列表 → 抄 **`approvals`**（详情弹窗）  
- 不确定 → 问产品、用户  

**选组件：** 可运行样板 → `/ref/*` → forge monorepo cases（有旁路时）

## 可运行样板

| 路径 | 形态 |
|------|------|
| `/accounts` · `/accounts/[id]` | 列表 + 弹窗表单 + **全页详情** |
| `/approvals` | 列表 + 新建弹窗 + **详情弹窗** |
| `/dashboard` | 工作台 |
| `/settings/*` | 个人资料、改密、应用、通知偏好 |
| **`/ref/`** | **布局参考画廊**（真路由，开发默认开、默认不进侧栏） |

生产环境访问 `/ref` 需设 `SHOW_REF_PAGES=true`。完整目录：`docs/reference-pages.md`。

画廊覆盖：表格、卡片列表、CRM 人物与产品多 Tab、整页表单、日历、对话、文件、Kanban、多种 Dashboard、发票、工单、API Key、积分账本、订阅等，方便对照真实业务页来搭。

## 技术栈

- **框架：** Next.js 16、React 19、TypeScript  
- **UI：** `@forge-ui-official/core` + Tailwind CSS v4 + solar-icon-set  
- **认证：** 用户名/邮箱 + 密码 · jose session · demo \| local  
- **数据库：** PostgreSQL · Drizzle ORM  
- **邮件：** SMTP（nodemailer）

## 目录结构

```text
app/
  (auth)/          # 登录 · 注册 · 找回、重置密码
  (app)/           # 工作台 · 账号 · 审批 · 设置 · ref/*
  api/             # auth · accounts · approvals
components/        # app-shell · *-store · *-dialog · ui/modal
config/            # site · menu · apps
lib/               # auth · db · accounts · approvals · reference
docs/              # 工作流 · 组件选型 · 页面角色 · 参考页目录
.agents/skills/    # quick-start · new-module · new-page
.claude/skills → .agents/skills
AGENTS.md PRODUCT.md CLAUDE.md
```

## Skills

| Skill | 做什么 |
|-------|--------|
| `forge-starter-quick-start` | 品牌、accent、菜单文案、env、模块 backlog |
| `forge-starter-new-module` | 后端：schema + service + API |
| `forge-starter-new-page` | 前端：列表、表单、详情 + 菜单（依赖已有 API） |

Skills 只维护在 **`.agents/skills/`**。

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
| `PRODUCT.md` | 产品说明与规划 |
| `CLAUDE.md` | Claude Code 短入口 |
| `docs/agent-native.md` | 工作流与 skill 边界 |
| `docs/forge-components.md` | 角色 → 组件 → 样板 |
| `docs/page-roles.md` | 页面角色与详情选型 |
| `docs/module-template.md` | 模块 + 页面双样板 |
| `docs/reference-pages.md` | `/ref/*` 目录 |

## 质量约定

- UI 统一走 Forge Kit；缺组件记 `FORGE-GAP` 再决策  
- 颜色用 `fg-*`；业务控件 `color={siteConfig.accent}`  
- 列表筛选保持一行 pills + 搜索  
- 交付：`pnpm typecheck` + 浏览器走通主路径  

## 相关项目

- [Forge UI](https://github.com/forge-ui/forge) — 组件库与文档
- [Forge Design](https://github.com/forge-ui/forge-design-extension) — 在真实页面上点选或放置组件，用本地 Grok 改 UI

---

**Forge Starter** — 用 Forge 搭真实管理后台，人和 AI 助手都能上手。
