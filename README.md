# Forge Starter

基于 Forge UI Kit 的 **轻量后台脚手架**（Next.js 16 + Tailwind v4 + `@forge-ui-official/core`）。

定位接近 **轻量版 ShipAny**：clone 即可开工的业务后台底座。  
只做 **登录壳 + 应用壳 + 页面范例 + 本地账号 + PostgreSQL + 可配置 SMTP**，不做芋道式中台，也不做营销站 / 订阅支付全家桶。

## 当前能力（0.4）

| 模块 | 说明 |
|------|------|
| **认证** | 用户名或邮箱 + 密码；注册 / 登录 / 退出 / 找回与重置密码 |
| **数据库** | **PostgreSQL only**（Drizzle ORM）— 用于 **登录用户**，不是业务演示账号表 |
| **邮件** | 仅 **自定义 SMTP**；未配置时重置链接打印到服务端日志 |
| **模式** | `AUTH_MODE=demo` 任意账号可进；`local` 走真库 + 路由守卫 |
| **应用壳** | 统一 `AppLayout`；侧栏仅 **工作台 / 账号管理** |
| **业务竖切** | 工作台 ↔ 列表（搜索/筛选）↔ **弹窗新建/编辑** ↔ 详情 |
| **账号数据** | Postgres 表 `admin_accounts`（空库即空列表，无种子）；与登录 `users` 表分离 |
| **个人设置** | **仅** 侧栏 profile 菜单：编辑资料 / 修改密码 / 系统设置 / 退出登录 |

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

推荐端口：`pnpm dev --port 3020` → <http://localhost:3020>

| 路径 | 说明 |
|------|------|
| `/login` | 登录（demo：任意用户名密码） |
| `/register` | 注册（仅 `AUTH_MODE=local`） |
| `/dashboard` | 工作台布局 ← `dashboards/ecommerce-2`，指标来自 demo 账号 |
| `/accounts` | 账号列表 ← `ecommerce/customers`；**新建/编辑均为弹窗** |
| `/accounts/?create=1` | 打开列表并弹出「新建账号」 |
| `/accounts/?edit=<id>` | 打开列表并弹出「编辑账号」 |
| `/accounts/new` · `/accounts/[id]/edit` | 兼容重定向到弹窗 query |
| `/accounts/[id]` | 详情 ← `ecommerce/customers/[id]`（页内也可弹窗编辑） |
| `/settings` | 个人设置（**请从 profile 进入**，侧栏无「设置」菜单） |

### 数据边界（必读）

| 数据 | 存储 | 用途 |
|------|------|------|
| 登录用户 | Postgres `users`（`local`）/ demo session | 认证、profile 改名改密 |
| 运营「账号管理」列表 | Postgres `admin_accounts` | 业务账号 CRUD；**需 `DATABASE_URL` + `pnpm db:push`**；无数据则为空 |

侧栏顶部是 **应用切换器**（Forge `teams` 槽位），配置在 `config/apps.ts`：
- 列表项：当前产品 + 占位应用（可改 `href` 接独立部署）
- 「新建账号」→ 创建弹窗；「系统设置」→ 设置页
- 「新建应用」→ 未启用；**不必改 core** 即可做应用列表 + 点击切换骨架 |

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
    accounts/             # 列表 + 详情；新建/编辑弹窗
    settings/             # profile 入口
  api/auth/               # 登录用户认证 / 资料 / 改密
config/                   # 菜单、站点
lib/
  auth/
  db/
  mail/
  accounts/               # 业务账号类型 + DB service
components/
  app-shell.tsx
  accounts-store.tsx      # 客户端缓存 + 调 /api/accounts
  account-form-dialog.tsx
  ui/modal.tsx
middleware.ts
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
