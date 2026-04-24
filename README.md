# Forge Starter

基于 [Forge UI Kit](https://forge-ui.github.io/forge) 的 Next.js 16 + Tailwind v4 项目模板。开箱包含：

- 登录 / 注册页（`/login` `/register`，用 Kit 组件 + 紫色品牌分栏布局）
- 空白后台壳（`/dashboard`，`AppLayout` + 虚线占位内容区）
- `AGENTS.md`（给 Claude / Cursor / Codex 的 Forge 规范）
- `.npmrc` / `.env.example`（GitHub Packages 私有包认证模板）
- TypeScript + ESLint-ready

## 一分钟跑起来

```bash
# 1. 从这个模板创建项目
gh repo create my-app --template forge-ui/forge-starter --clone
# 或：npx degit forge-ui/forge-starter my-app
cd my-app

# 2. 拿一个 GitHub PAT（需要 read:packages scope）
# https://github.com/settings/tokens

# 3. export 到 shell
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx

# 4. 装依赖 + 跑起来
pnpm install
pnpm dev
```

浏览器打开 <http://localhost:3000>：

- `/` 自动跳转到 `/dashboard`
- `/login` / `/register` 看登录注册
- `/dashboard` 看空白后台壳

## 目录结构

```
.
├── app/
│   ├── (auth)/              # 登录态外的路由组，共享左右分栏 auth layout
│   │   ├── layout.tsx       # 左边品牌面板 + 右边表单槽
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/               # 登录态内的路由组，共享 AppLayout
│   │   └── dashboard/page.tsx
│   ├── layout.tsx           # 根 layout
│   ├── page.tsx             # / → 重定向到 /dashboard
│   └── globals.css          # Tailwind v4 + @forge-ui/react styles + @source
├── config/
│   └── menu.tsx             # AppLayout 的 menuItems / profile 配置，改这里
├── AGENTS.md                # 给 AI 的 Forge 规范
├── .npmrc                   # GitHub Packages scope 指向
└── .env.example             # GITHUB_TOKEN 模板
```

## 常见问题

**装包时 `401 Unauthorized`**：token 没 `read:packages` scope，或没 export 到当前 shell。跑 `echo $GITHUB_TOKEN` 确认。

**样式全灰，按钮没颜色**：`globals.css` 里 `@source` 的相对路径不对。从 `app/globals.css` 出发，monorepo 场景可能要写成 `../../node_modules/...`。

更多说明看 Forge 文档：

- [快速开始](https://forge-ui.github.io/forge/docs/quick-start)
- [详细安装](https://forge-ui.github.io/forge/docs/installation)
- [故障排查](https://forge-ui.github.io/forge/docs/troubleshoot)
- [组件清单](https://forge-ui.github.io/forge/components)

## 下一步往哪走

1. 改 `config/menu.tsx`，换成你业务的菜单和 profile
2. 删掉 `app/(app)/dashboard/page.tsx` 里的虚线占位，换真实内容——参考 [Forge 组件清单](https://forge-ui.github.io/forge/components) 里的 `StatCard` / `ChartCard` / `DataTable` 等
3. 接入 auth：login / register 页里的 `handleSubmit` 换成你的 NextAuth / Clerk / Supabase / 自建 API 调用
4. 把 `AGENTS.md` 留在根目录，你的 AI 助手会自动读它

## License

MIT
