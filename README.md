# Forge Starter

基于 Forge UI Kit 的 **轻量后台脚手架**（Next.js 16 + Tailwind v4 + `@forge-ui-official/core`）。

定位接近 **轻量版 ShipAny**：clone 即可开工的业务后台底座。  
只做 **登录壳 + 应用壳 + 页面范例 + 本地账号 + PostgreSQL + 可配置 SMTP**，不做芋道式中台，也不做营销站 / 订阅支付全家桶。

## 当前能力（0.4）

| 模块 | 说明 |
|------|------|
| **认证** | 用户名或邮箱 + 密码；注册 / 登录 / 退出 / 找回与重置密码 |
| **数据库** | **PostgreSQL only**（Drizzle ORM） |
| **邮件** | 仅 **自定义 SMTP**；未配置时重置链接打印到服务端日志 |
| **模式** | `AUTH_MODE=demo` 任意账号可进；`local` 走真库 + 路由守卫 |
| **应用壳** | 统一 `AppLayout`、菜单；退出在左下角 profile |
| **业务竖切** | 工作台 ↔ 列表 ↔ 新建/编辑 ↔ 详情，**共享 demo store** |
| **个人设置** | 侧栏 profile：编辑资料 / 改密 / 系统设置（无侧栏一级菜单） |

## 快速开始

```bash
# 1) 依赖
pnpm install

# 2) 环境
cp .env.example .env
# 演示模式可直接：
# AUTH_MODE=demo

# 3) 本地 Postgres（local 模式需要）
docker compose up -d
# .env 中：
# AUTH_MODE=local
# AUTH_SECRET=请换成足够长的随机串
# DATABASE_URL=postgresql://forge:forge@127.0.0.1:5432/forge_starter
# APP_URL=http://localhost:3000

# 4) 建表
pnpm db:push

# 5) 开发
pnpm dev
```

打开 <http://localhost:3020>（或 `pnpm dev` 默认端口）：

- `/login` 登录（demo：任意用户名密码）
- `/register` 注册（仅 `local`）
- `/dashboard` 工作台（← `dashboards/ecommerce-2`）
- `/accounts` 账号列表（← `ecommerce/customers`）
- `/accounts/new` 新建账号（← `ecommerce/products/new`）
- `/accounts/[id]` 账号详情（← `ecommerce/customers/[id]`）
- `/settings` 设置

## 环境变量

见 [`.env.example`](./.env.example)。

| 变量 | 含义 |
|------|------|
| `AUTH_MODE` | `demo` \| `local` |
| `AUTH_SECRET` | session 签名密钥（local 必填，建议 ≥16 字符） |
| `DATABASE_URL` | PostgreSQL 连接串（local 必填） |
| `APP_URL` | 应用根 URL，用于重置密码链接 |
| `SMTP_HOST` 等 | 自建/企业 SMTP；不配置则找回密码返回开发用链接 |
| `AUTH_GUARD` | 可选强制/关闭守卫；默认 local 开、demo 关 |

## 常用命令

```bash
pnpm dev          # 开发
pnpm build        # 生产构建
pnpm typecheck    # 类型检查
pnpm db:push      # 推送 schema 到 Postgres
pnpm db:studio    # Drizzle Studio
docker compose up -d   # 本地 Postgres
```

## 目录结构

```txt
app/
  (auth)/                 # 登录 / 注册 / 找回 / 重置
  (app)/                  # 登录后区域（统一 AppShell）
    dashboard/            # 账号运营看板
    accounts/             # 账号 CRUD（list / new / [id] / edit）
    settings/
  api/auth/               # 认证 API
config/                   # 菜单、站点、路由标题
lib/
  auth/                   # session、密码、用户
  db/                     # Drizzle + schema
  mail/                   # SMTP only
  demo/accounts.ts        # 演示账号数据模型
components/
  app-shell.tsx
  demo-store.tsx
  account-form.tsx
middleware.ts             # 路由守卫
docker-compose.yml
PRODUCT.md                # 产品边界与路线图
```

## 相关文档

- [PRODUCT.md](./PRODUCT.md) — 定位、模块、认证与邮件约定
- [AGENTS.md](./AGENTS.md) — AI 编码约束
- [Forge 文档](https://forge-mu-amber.vercel.app/docs)
- [@forge-ui-official/core](https://www.npmjs.com/package/@forge-ui-official/core)

## License

MIT
