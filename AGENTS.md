# Forge Starter — AI 接入指南

你正在协助一个基于 Forge UI Kit 的 Next.js 项目。目标是用现成组件、布局和 token 快速搭业务后台，不在业务页里重新发明 UI 系统。

## 基本原则

1. 组件优先从 `@forge-ui-official/core` 导入。
2. 颜色只使用 Forge 的 `fg-*` token，例如 `text-fg-grey-700`、`bg-fg-violet-500`、`border-fg-grey-200`。
3. 图标使用 `solar-icon-set`，颜色通过 `color="#HEX"` 或 `color="var(--fg-violet)"` 传入。
4. 登录态内页面使用 `AppLayout`，菜单和 profile 配置放在 `config/menu.tsx`。
5. 不确定组件用法时，先查 Forge 文档和主仓库 case，再写页面。

## 当前模板结构

- `app/(auth)`：登录、注册、忘记密码、重置密码页面
- `app/(app)/dashboard`：后台首页起手页
- `app/globals.css`：Tailwind v4、Forge 样式和 `@source`
- `config/menu.tsx`：`AppLayout` 的菜单、收藏、profile 配置
- `lib/asset.ts`：处理静态资源路径

## 样式接入

`app/globals.css` 必须保留：

```css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";
@source "../node_modules/@forge-ui-official/core/dist";
```

如果移动 CSS 文件，必须按新位置调整 `@source`。缺少它会导致 Forge 组件内部 class 被 Tailwind v4 忽略。

## 开发流程

1. 先读需求，列出页面、字段、状态和操作流。
2. 后台页面从 `app/(app)/dashboard` 复制骨架，继续使用 `AppLayout`。
3. 登录相关页面从 `app/(auth)` 复制结构，替换文案和提交逻辑。
4. 业务区块优先使用 Forge 组件；确实缺组件时，暂停并说明缺口。
5. 完成后运行 `pnpm typecheck`，必要时再跑 `pnpm build`。

## 提交前检查

- 没有引入私有 registry、npm token 或个人账号信息。
- 没有用 Tailwind 默认色替代 Forge token。
- 没有在业务页手搓 Forge 已提供的组件。
- `pnpm typecheck` 通过。
