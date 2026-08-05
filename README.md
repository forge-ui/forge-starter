# Forge Starter

**Agent-native Forge 后台脚手架** — Next.js 16 + Tailwind v4 + `@forge-ui-official/core`。

面向 Coding Agent 与人类：从 0 快速做 **管理后台 / 内部系统**，UI 铁律为 Forge Kit。  
参照 [ShipAny Next](https://docs.shipany.ai/zh/shipany-next) 的 **Agent skills 工作方式**；**不对标** 其支付/积分/CMS 全家桶。

| | |
|--|--|
| 英文 | Forge Starter |
| 中文 | Forge 后台脚手架 |
| 宿主应用名 | Forge Starter 基础后台 |

## Agent 怎么用

1. 读 `AGENTS.md` + `PRODUCT.md`
2. 按 brief 跑 skills：

| Skill | 作用 |
|-------|------|
| `forge-starter-quick-start` | 改名 / accent / 菜单 / env |
| `forge-starter-new-module` | 只后端：schema + service + API |
| `forge-starter-new-page` | 只 UI：列表/详情（accounts 重 / approvals 轻） |

Skills 目录：`.agents/skills/`（Claude Code：`.claude/skills/`）

详见 `docs/agent-native.md`、`docs/module-template.md`、`docs/page-roles.md`（页面角色对照表，不依赖废弃设计插件）。

## 当前能力（0.5）

| 模块 | 说明 |
|------|------|
| **认证** | 用户名或邮箱 + 密码；注册 / 登录 / 退出 / 找回与重置 |
| **数据库** | PostgreSQL（Drizzle）：`users` 登录；`admin_accounts` 业务样板 |
| **邮件** | 仅自定义 SMTP |
| **模式** | `AUTH_MODE=demo` \| `local` |
| **应用壳** | AppLayout；应用切换器；隐藏未实现的通知/消息 |
| **CRUD 样板** | accounts（全页详情）+ approvals（详情弹窗）；无单一默认 |
| **应用管理** | `/settings/apps` 列表 CRUD；内部应用多选菜单 |
| **Agent** | skills + 文档合约 |

## 快速开始

```bash
pnpm install
cp .env.example .env
# demo 可直接开发；local 需 Postgres：
docker compose up -d
# AUTH_MODE=local
# AUTH_SECRET=至少16位随机串
# DATABASE_URL=postgresql://forge:forge@127.0.0.1:5432/forge_starter
# APP_URL=http://localhost:3020
pnpm db:push
pnpm dev --port 3020
```

| 路径 | 说明 |
|------|------|
| `/login` | 登录（demo：任意账号） |
| `/dashboard` | 工作台 ← ecommerce-2 |
| `/accounts` | 账号列表（弹窗新建/编辑） |
| `/settings/apps` | 应用管理 |
| profile 菜单 | 资料 / 改密 / 系统设置 / 退出 |

## 环境变量

见 `.env.example`。

| 变量 | 含义 |
|------|------|
| `AUTH_MODE` | `demo` \| `local` |
| `AUTH_SECRET` | session 签名（local ≥16） |
| `DATABASE_URL` | Postgres |
| `APP_URL` | 重置密码链接根 |
| `SMTP_*` | 自建 SMTP |

## 目录

```text
app/(auth)/ (app)/ api/
components/   app-shell, *-form-dialog, accounts-store, ui/modal
config/       site, menu, apps
lib/          auth, db, accounts, apps, mail
.agents/skills/   Agent skills
.claude/skills/   Claude 同步
docs/         agent-native, module-template
AGENTS.md PRODUCT.md
```

## 常用命令

```bash
pnpm dev --port 3020
pnpm typecheck
pnpm build
pnpm db:push
pnpm db:studio
```

## 边界

- **做**：后台壳、认证、CRUD 范式、Agent 扩模块  
- **不做**：营销站、支付订阅、完整 IM、中台 BPM、第二套 UI 库  
