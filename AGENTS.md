# Forge Starter — AI 接入指南

你正在协助一个基于 **Forge Starter（Forge 后台脚手架）** 的 Next.js 项目。  
目标：用 `@forge-ui-official/core`、Forge 布局与 token 快速搭业务后台，不在业务页里重新发明 UI 系统。

本仓库是 **轻量后台脚手架**，不是中台框架，也不是营销型 SaaS 全家桶。

## 基本原则

1. 组件优先从 `@forge-ui-official/core` 导入。
2. 颜色只使用 Forge 的 `fg-*` token，例如 `text-fg-grey-700`、`bg-fg-violet-500`、`border-fg-grey-200`。
3. 图标使用 `solar-icon-set`。左侧主菜单固定使用 `BoldDuotone`、`size={20}`，不显式传 `color`，让 `AppLayout` 控制激活态；其他图标颜色通过 `color="#HEX"` 或 `color="var(--fg-violet)"` 传入。
4. 登录态内页面使用 `AppLayout`，菜单和 profile 配置放在 `config/menu.tsx`。
5. 不确定组件用法时，先查 Forge 文档和主仓库 case，再写页面。
6. 默认不创建 `favoriteItems` 或“收藏 / 常用项目”菜单分组；只有明确的业务需求才能增加收藏能力。
7. 登录、注册、忘记密码和重置密码默认直接使用 `app/(auth)` 的结构与视觉；只有用户明确要求时才修改或关闭。
8. 不要引入第二套 UI 库（MUI、Ant、shadcn 全量等）替代 Forge；缺口先说明 `FORGE-GAP`。
9. 认证产品约定：默认 **用户名或邮箱 + 密码** 的本地账号；数据库默认 **PostgreSQL**（`DATABASE_URL`），不要用 SQLite 当默认或双轨存储；邮件发送只用 **可配置 SMTP**（自定义服务器与用户名密码），不要把 Resend/SendGrid/Mailgun/SES SDK 等云邮件服务做成默认依赖；也不要默认绑死 Clerk/Auth0。OAuth 仅在用户明确要求时再加。

## 当前仓库结构

- `app/(auth)`：登录、注册、忘记密码、重置密码
- `app/(app)/dashboard`：后台工作台（范例页）
- `app/globals.css`：Tailwind v4、Forge 样式和 `@source`
- `config/menu.tsx`：`AppLayout` 主菜单和 profile
- `lib/asset.ts`：静态资源路径
- `PRODUCT.md`：产品定位与模块路线图（改范围前先读）

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
2. 后台页面从 `app/(app)/dashboard` 或后续 `examples/*` 复制骨架，继续使用 `AppLayout`。
3. 登录相关页面默认保留 `app/(auth)` 的结构与视觉，只替换产品文案和真实提交逻辑。
4. 业务区块优先使用 Forge 组件；确实缺组件时，暂停并说明缺口。
5. 完成后运行 `pnpm typecheck`，必要时再跑 `pnpm build`。

## 提交前检查

- 没有引入私有 registry、npm token 或个人账号信息。
- 没有用 Tailwind 默认色替代 Forge token。
- 没有在业务页手搓 Forge 已提供的组件。
- `pnpm typecheck` 通过。
