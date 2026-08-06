# Forge Starter — Agent 合约（必读）

**用 Forge 搭管理后台的脚手架**：Next.js 16 + Tailwind v4 + `@forge-ui-official/core`。  
Coding Agent 是第一开发界面：skills 拆开后端与页面，双样板 + `/ref` 画廊保证 UI 不跑偏。

必读：`PRODUCT.md`、`docs/agent-native.md`、`docs/module-template.md`、`docs/page-roles.md`、`docs/forge-components.md`。

## 铁律

1. 组件只 `import { … } from "@forge-ui-official/core"`。  
2. 颜色只用 `fg-*`；业务控件 `color={siteConfig.accent}`（默认 `blue`）。  
3. 图标 `solar-icon-set`；侧栏主菜单 `BoldDuotone`、`size={20}`。  
4. 登录后页面在 `AppLayout`（`components/app-shell.tsx`）。  
5. **禁止** MUI / Ant / 全量 shadcn 替代 Forge；缺能力 `FORGE-GAP` 并询问。  
6. 认证：用户名或邮箱 + 密码；库 **PostgreSQL only**；邮件 **仅 SMTP**。  
7. 登录表 `users` ≠ 业务表（如 `admin_accounts`），不要混接。  
8. **`AUTH_MODE=demo` 只绕过登录用户库，不提供业务持久化。** 任何 CRUD（accounts/approvals/新模块）都需要 `DATABASE_URL` + `pnpm db:push`。不要写「无 Postgres 也能做完整业务 CRUD」。  
9. **后端与页面分开做**：先 module（数据+API），再 page（UI）。不要一条指令无脑抄 accounts 全套且写死详情形态。  
10. 详情 **无全局默认**：重 → `accounts`；轻 → `approvals`；拿不准问用户。  
11. 列表筛选 **一行** `ButtonGroup` + 搜索；禁止两行 pills。  
12. **`DataTable` 的 `sortable` 只画排序 UI，不会自动排序。** 未实现点击排序逻辑时 **禁止** 设 `sortable: true`（假按钮）。  
13. `ConfirmationDialog` 只是内容卡：必须用本仓 `components/ui/modal.tsx`（或等价宿主）包一层；对齐 `accounts` 删除确认。  
14. 侧栏/摘要卡禁止塞「返回列表」；`hideHeader: true` 时壳 `onBack` 不渲染。  
15. 不做无行为装饰按钮；要么实现要么隐藏。  
16. 交付：`pnpm typecheck`；改 UI 后 **浏览器点主路径**（禁止只 curl）。

## Forge UI 组件库（必读）

**选型入口（Starter 内，先看这个）：**

```text
docs/forge-components.md
```

流程：页面角色 → 组件包 → 抄 accounts/approvals/dashboard → 查 monorepo cases 的 props。

旁路 monorepo 权威（与 starter 同级时）：

```text
../forge/docs/for-agents/README.md      ← 组件路由表 + 介绍表（优先）
../forge/.agents/skills/forge/SKILL.md
../forge/src/app/cases/<name>/page.tsx
```

- 通用 Modal：core 无导出 → `components/ui/modal.tsx`  
- 缺组件 → `FORGE-GAP`，禁止手搓  

## Skills

| Skill | 何时 | 边界 |
|-------|------|------|
| `forge-starter-quick-start` | 改名 / accent / 菜单 / env | 只品牌壳 |
| `forge-starter-new-module` | 新业务数据与接口 | **只** schema + service + API（+ 可选 store） |
| `forge-starter-new-page` | 列表 / 详情 / 看板 UI | **只** 页面 + 菜单；对照样板选型 |

路径：`.agents/skills/<name>/SKILL.md`（canonical）。  
Skills 只维护 **`.agents/skills/`**。`.claude/skills` 为指向它的 symlink（给 Claude Code 发现用），勿再复制一份。

人类说「加 xxx 管理」→ 先 `new-module`，再 `new-page`（可同会话顺序执行）。

## 仓库地图

```
app/(auth)/              登录注册找回
app/(app)/dashboard      工作台
app/(app)/accounts       ★ 重样板：列表 + 表单弹窗 + 全页详情
app/(app)/approvals      ★ 轻样板：列表 + 表单/详情弹窗
app/(app)/ref/**         ★ AI 参考页（真实路由，不进菜单；生产默认关）
app/(app)/settings       profile / security / apps
app/api/auth|accounts|approvals
components/app-shell.tsx
components/*-form-dialog.tsx | *-detail-dialog.tsx | *-store.tsx
components/ui/modal.tsx
config/site.ts menu.tsx apps.ts
lib/auth lib/db lib/accounts lib/approvals lib/reference
docs/agent-native.md module-template.md page-roles.md reference-pages.md forge-components.md
```

参考页索引：`/ref/` · 说明：`docs/reference-pages.md` · 生产开启：`SHOW_REF_PAGES=true`

## 官方视觉对照

角色表：`docs/page-roles.md`。

| 角色 | Starter 样板 | Forge monorepo template（旁路） |
|------|--------------|----------------------------------|
| 工作台 | `dashboard` | `dashboards/ecommerce-2` |
| 列表 | `accounts` / `approvals` 列表 | `ecommerce/customers` |
| 表单弹窗 | `*-form-dialog` | customers Add Modal |
| 详情弹窗 | `approvals` detail dialog | — |
| 全页详情 | `accounts/[id]` | `ecommerce/customers/[id]` |

模板源码：`../forge/src/app/templates/...`（若存在）。

## 扩业务最短路径

1. `new-module`：types + service + schema + `db:push` + API。  
2. `new-page`：读 page-roles → 选 accounts 或 approvals 形态 → 列表/弹窗/详情 + menu。  
3. `pnpm typecheck` + 浏览器点通。  

详见 `docs/module-template.md`。

## 样式接入（不可删）

`app/globals.css`：

```css
@import "tailwindcss";
@import "@forge-ui-official/core/styles.css";
@source "../node_modules/@forge-ui-official/core/dist";
```

## 提交前

- [ ] 无密钥  
- [ ] 无 Tailwind 默认色顶替 `fg-*`  
- [ ] 无手搓已有 Forge 组件  
- [ ] typecheck  
- [ ] UI 变更已浏览器点过  
