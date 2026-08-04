# Forge Starter

基于 Forge UI Kit 的 **轻量后台脚手架**（Next.js 16 + Tailwind v4 + `@forge-ui-official/core`）。

定位接近 **轻量版 ShipAny**：clone 即可开工的业务后台底座。  
只做 **登录壳 + 应用壳 + 页面范例 + 可插拔鉴权**，不做芋道式中台，也不做营销站 / 订阅支付全家桶。

**目标：新项目第一天就用对 Forge 的组件、布局、token 和 AI 编码规范，而不是从空白页拼后台。**

## 和 ShipAny / 芋道的边界

| | Forge Starter | 典型 ShipAny | 芋道等中台 |
|--|---------------|--------------|------------|
| 主战场 | 业务后台 console | AI SaaS 全栈 | 企业中台 |
| 默认交付 | 壳 + 范例页 + 可插 auth | 落地页 + 支付 + i18n + 多扩展 | 权限/代码生成/BPM… |
| UI | 强制 Forge core | 多套主题/区块 | 自有或第三方 UI |
| 原则 | 轻、可删、可替换 | 开箱功能多 | 模块全、重量大 |

完整能力规划见 [PRODUCT.md](./PRODUCT.md)。

## 当前已有

- **认证页**：`/login`、`/register`、`/forgot-password`、`/reset-password`
- **后台壳**：`/dashboard` 接入 `AppLayout`、菜单、profile、通知占位
- **默认设计**：侧栏 `BoldDuotone` 图标；默认无收藏分组
- **Forge 样式**：Tailwind v4 + `core/styles.css` + `@source`
- **AI 规范**：根目录 `AGENTS.md`（Codex / Claude / Cursor 等）
- **公开依赖**：`@forge-ui-official/core` 来自 npm，无需私有 registry

**认证目标（0.3 落地，见 [PRODUCT.md](./PRODUCT.md)）：**

- 登录：**用户名或邮箱 + 密码**（本地账号，不强制 Clerk 等）
- 邮件：仅 **自定义 SMTP**（主机/端口/用户名/密码），用于找回密码等；**不依赖** Resend / SendGrid 等云邮件 API
- 当前 0.2 仍为演示跳转；上线前需 `AUTH_MODE=local` + 守卫 + SMTP

## 快速开始

```bash
gh repo create my-app --template forge-ui/forge-starter --clone
cd my-app

pnpm install
pnpm dev
```

打开 <http://localhost:3000>：

- `/` → `/login`
- `/login` 登录页
- `/register` 注册页
- `/dashboard` 后台首页

## 目录结构

```txt
.
├── app/
│   ├── (auth)/              # 未登录：登录 / 注册 / 找回密码
│   ├── (app)/               # 已登录区（当前各页自行挂 AppLayout）
│   ├── globals.css          # Tailwind v4 + Forge + @source
│   ├── layout.tsx
│   └── page.tsx             # / → /login
├── config/
│   └── menu.tsx             # 侧栏菜单与 profile
├── lib/
│   └── asset.ts             # basePath 友好的静态资源
├── public/images/           # 认证页与品牌资源
├── AGENTS.md                # AI 编码约束
├── PRODUCT.md               # 产品定位与模块路线图
└── package.json
```

## 常用命令

```bash
pnpm dev        # 本地开发
pnpm build      # 生产构建
pnpm start      # 启动生产构建
pnpm typecheck  # TypeScript 检查
```

## 接入真实业务

1. 改 `config/menu.tsx`：按业务换菜单与用户信息；默认不要加收藏分组。
2. 在 `app/(app)` 下加业务页，统一用 `AppLayout`（后续将收到共享 layout）。
3. 优先用 `@forge-ui-official/core`：`Button`、`TextField`、`DataTable`、`StatCard` 等。
4. 保留认证页结构与视觉，把 `handleSubmit` 换成 NextAuth / Clerk / Supabase / 自建 API。
5. 保留 `AGENTS.md`，让 AI 按 Forge 规范生成页面。

## 样式接入

`app/globals.css` 已包含：

```css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";
@source "../node_modules/@forge-ui-official/core/dist";
```

若移动 CSS 路径，请同步改 `@source`，否则 Forge 组件内部的 Tailwind class 可能不会生成。

## 相关链接

- [Forge 文档](https://forge-mu-amber.vercel.app/docs)
- [Forge 组件](https://forge-mu-amber.vercel.app/components)
- [Forge 主仓库](https://github.com/forge-ui/forge)
- [@forge-ui-official/core](https://www.npmjs.com/package/@forge-ui-official/core)

## License

MIT
