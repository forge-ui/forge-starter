# Forge Starter

用 Forge UI 搭管理后台的脚手架。Next.js 16 · Tailwind v4 · `@forge-ui-official/core`。

## 亮点

- **跟官方后台同一套视觉** — 组件、颜色、布局对齐 Forge 产品，不是另一套后台皮肤。
- **开箱能登录、能管账号** — 登录注册找回、工作台、账号 CRUD（列表 / 表单弹窗 / 全页详情）。
- **接上 Postgres 就能落库** — 登录用户和业务账号分表；不是纯前端假数据。

## 快速开始

```bash
docker compose up -d
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

默认 `AUTH_MODE=demo`：任意账号可进后台看界面。`demo` 只简化登录，**不**提供业务内存库——账号管理仍走上面的 Postgres。要真用户注册登录，把 `.env` 里改成 `AUTH_MODE=local`，并设置至少 16 位的 `AUTH_SECRET`。环境变量与命令见 [docs/setup.md](docs/setup.md)。

## 开箱有什么

| 有 | 没有 |
|----|------|
| 登录 / 注册 / 找回 / 重置（用户名或邮箱 + 密码） | OAuth、社交登录 |
| 工作台、账号管理 CRUD 样板 | 审批流、支付、订阅、积分 |
| 个人资料、改密 | 真通知中心、IM |
| 应用管理（浏览器本地登记；外部认证占位） | 多租户、真 SSO、RBAC |
| SMTP 发重置信（未配置则打日志） | 云邮件 SaaS、无库完整 CRUD |

## 文档

| 文档 | 用途 |
|------|------|
| [AGENTS.md](AGENTS.md) | Agent 合约 |
| [docs/product.md](docs/product.md) | 产品范围与规划 |
| [docs/agent-native.md](docs/agent-native.md) | 工作流、skills、详情选型 |
| [docs/setup.md](docs/setup.md) | 环境变量、目录、命令 |
| [docs/forge-components.md](docs/forge-components.md) | 组件怎么选 |
| [docs/page-roles.md](docs/page-roles.md) | 页面角色 |
| [docs/module-template.md](docs/module-template.md) | 扩模块文件地图 |
| [docs/reference-pages.md](docs/reference-pages.md) | `/ref` 参考页目录 |
| [docs/audit-checklist.md](docs/audit-checklist.md) | 页面规范审计 |

相关：[Forge UI](https://github.com/forge-ui/forge) · [Forge Design](https://github.com/forge-ui/forge-design-extension)
