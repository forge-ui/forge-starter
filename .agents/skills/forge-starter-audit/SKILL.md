---
name: forge-starter-audit
description: 页面规范审计。任何业务页面写完/改完后必须执行：先定角色并选定对照页，再对照 docs/audit-checklist.md 逐条核查 + Forge 组件/token 审查 + 截图，输出违规报告并修复重验。不要默认用 accounts 当唯一基线。审计对象与"是谁、用什么流程写的"无关。
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
2. 规范：`docs/audit-checklist.md`（必须完整读取）。
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
| settings | `settings/*`、`/ref/settings` | `input-field` |
| auth | `app/(auth)` | — |

选 B 时打开 `/cases/toolbar` 与 CRM/Finance 模板页头，**不要**强行对照 accounts 的 h1，也**不要**对照 `/cases/page-header`（那是壳顶栏）。  
核 H6：业务 `page.tsx` 是否 `import { PageHeader }`；有则默认违规，除非清单点名的沉浸式工作台。
轻详情不要去找已删除的 approvals。

报告开头必须写出：`角色 / chrome A|B|C / 对照页 / case`。

## 由外到内（第 1 步之前必须走完，禁止从组件起审）

清单仍要逐条勾，但**取证顺序固定为四层**。先看到「用了 DataTable / Button」就给 C2 过关，是衍生仓详情漏检的根因。

每一层先写「本层看到的 DOM/JSX 结构」再对照第 0 步对照页，再映射到清单条目。外层未过，不要开始内层的「组件用对了吗」。

| 层 | 看什么 | 典型漏检 | 主要映射 |
|----|--------|----------|----------|
| **S 页面结构** | 整页区块顺序是否等于该角色骨架（见 `docs/page-roles.md`）。页头正下方每一块都要能说出「这是什么」 | 详情做成胶囊导航墙；页头下孤飘「进行中」；列表缺工具带或两行 pills | R1 L3 L4 L5 H1 **H7** |
| **O 内容区最外层** | AppLayout 右侧正文根：只应是纵向 stack。禁止第二套壳、根再 `p-6`、整页包白卡、页内 `PageHeader` 冒充标题栏 | 把 Kit `PageHeader` 当内容卡 | L1 L2 H6 |
| **N 节/区块** | 每个 h2 区块的外壳。`DataTable` 节：标题 + 可选 CTA + 表直接落 stack，禁止外套白卡。描述 / History / 文件 / 阶段列表等正文：官方 `Panel`/`rounded-card`，行内用 `ListItem`/`DescriptionItem`，禁止整页宽进度条、禁止手搓 pill 栅格。页面分栏 / 等宽卡组核 **L9**（有 `Grid` 必须用；嵌套栅格相对父列，主栏内不要再套页面 `4+8`；`gap` 是像素） | 表外包白卡；正文列表裸铺长条；一排 secondary Button 当流程；手搓页面栅格；主栏里套整页 4+8 | L6 L7 **L8** **L9** C1 |
| **C 组件** | 选对组件 + props + token。嵌套表也要审，C2 对 detail「不适用」≠ 表免审 | `ProgressStatCard` 画假进度或只重复本页已有字段；`flex` 吃剩宽 | C* V* F* L7 |

截图也按这四层看：先整页骨架，再内容根，再每一节外壳，最后才盯单元格。范围内**每张** `DataTable`（含详情嵌套表）都必须截到并核 L7/L8。

## 流程（四步，缺一不可）

### 第 1 步：清单逐条核查

对范围内每个文件，逐条执行清单 M/R/H/L/C/V/F/D/E/Q 各项。勾条时按上面 S→O→N→C 取证，不要按 C→H 倒着扫。

- 每条输出：`条目ID | 通过/违规/不适用 | 证据（文件:行号）| 修复方案`
- **禁止跳条**，禁止"整体符合规范"式笼统结论
- 🔴 红线违规 → 直接修复；🟡 判断项 → 明显违规直接修，边界情况列入"建议复核"
- 「对齐样板」指第 0 步选定的对照页，不是 accounts

### 第 2 步：Forge 样式对照（抓清单没枚举的问题）

仍按 S→O→N→C。问三件事，不要问「像不像 accounts」：

1. **该用 Forge 组件却手搓了吗？**（页头、搜索、按钮、表格、状态、页面分栏）对照 `/cases/` 与 `docs/forge-components.md`。已导出 `Grid` 却写 `grid-cols-*` → L9。
2. **颜色 / 圆角 / 尺寸 / 字体跑出 `fg-*` 和 Kit case 了吗？**
3. **内容区边距、间距、栅格乱了吗？**（根再 `p-6`、两行 pills、密度忽大忽小、表外套白卡、页面分栏没用 `Grid`）

结构 diff：对照页的 页头 → 工具带/指标 → 各节外壳 → 表/卡内部 → 状态 → 弹窗。每个偏差判定合理业务差异 / 违规。清单未覆盖的新模式 → 报告「清单反哺建议」。

**禁止**：因为用了 `PageTitleToolbar` 就判 H1 违规，或要求改回 accounts 的 h1。

### 第 3 步：截图视觉审查

**截图通道**（按优先级）：① 环境自带的浏览器工具（IDE 内置浏览器 / playwright / puppeteer CLI）直接访问 dev server；② 无头 Chromium 命令行截图（`--headless --screenshot=... --window-size=1440,900 http://127.0.0.1:<port>/<path>`）。**不要**依赖 forge-design 浏览器插件的桥接来截审计页面——它面向用户当前正在看的 Chrome 标签，审计场景下通常截不到目标页。两种通道都不可用时，本步降级为跳过，但必须在报告"重验记录"中显式声明"视觉审查未执行（原因）"，不得静默略过。

1. 确认 dev server 运行（端口与 `AUTH_MODE` 以项目 `.env` / `package.json` 为准，勿凭空假设），浏览器打开被审模块主路径（列表、详情、弹窗打开态）
2. 截图按 S→O→N→C：整页骨架、内容根有没有白卡/PageHeader、每一节外壳、最后才是单元格。范围内每张 `DataTable` 都要截到并核 L7/L8。再看手搓控件、颜色/圆角/字号、卡片对齐/等高、空态/加载态。**指着每一颗 `StatusBadge` 问「这是谁的状态」**（H7）；答不出就修，不得因 V6 用了 `StatusBadge` 就放过。
3. 同时检查 console 与 Next dev overlay（清单 Q4）：本次改动不得新增 console error / React 警告；范围外的既有警告记入"建议复核"
4. 与第 0 步对照页 / case 比视觉印象，不要只跟 accounts 比像素

### 第 4 步：修复与重验

1. 应用全部修复
2. `pnpm check`（typecheck + 绊线）必须通过（包管理器版本以 `package.json` 的 `packageManager` 字段为准，版本不符时用 `corepack pnpm@<版本>` 执行，勿动依赖目录）
3. 重新截图确认视觉问题已消除
4. 修复涉及清单条目的，重跑该条核查确认闭环

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
