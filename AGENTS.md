# Forge Starter — Agent 合约（必读）

你正在 **Forge Starter** 仓库中工作：面向 Coding Agent 的 **Forge 后台 0→1 脚手架**（Next.js 16 + Tailwind v4 + `@forge-ui-official/core`）。

**不是** 中台、**不是** ShipAny 全量 AI SaaS。参照 ShipAny 的是 **Agent skills 工作方式**，不是支付/积分清单。

先读：`PRODUCT.md`、`docs/agent-native.md`、`docs/module-template.md`、`docs/page-roles.md`。

## 铁律

1. 组件只 `import { … } from "@forge-ui-official/core"`。
2. 颜色只用 `fg-*` token；业务控件传 `color={siteConfig.accent}`（默认 `blue`）。
3. 图标用 `solar-icon-set`；侧栏主菜单 `BoldDuotone`、`size={20}`、不写死 color。
4. 登录后页面在 `AppLayout` 内（`components/app-shell.tsx`）。
5. **禁止** MUI / Ant / 全量 shadcn 替代 Forge；缺能力写 `FORGE-GAP` 并停下询问。
6. 认证：用户名或邮箱 + 密码；库 **PostgreSQL only**；邮件 **仅 SMTP**。
7. 登录用户表 `users` ≠ 业务样板表 `admin_accounts`，不要混接。
8. CRUD：**列表 + 弹窗表单 + 详情 + API**；默认不要整页表单。
9. 不做无行为的装饰按钮（导出/通知铃铛等）；要么实现要么隐藏。
10. 交付前：`pnpm typecheck`。

## Skills（优先调用）

| Skill | 何时用 |
|-------|--------|
| `forge-starter-quick-start` | 新项目改名、主题、菜单、env 第一遍定制 |
| `forge-starter-new-module` | 新增业务域 CRUD（抄 accounts） |
| `forge-starter-new-page` | 单页对照 forge 官方 template |

路径：

- `.agents/skills/<name>/SKILL.md`
- `.claude/skills/<name>/SKILL.md`（与上同步，给 Claude Code）

## 仓库地图

```
app/(auth)/          登录注册找回重置
app/(app)/dashboard  工作台（ecommerce-2）
app/(app)/accounts   ★ CRUD 样板
app/(app)/settings   profile / security / apps / notifications
app/api/auth         登录用户 API
app/api/accounts     业务账号 API
components/app-shell.tsx
components/*-form-dialog.tsx
components/ui/modal.tsx    宿主 Modal（core 无通用弹窗）
config/site.ts menu.tsx apps.ts
lib/auth lib/db lib/accounts lib/apps
```

## 官方视觉对照

完整角色表：`docs/page-roles.md`（页面角色 → template，**无外部设计插件**）。

| 页面 | Forge 官方模板 |
|------|----------------|
| 工作台 | `dashboards/ecommerce-2` |
| 列表 | `ecommerce/customers` |
| 弹窗表单 | customers Add Modal / 窄表单 |
| 详情 | `ecommerce/customers/[id]` |

模板源码：本机 `../forge/src/app/templates/...`（若 monorepo 旁路存在）。

## 扩模块最短路径

1. 复制 accounts 相关文件，全局重命名资源名。  
2. schema + `pnpm db:push`。  
3. API + service + types。  
4. list page + form dialog + detail。  
5. `config/menu.tsx` 加菜单。  
6. `pnpm typecheck`。

详见 `docs/module-template.md`。

## 样式接入（不可删）

`app/globals.css`：

```css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";
@source "../node_modules/@forge-ui-official/core/dist";
```

## 提交前

- 无密钥进库  
- 无 Tailwind 默认色顶替 `fg-*`  
- 无手搓已有 Forge 组件  
- typecheck 通过  
