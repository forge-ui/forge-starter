---
name: forge-starter-audit
description: 页面规范审计。任何业务页面写完/改完后必须执行：先定角色并选定对照页，再对照 docs/audit-checklist.md 逐条核查 + Forge 组件/token/字色层级（V7）/内容壳 gutter（L10）审查 + 截图，输出违规报告并修复重验。不要默认用 accounts 当唯一基线。审计对象与"是谁、用什么流程写的"无关。标题和正文发灰、内容面贴死视口底也是红线。
---

# Forge Starter 页面审计

你是独立的 QA 审计员。默认被审代码**不可信**（可能由未读任何规范的 agent 生成），你的职责是找出所有违规并修复。

**判据优先级**

1. **Forge 用法与 token**（`docs/forge-components.md`、Kit `/cases/`、清单 C/V/F）——红线
2. **该页角色匹配的对照页 / case**（结构：页头、工具带、主体）——结构参照
3. **`accounts` 只是 collection + 全页详情的本仓捷径**，不是全站基线

禁止问「像不像 accounts」。禁止因为用了 `PageTitleToolbar` 就要求改回 accounts 的 h1。  
**`PageHeader` 不是正文页头**：页内拿它当标题栏、包白卡片、把状态胶囊当 action → 按 H6 判违规。

## 输入

1. 审计范围：默认 `git diff`（含未提交）涉及的 `app/(app)/**`、`components/**`、`config/**` 文件；用户指定模块时以模块为范围。**一次只审一个模块**，多模块分批。
2. 规范：`docs/forge-skill/upstream/SKILL.md` 与 `docs/forge-skill/upstream/references/audit-checklist.md`（通用唯一清单，完整读取）；`docs/audit-checklist.md` 仅补 Starter 适配。副本缺失则停止完整审计并报告，不伪造通过。
3. 对照物：第 0 步选定的角色匹配页 + 该页实际选用的 Forge chrome（A 紧凑 h1+面包屑 / B 正文 `PageTitleToolbar` / C 壳 `PageHeader` 顶栏）。先分清「正文页头」还是「AppLayout 顶栏」。

## 第 0 步：定角色与对照物（禁止跳过）

写不出对照物 → **停下**，不要开始逐条核查。

1. 用 `docs/page-roles.md` 给每个被审页归角色
2. 认定该页选了 H1 的 A/B/C 哪套 chrome（尚无页头则标「待查」，不要先假设必须是 accounts 的 h1）。Starter 默认 `hideHeader: true`，新业务页应是 A 或 B；只有壳顶栏打开才是 C。
3. 按下表选 **一个** 主对照；需要查 props 时再打开 Kit case。打不开旁路 monorepo 时，用本仓 `/ref/*`

| 被审角色 | 主对照（选最像的一档，不要默认 accounts） | Kit case |
|----------|------------------------------------------|----------|
| collection 表格 | 本仓 `accounts/page` **或** `/ref/list-table` **或** 官方 wallets/customers | `toolbar` `table` |
| collection 卡片 | `/ref/list-cards` | `grid` |
| 资源工作台 | `/ref/resource-workspace` | `grid` |
| detail 全页 | `accounts/[id]` **或** 官方 CRM `customers/[id]`（`PageTitleToolbar`）**或** ecommerce `customers/[id]` | `toolbar` `card` `tab` `grid`（仅 C 才查 `page-header`） |
| detail-modal | `/ref/detail-modal` + `components/ui/modal.tsx` + `?id=` | `modal` `list` |
| form-modal | `account-form-dialog` **或** `/ref/form-modal` | `modal` `input-field` |
| form-page | `/ref/form-page` | `input-field` |
| dashboard | `/dashboard` + `/ref/dashboard-*`；官方 `dashboards/ecommerce-2` | `card` `chart` `grid` |
| settings | `settings/apps`、头像菜单弹窗、`/ref/settings` | `input-field` `modal` |
| auth | `app/(auth)` | — |

选 B 时打开 `/cases/toolbar` 与 CRM/Finance 模板页头，**不要**强行对照 accounts 的 h1，也**不要**对照 `/cases/page-header`（那是壳顶栏）。  
核 H6：检查 `PageHeader` 实际 JSX 用法及宿主位置；import 本身不是违规证据，合法壳顶栏与清单点名的沉浸式工作台须按上下文判定。
轻详情对照 `/ref/detail-modal`（暂无第二业务样板）。

报告开头必须写出：`角色 / chrome A|B|C / 对照页 / case`。

看板还须选一个官方主 Screen，按其实际测量值核栅格比例、区块尺寸与密度，并提交目标页/模板并排截图；不以 accounts 或任意固定比例代替模板基准。

## 流程（四步，缺一不可）

通用六维度、S→O→N→C 取证顺序、组件/token/状态与字色规则，统一执行 `docs/forge-skill/upstream/references/audit-checklist.md`，不在 Starter 复制第二套判据。

### 第 1 步：清单逐条核查

完整执行上游编号清单与本仓适配，按第 0 步角色与主对照取证。每条记录 `条目ID | 通过/违规/不适用/未验证 | 文件:行号或运行证据 | 修复方案`，不得跳条。模块 manifest 声明与 pnpm modules:generate 自动生成菜单（禁止手改 APP_MODULE_IDS、APP_MODULE_META、MODULE_MENU）、应用勾选、RBAC、auth、toast/Ask AI 宿主等接线按本仓文档核对。

### 第 2 步：Forge 样式对照

依上游清单逐层比较结构与视觉，记录合理业务差异和违规；表格外壳、比例和侧轨继承选定模板，不能把所有 DataTable 一律判为不能入卡。缺组件标 FORGE-GAP 并询问，不虚构导出。

### 第 3 步：截图视觉审查

先检查已有 Chrome 会话，优先已安装 Chrome 插件或 Chrome DevTools MCP。禁止 Playwright/Puppeteer 启动系统 Chrome 或另建系统 Chrome profile；明确需要隔离时才用 bundled Chromium / Chrome for Testing，结束后停进程并移除临时 profile。

确认实际服务端口与认证模式（从运行参数或用户确认获取，不读取 .env*）；浏览器从侧栏点主路径、详情和弹窗，记录 console/overlay。按上游 T 项在同视口与壳状态下测量并排截图。页面动效还须依 `docs/page-motion.md` 和本仓 Q5 实测切页、刷新及减少动态效果。没有可用浏览器时显式记录「视觉审查未执行（原因）」，不得宣称通过。

### 第 4 步：修复与重验

仅修复规范违规，不重构业务逻辑。运行 `corepack pnpm check`，修复后重新核查受影响条目并截图；技术检查通过不代替视觉/交互验收。清单变更先向用户提反哺建议，不直接改对照页或上游副本。

## 输出报告格式

```markdown
# 审计报告：<模块名>（<日期>）
本审计只覆盖规范符合性，不覆盖功能正确性。
## 对照物
| 页面 | 角色 | chrome | 对照页 | case |
## 分层记录（S 结构 / O 内容根 / N 节外壳 / C 组件）
| 层 | 本层结构 | 对照 | 判定 |
## 结论：<N 条违规（红线 x / 判断 y），已修复 m，建议复核 k>
## 违规明细
| # | 条目 | 严重级 | 证据 | 处置 |
## 对照偏差（相对第 0 步对照页，不是相对 accounts）
## 建议复核（需人工拍板）
## 清单反哺建议
## 重验记录（check / 截图）
```

## 红线

- 不得因文件多而抽查——范围内文件全覆盖
- 不得跳过第 0 步、不得默认 accounts 为全站基线
- 不得从组件层起审；未写「分层记录」不得进入修复结论
- 不得修改对照页源码与清单本身（反哺建议除外，需用户确认后落入清单）
- 修复只做规范对齐，不顺手重构业务逻辑
