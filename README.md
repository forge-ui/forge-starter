# Forge Starter

基于 Forge UI Kit 的 Next.js 16 + Tailwind v4 起手模板，用来快速搭建 SaaS 控制台、业务后台和 AI agent 产品壳。

**目标：让新项目从第一天就使用 Forge 的组件、布局、设计 token 和 AI 编码规范，而不是从空白页面重新拼后台。**

## 内置内容

- **登录流程**：`/login`、`/register`、`/forgot-password`、`/reset-password`
- **后台壳**：`/dashboard` 已接入 `AppLayout`、菜单、用户信息、通知和基础 dashboard 区块
- **Forge 样式接入**：Tailwind v4 已导入 `@forge-ui-official/core/styles.css` 和必要的 `@source`
- **AI 规范**：根目录 `AGENTS.md` 会约束 Codex、Claude Code、Cursor 等工具优先使用 Forge 组件
- **公开依赖**：组件库来自 npm 包 `@forge-ui-official/core`，不需要私有 registry 或 npm token

## 快速开始

```bash
gh repo create my-app --template forge-ui/forge-starter --clone
cd my-app

pnpm install
pnpm dev
```

打开 <http://localhost:3000>：

- `/` 默认跳转到 `/login`
- `/login` 查看登录页
- `/register` 查看注册页
- `/dashboard` 查看后台首页

## 目录结构

```txt
.
├── app/
│   ├── (auth)/              # 登录态外页面，共享 auth layout
│   ├── (app)/               # 登录态内页面，共享 AppLayout 使用方式
│   ├── globals.css          # Tailwind v4 + Forge styles + @source
│   ├── layout.tsx
│   └── page.tsx             # / -> /login
├── config/
│   └── menu.tsx             # AppLayout 菜单、收藏、profile 配置
├── lib/
│   └── asset.ts             # basePath 友好的静态资源 helper
├── public/
│   └── images/              # 登录页和品牌图标资源
├── AGENTS.md                # AI coding agent 规范
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

1. 修改 `config/menu.tsx`，替换菜单、收藏项和用户信息。
2. 在 `app/(app)` 下新增业务页面，统一用 `AppLayout` 承载。
3. 复用 `@forge-ui-official/core` 的 `Button`、`TextField`、`DataTable`、`StatCard`、`ChartCard` 等组件。
4. 把 auth 页面里的 `handleSubmit` 替换成你的 NextAuth、Clerk、Supabase 或自建 API 调用。
5. 保留 `AGENTS.md`，让 AI 助手按 Forge 规范生成页面。

## 样式接入

`app/globals.css` 已包含：

```css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";
@source "../node_modules/@forge-ui-official/core/dist";
```

如果你移动了 CSS 文件位置，记得同步调整 `@source` 的相对路径，否则 Forge 组件内部用到的 Tailwind class 可能不会生成。

## 相关链接

- [Forge 文档](https://forge-mu-amber.vercel.app/docs)
- [Forge 组件](https://forge-mu-amber.vercel.app/components)
- [Forge 主仓库](https://github.com/forge-ui/forge)
- [@forge-ui-official/core](https://www.npmjs.com/package/@forge-ui-official/core)

## License

MIT
