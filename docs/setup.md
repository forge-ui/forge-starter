# 本地安装与环境

README 只给最短路径。本文是环境变量、目录和命令的完整说明。

## 依赖

- Node.js（建议 20+）
- [pnpm](https://pnpm.io)
- Docker（跑 Postgres；也可用自己的库，把 `DATABASE_URL` 改成实际连接串）

## 最短路径

顺序必须是：先起数据库，再拷环境变量，再装依赖并同步 schema。

```bash
docker compose up -d
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev
```

打开 `http://localhost:3000`。

`pnpm db:push` 依赖已安装的 `drizzle-kit`，所以必须在 `pnpm install` 之后。compose 起来后若立刻 push 失败，等几秒等 Postgres 健康检查通过再试（`docker compose up -d --wait` 会等到 healthy）。

Compose 默认库与 `.env.example` 一致：`postgresql://forge:forge@127.0.0.1:5432/forge_starter`。

## demo 和 local

| | `AUTH_MODE=demo`（默认） | `AUTH_MODE=local` |
|--|--------------------------|-------------------|
| 登录 | 任意用户名/邮箱 + 密码即可进后台 | 走 Postgres `users` 表，需先注册 |
| `AUTH_SECRET` | 未设时用内置演示密钥 | **必填**，至少 16 位（`.env.example` 建议更长） |
| 业务 CRUD | **仍要** `DATABASE_URL` + `pnpm db:push` | 同左 |
| 登录守卫 | 默认不强制（可用 `AUTH_GUARD=true` 打开） | 默认强制登录 |

`demo` **只**绕过登录用户库，**不**提供业务表内存存储。账号管理等 CRUD 没有 Postgres 跑不起来。

`AUTH_MODE=local` 时未配置 SMTP：找回密码会把重置链接打到服务端日志，不假装已发信。

## 环境变量

完整模板：仓库根目录 [`.env.example`](../.env.example)。

| 变量 | 说明 |
|------|------|
| `AUTH_MODE` | `demo` 或 `local`，默认 `demo` |
| `AUTH_SECRET` | 会话签名。`local` 至少 16 位 |
| `APP_URL` | 对外地址，用于重置密码链接，默认 `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL 连接串。`local` 登录和任何业务 CRUD 都需要 |
| `AUTH_GUARD` | `true` 时即使 `demo` 也强制登录；`false` 关闭 |
| `SHOW_REF_PAGES` | `/ref/*` 参考页。开发默认开、生产默认关；生产要开则设 `true` |
| `SMTP_HOST` | 有值才发信；留空则重置信打日志 |
| `SMTP_PORT` | 默认 `587` |
| `SMTP_SECURE` | 默认 `false` |
| `SMTP_USER` / `SMTP_PASS` | 可选 |
| `SMTP_FROM` | 发件人显示名 |

只支持标准 SMTP，没有云邮件 SaaS SDK。

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发服务器（默认 3000） |
| `pnpm build` / `pnpm start` | 生产构建与启动 |
| `pnpm typecheck` | TypeScript 检查 |
| `pnpm check` | typecheck + 规范绊线 |
| `pnpm db:push` | 把 Drizzle schema 推到当前库（开发） |
| `pnpm db:generate` | 生成 migration |
| `pnpm db:studio` | Drizzle Studio |
| `docker compose up -d` | 启动本仓库 Postgres 16 |

## 目录结构

```text
app/
  (auth)/            登录 · 注册 · 找回、重置密码
  (app)/             工作台 · 账号 · 角色 · 菜单 · 权限 · 设置 · ref/*
  api/               auth · accounts · roles · menus · permissions
components/          app-shell · *-store · *-dialog · ui/modal
config/              site · menu · apps
lib/                 auth · db · accounts · roles · menus · permissions · rbac · apps · mail · reference
docs/                产品说明 · 工作流 · 安装环境 · 组件选型
.agents/skills/      quick-start · new-module · new-page · audit
AGENTS.md
```

登录用户在 `users`，业务账号在 `admin_accounts`，不要混接。应用登记在浏览器 `localStorage`，不是登录库。
