# Forge Starter — Agent 合约（必读）

**用 Forge 搭管理后台的脚手架**：Next.js 16 + Tailwind v4 + `@forge-ui-official/core`。  
Coding Agent 是第一开发界面：skills 拆开后端与页面，`accounts` 重样板 + `/ref` 画廊保证 UI 不跑偏。

必读：`docs/product.md`、`docs/agent-native.md`、`docs/module-template.md`、`docs/page-roles.md`、`docs/forge-components.md`、`docs/audit-checklist.md`。

## 页面动效（新页面必读）

业务页面沿用现有 `AppShell` 即自动接入正文动效，不得重复包裹或让侧栏参与动画。开发前读 `docs/page-motion.md`（参数、DOM 分段与导航边界）；交付按 `docs/audit-checklist.md` **Q5** 实测切页、刷新和减少动态效果。

## 通用规范来源

实施时先读项目内 `docs/forge-skill/README.md` 与锁定的 `docs/forge-skill/upstream/SKILL.md`，再按任务读取其 references；Starter 接线以本文件和本仓 docs 为准。全局安装的 `forge-skill` 仅作发现入口，不得覆盖项目同步副本，即使全局版本更新。副本缺失或版本不匹配时按 README 同步，不回退到全局规则冒充本项目已审计；开发模式提示不代表当前 core 与副本完全兼容。

通用规范唯一正文：[forge-skill](https://github.com/forge-ui/forge/tree/main/skills/forge-skill)。版本同步入口：`docs/forge-skill/README.md`；同步后正文在 `docs/forge-skill/upstream/SKILL.md`，通用清单在 `docs/forge-skill/upstream/references/audit-checklist.md`。副本不可手改，本仓只维护 Starter 适配。

## Starter 适配规则

3. 图标统一从 `@forge-ui-official/core/icons` 导入（Solar）；侧栏主菜单 `BoldDuotone`、`size={20}`。
4. 登录后页面在 `AppLayout`（`components/app-shell.tsx`）。右侧内容面顶/右/底 gutter 等距且锁在首屏，溢出在面内滚（L10），不要整页滚掉底边距。  
6. 认证：用户名或邮箱 + 密码；库 **PostgreSQL only**；邮件 **仅 SMTP**。  
7. 登录表 `users` ≠ 业务表（如 `admin_accounts`），不要混接。  
8. **`AUTH_MODE=demo` 只绕过登录用户库，不提供业务持久化。** 任何 CRUD（accounts/新模块）都需要 `DATABASE_URL`。新环境和生产用 `pnpm db:migrate`；`pnpm db:push` 只对开发库。不要写「无 Postgres 也能做完整业务 CRUD」。
9. **后端与页面分开做**：先 module（数据+API），再 page（UI）。不要一条指令无脑抄 accounts 全套且写死详情形态。  
10. 详情 **无全局默认**：重 → `accounts` 全页；轻 → `/ref/detail-modal` + 本仓 `Modal` + `?id=`（**暂无第二业务样板**）；拿不准问用户。
13. `ConfirmationDialog` 支持受控 `open` / `onOpenChange`，独立确认直接使用，无需再套 Modal；省略 `open` 时是内联卡，才需要已有宿主。accounts 既有内联模式可保留，不做无关重构。
14. 侧栏/摘要卡禁止塞「返回列表」；`hideHeader: true` 时壳 `onBack` 不渲染。  
16. **操作反馈用全站 toast**，禁止页面内嵌「创建成功」绿条：`import { toast } from "@/lib/toast"` → `toast.success/error/info(...)`。宿主已在 `AppShell`。  
17. 交付：`pnpm check`（typecheck + 规范绊线）；改 UI 后 **浏览器点主路径**（禁止只 curl）。
18. **任何业务页面新建/修改完成后，必须执行完整规范审计**：按 `.agents/skills/forge-starter-audit/SKILL.md` 四步流程，对照 `docs/audit-checklist.md` 逐条核查并修复。绊线（`pnpm check`）通过 ≠ 合规，审计不可省略——无论代码由谁、用什么流程写出。
19. **语义状态用 Kit `StatusBadge`（默认 soft）**：浅底细边、语义色（绿/黄/红/灰）。禁止 `variant="solid"`、`Label`、手搓 pill、本仓 `StatusText`。分类/角色/标签用 `CellText`，不要彩虹胶囊。一张表最多一列状态胶囊。
20. **表格详情入口放在名称/标题列的数据上**：点击名称打开所选的全页详情或详情弹窗，支持键盘操作，并保留筛选上下文。不要另设箭头或眼睛图标作为重复的“查看详情”操作。操作列仅放编辑、删除等实际业务动作；没有这些动作就省略整列。`DataTable` 不会自动生成操作列；可选 `CellLink` 带箭头，不作为普通名称详情入口的默认样式。

## Forge UI 组件库（必读）

**选型入口（Starter 内，先看这个）：**

```text
docs/forge-components.md
```

流程：页面角色 → 组件包 → 抄 accounts/dashboard/`/ref/detail-modal` → 查 monorepo cases 的 props。

旁路 monorepo 权威（与 starter 同级时）：

```text
../forge/docs/for-agents/README.md      ← 组件路由表 + 介绍表（优先）
../forge/skills/forge-skill/SKILL.md
../forge/src/app/cases/<name>/page.tsx
```

- Modal：core 0.4.7 已导出 `Modal` / `Drawer`；Starter 既有表单沿用 `components/ui/modal.tsx`，不表示 core 缺能力
- 操作 Toast：core 已导出 `ToastProvider` / `useToast`；Starter 沿用既有全局宿主 → `lib/toast.ts` + `components/ui/toast-provider.tsx`（已挂 AppShell）
- **Ask AI**：Kit `AskAi`（core `≥0.1.17`）。业务页默认 `hideHeader: true`，`AppLayout.askAi` 不会出现。壳层 `AskAiProvider` 保活唯一实例，页头右侧用 `PageTitleActions` / `AskAiEntry`。composer 用 `ChatInputBar`（宽栏，抽屉里必须垫 gutter + `min-w-0`，核心自定义 composer 不带默认 `p-4`）；回复是几组中文示范问答（`AskAiTranscript`），按问题选用 Agent 组件，不要整页铺 `/cases/agent` 英文死 demo。`onSend` 打 `POST /api/ask-ai`：`modelId` 对应模型管理里启用的条目；没有可用模型再看 `ASK_AI_LLM_*`，都没有用本地规则。已接模型时只调用由模块 manifest 自动登记的工具（`config/modules/<id>.json`）；通用读取复用现有服务，敏感字段递归剔除，专用工具通过 manifest 挂接，按当前用户权限过滤。读立即执行；写入和删除先出确认单，确认后把字段填进页面表单或打开页面上的删除确认，由页面自己的保存逻辑处理，不直接写库。页面保存或删除成功后，同一会话继续原请求里还没做的查询或导出。不读仓库源码，不生成页面。新增模块必须有 manifest；缺声明或知识/读取说明时检查失败。密钥只放服务端，禁止请求体传 `apiKey`。组件对照仍看 `/ref/agent`。全屏、会话栏走 Kit props，禁止自研抽屉或全视口层。
- **Checklist**：Kit `Checklist` / `ChecklistItem`（对照 `/ref/checklist`，任务页禁止手搓 Checkbox 行）。core `0.1.18` 起随包导出。  
- 资源工作台：`WorkspaceSplit` + `FolderNav` + `ResourceCard`（见 `/ref/resource-workspace`）  
- 时间格式：`lib/format/datetime.ts`（客户端安全，勿塞 next/headers）  
- 缺组件 → `FORGE-GAP`，禁止手搓  

## Skills

| Skill | 何时 | 边界 |
|-------|------|------|
| `forge-starter-quick-start` | 改名、accent、菜单、env | 只品牌壳 |
| `forge-starter-new-module` | 新业务数据与接口 | **只** schema + service + API（+ 可选 store） |
| `forge-starter-new-page` | 列表、详情、看板 UI | **只** 页面 + 菜单；对照样板选型 |
| `forge-starter-audit` | 页面写完/改完后的规范审计（**必跑**） | 只审计与修复规范违规；不重构业务逻辑 |
| `hairline-create` | 按业务含义生成自定义交互线稿 | 先独立 HTML 视觉确认，再接入；不默认添加到 Ask AI；遵循现有 Chrome 复用规则 |

路径：`.agents/skills/<name>/SKILL.md`（canonical）。  
Skills 只维护 **`.agents/skills/`**。

人类说「加 xxx 管理」→ 先 `new-module`，再 `new-page`，最后 **`forge-starter-audit`**（可同会话顺序执行）。

## 模块声明（扩业务必做）

唯一来源是 `config/modules/<id>.json`。运行 `pnpm modules:generate` 自动派生 `APP_MODULE_IDS`、`APP_MODULE_META`、`MODULE_MENU`、权限资源、知识与服务端工具注册；不要再手改菜单三处或 `lib/agent/registry.ts`。`pnpm typecheck` / `pnpm check` 校验遗漏与漂移。

`pnpm module:new <id> [中文名称]` 生成并注册开发骨架；数据服务默认明确报未实现，不提供假 CRUD。后端与正式页面仍分阶段完成。声明必须提供知识与白名单 reader，或不可读原因；专用工具通过 `tools` 挂接。写草稿共用 API Zod，只有接好页面表单、If-Match、事务回执及读回验证后才能开启，绝不直接写库。

默认产品自动合并新增模块；用户自建或显式配置的应用保留原勾选，需要在应用管理勾选。`rbac_menus` 只是目录，不会生成模块。

默认侧栏实际可见 = manifest 派生菜单 ∩ 当前应用勾选 ∩ 登录角色 `{module}:read`。
显式声明 `access: "authenticated"` 的模块对所有登录用户开放读权限，在内部应用中不受角色读授权与应用勾选限制；菜单、直链、API 和 Ask AI reader 统一生效。不放开匿名访问、行级隔离或写权限。未声明的模块仍遵循默认交集；无有效读权限时直链由壳层 `replace` 回工作台。

## 仓库地图

```
app/(auth)/              登录注册找回
app/(app)/dashboard      工作台
app/(app)/accounts       ★ 重样板：列表 + 表单弹窗 + 全页详情
app/(app)/roles · menus · permissions  RBAC 目录：列表 + 表单/详情弹窗
app/(app)/models         大模型接入：供应商 FolderNav + ResourceCard + 表单/详情弹窗
app/(app)/ref/**         ★ AI 参考页（真实路由，不进菜单；生产默认关）
app/(app)/settings       apps；资料/改密/系统设置走头像菜单弹窗
app/api/auth|accounts|roles|menus|permissions|models
components/app-shell.tsx
components/*-form-dialog.tsx | *-store.tsx
components/ask-ai-entry.tsx
components/ask-ai-transcript.tsx
lib/ask-ai.ts
lib/ask-ai-llm.ts
app/api/ask-ai
lib/reference/agent-demo.ts
components/ui/modal.tsx
config/site.ts menu.tsx apps.ts
lib/auth lib/db lib/accounts lib/roles lib/menus lib/permissions lib/rbac lib/reference
docs/product.md agent-native.md setup.md module-template.md page-roles.md reference-pages.md forge-components.md
```

参考页索引：`/ref/` · 说明：`docs/reference-pages.md` · 生产开启：`SHOW_REF_PAGES=true`

## 官方视觉对照

视觉以主仓 Screens 为准；接线与角色目录统一见 `docs/page-roles.md`、`docs/reference-pages.md`。看板先选主 Screen，再选 Blocks / Components；未导出的区块不能虚构 import。

## 扩业务最短路径

1. `new-module`：types + service + schema + `db:migrate`（开发库迭代可用 `db:push`）+ API（**API 齐 ≠ 侧栏有**）。
2. `new-page`：读 page-roles → 选全页（accounts）或轻弹窗（`/ref/detail-modal`，暂无第二业务样板）→ 列表/弹窗/详情 + **模块 manifest**；生成菜单与工具注册，默认产品自动合并新 id。
3. 核对应用勾选；默认产品自动合并，人工配置应用须显式勾选。无权限直链由壳 `replace` 回工作台。
4. `pnpm check` + 完整规范审计 + 浏览器从侧栏点通，分别记录结果。

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
- [ ] 无 Tailwind 默认色顶替 `fg-*`；标题/正文不是浅灰（V7）；内容面底 gutter 在首屏（L10）  
- [ ] 无手搓已有 Forge 组件  
- [ ] `pnpm check`（typecheck + 绊线）  
- [ ] UI 变更已浏览器点过  
- [ ] 已执行 `forge-starter-audit` 完整审计并修复红线  

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
