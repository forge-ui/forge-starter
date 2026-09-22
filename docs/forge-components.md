# Forge 组件怎么选（Starter 专用）

问题：写业务页时 AI 不知道 Kit 里有什么、该用哪个。  
解法：**本表选型 → 抄 Starter 样板 → monorepo 总表/cases 查 props**。

## 权威入口（有旁路 forge 时优先）

### 表格详情入口约定

`DataTable` 的列由调用方定义，不会默认追加箭头操作列。普通详情通过名称/标题列的数据打开，保持文字样式，支持键盘操作；全页详情与弹窗详情都遵守此约定。重详情参照 accounts 名称列，轻详情链接到当前列表的 `?id=` 状态，并保留筛选参数。

`CellLink` 是带箭头的可选链接单元格，不用于默认名称详情入口。操作列只放编辑、删除等真实业务动作，没有这些动作则省略整列。详见审计清单 C9。

### 组件索引

```text
../forge/docs/for-agents/README.md      ← 总入口
../forge/docs/for-agents/routes.md      ← /cases 路由表
../forge/docs/for-agents/components.md  ← 全量介绍表 + Case 列
```

原稿还在 `../forge-readdy/catalog/`（sync 脚本、codegen）；**Agent 日常读 forge/docs/for-agents**。

## 权威链路（必须按序）

```text
1. 定页面角色          → docs/page-roles.md
2. 本表或 for-agents 选组件
3. 抄 Starter 样板     → accounts、dashboard、`/ref/detail-modal`
4. 查 props            → ../forge/src/app/cases/<name>/page.tsx
5. 仍没有              → FORGE-GAP
```

旁路 monorepo（与 starter 同级）：

| 用途 | 路径 |
|------|------|
| **Agent 组件总入口** | **`../forge/docs/for-agents/README.md`** |
| Skill 铁律 | `../forge/.agents/skills/forge/SKILL.md` |
| 页面模式长文 | `../forge/.agents/skills/forge/references/page-patterns.md` |
| 活文档 | `../forge/src/app/cases/<name>/page.tsx` |
| readdy catalog 原稿 | `../forge-readdy/catalog/forge-components.md` |

**无 `../forge` 时：** 只用本表 + Starter 样板 import 列表；不要猜 Kit API。
## 角色 → 组件包 → Starter 样板 → Case

| 页面/业务意图 | 先用这些组件 | Starter 抄谁 | monorepo case（查 props） |
|---------------|--------------|--------------|---------------------------|
| 列表、管理 | `DataTable` `StatusBadge` `Button`；页头见下行 | `accounts/page` 或官方 wallets/customers | `table` `toolbar` `button-link` |
| 列表页头 + 工具带 | **任选一套**：Starter `h1`+`Breadcrumbs`+`PageTitleActions` 再单行 `ButtonGroup`+`TextField`；**或** Kit `PageTitleToolbarWithAsk` + `Toolbar`/`ToolbarSearchInput`/`ToolbarPillTabs` | 同上 | `toolbar` |
| 筛选条 | 一条工具带，禁止两行 pills。Starter：`ButtonGroup`+`TextField`。官方：`Toolbar`+`ToolbarSearchInput` | 同上 | `tab` `input-field` `toolbar` |
| 新建/编辑弹窗 | `TextField` `TextArea` `SelectOption` + 本仓 `Modal` | `account-form-dialog` | `input-field` `modal` |
| 轻详情（看完回列表） | `StatusBadge` `DescriptionItem` + `Modal` 底栏按钮 | `/ref/detail-modal` + `Modal` + `?id=`（暂无第二业务样板） | `list` `modal` |
| 重详情（档案） | `Breadcrumbs` `StatusBadge` `StatCard` `TabBar` `DataTable` 侧栏字段；页级主次栏 `span` 8+4。主栏内辅栏+图用 `5+7` / `6+6`，不要再套页面 `4+8` | `accounts/[id]` | `grid` `card` `tab` `list` `table` |
| 删除确认 | `ConfirmationDialog` **外包** `Modal`/遮罩 | `accounts/page` 删除 | `modal` |
| 工作台、指标 | `StatCard` `ChartCard` 图表家族 `DataTable`；分栏 `Grid`/`GridItem`（core `≥0.1.13`，默认 12 列 / 16px） | `dashboard` | `card` `chart` `table` `grid` |
| **资源工作台** | `WorkspaceSplit` `FolderNav` `ResourceCard` + `Grid` 卡组 + toast | `/ref/resource-workspace` | `grid` |
| 设置单卡 | 头像菜单三项（资料/改密/系统偏好）用 `Modal` 表单，不要整页；应用管理仍是 collection | `settings-account-dialog`、`settings/apps` | `input-field` `modal` |
| Ask AI | Kit `AskAi`（抽屉 + 全屏 + `sessions`）。composer 用 `PromptBar`，抽屉里必须垫 gutter + `min-w-0`；回复用几组示范问答，按题选用 Agent 组件，不要整页丢 `/cases/agent` 英文 demo。`hideHeader` 时不要传 `AppLayout.askAi` | `ask-ai-entry`、`/ref/agent` | `page-header` `agent` |
| Agent 痕迹 / 任务 / 审批 | `ThinkingTrace` `StreamingAnswer` `ToolChips` `AgentTaskRows` `ApprovalCard` | `/ref/agent` | `agent` |
| Agent 检索 / 建议 / 命令 | `ContextCards` `RecommendationCard` `InsightCards` `CommandSearch` | `/ref/agent` | `agent` |
| Agent 产物 | `AgentDiffTable` `AgentCodeBlock` `AgentFlowchart` `PromptBar` | `/ref/agent` | `agent` |
| 清单 | Kit `Checklist` / `ChecklistItem`（完成沉底；`color={siteConfig.accent}`）。core `0.1.18` 起随包导出。禁止手搓 Checkbox 行 | `/ref/checklist`、`/ref/task` | `checklist` |
| 空态 | 文案 + `Button`；可选 solar 图标 | 各列表 empty | `button-link` |

> **状态呈现纪律**：语义状态用 Kit `StatusBadge`（默认 `variant="soft"`，浅底+细边+同色字）。禁止 `variant="solid"`、`Label`、手搓 pill、本仓 `StatusText`。分类/角色/标签用 `CellText`/`CellMuted`，不要彩虹胶囊。一张表最多一列状态胶囊。
>
> **字色分层**（Forge `--text-*`，审计 V7）：标题 / 实体名 / 主键值 / `CellText` / `DescriptionItem` content → `text-fg-black`；字段 label / `CellMuted` / 副行 → `text-fg-grey-700`；disabled、空态、时间戳才 `text-fg-grey-500`。说明性正文最浅到 `text-fg-grey-700`，不要整页浅灰。
>
> **内容壳 gutter**（审计 L10）：右侧圆角内容面顶/右/底间距等距且锁在首屏（Kit `md:p-2`）。表/正文超高时在面内滚，禁止整页滚动把底边距顶没。

### 不要默认上的（除非业务明确要）

| 组件/能力 | 原因 |
|-----------|------|
| `DataTable.sortable: true` | **不会自动排序**，未实现逻辑=假按钮 |
| 把工具带改成 `Grid` | 一维排列继续 Flex / `Toolbar`；`Grid` 只管页面分栏 |
| `gap={4}` 当 `gap-4` | Grid 的 gap 是像素；页面级用 16 或 24 |
| 自拼 sidebar、topbar | 用本仓 `AppShell`、Kit `AppLayout` |
| Drawer | Kit 可能未导出；先 FORGE-GAP。Ask AI 用 Kit `AskAi`，不要自研抽屉或全屏层 |
| `AppLayout.askAi` + `hideHeader: true` | 顶栏被藏，按钮不会出现；走页头槽 |
| 右下角 Ask 浮钮 | 入口只挂带标题的那条栏右侧 |
| 页面内嵌成功绿条 / 红条 | **禁止**；用全站 `toast`（见下） |
| 两行 `ButtonGroup` | Starter 禁止 |

### 全站 Toast（Starter 内置，非 Kit）

操作成功/失败提示 **不要** 写进页面正文，统一弹层：

```tsx
import { toast } from "@/lib/toast";

toast.success("保存成功");
toast.error("删除失败");
toast.info("请填写名称");
```

- 宿主：`ToastProvider` 已挂在 `components/app-shell.tsx`（登录后页面可用）
- 实现：`lib/toast.ts`（总线）+ `components/ui/toast-provider.tsx`（浮层 UI）
- 底部居中，约 2.6s 自动消失，可点关闭

### 全站 Ask AI（Kit，core ≥0.1.17）

Starter 业务页默认 `hideHeader: true`，所以 **不要** 写 `<AppLayout askAi={…} />` 指望顶栏出现按钮。

```tsx
import { PageTitleActions } from "@/components/ask-ai-entry";

<PageTitleActions>
  <Button color={siteConfig.accent}>新建</Button>
</PageTitleActions>
```

- 宿主：`AskAiProvider` 已挂 `AppShell`，换页不卸、对话保住
- 入口：A 紧凑页头用 `PageTitleActions`；无主操作时单独 `<AskAiEntry />`；B 用 `PageTitleToolbarWithAsk`
- 全屏 / 会话：走 Kit 抽屉顶栏全屏钮 + `sessions` / `currentSessionId` / `landingTitle`。core 不读 localStorage，不要另挂全视口层
- 输入：Kit `PromptBar`（模型选择 + 发送）。模型列表来自模型管理里启用且有密钥的条目，发送带 `modelId`；没有可用模型时不画选择器，退本地规则。不要手搓底栏，也不要挂未实现的附件 / Sources / Commands / 语音。抽屉 460px，自定义 `composer` 核心不带 `p-4`，宿主必须自己垫 gutter + `min-w-0`，别把宽栏直接贴边
- 回复：演示走 `AskAiTranscript` 四条中文问答（页面 / 下一步 / 状态 / 权限）。对照页 `/ref/agent` 只看组件，不要把英文 case 原文塞进抽屉
- 发送：`lib/ask-ai.ts` 的 `sendAskAi` → `POST /api/ask-ai`。优先用所选/默认的库内模型，没有再用 `ASK_AI_LLM_*`，都没有走本地规则。不要另做一套抽屉，也不要把 key 放进前端

## 后台常用 import 清单

```tsx
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  ConfirmationDialog,
  DataTable,
  IconButton,
  PlusIcon,
  StatusBadge,
  TextField,
  TextArea,
  SelectOption,
  // 详情/档案按需：
  StatCard,
  TabBar,
  DescriptionItem,
  Grid,
  GridItem,
  type ColumnDef,
} from "@forge-ui-official/core";
// Grid/GridItem：core ≥0.1.13。弹窗/确认层不要放进 Grid 当子节点。
import { Modal } from "@/components/ui/modal";
import { ResourceCard } from "@/components/resource-card";
import { FolderNav, WorkspaceSplit } from "@/components/workspace-split";
import { toast } from "@/lib/toast";
import { PageTitleActions } from "@/components/ask-ai-entry";
import { formatDateOnly, formatTime } from "@/lib/format/datetime";
import { siteConfig } from "@/config/site";
// color={siteConfig.accent}
// toast.success("已保存") — 不要在页面里塞成功横幅
// 资源台：WorkspaceSplit + FolderNav + ResourceCard 网格
```

图标：`solar-icon-set`（菜单 `BoldDuotone` size 20；行内操作 `Linear` size 16）。

## Agent 执行口令（写页面前默念）

1. 这是 **列表、表单弹窗、轻详情、重详情、看板** 哪一种？  
2. 上表对应组件包抄了没有？  
3. Starter 样板文件打开对照了没有？  
4. 不确定的 props 是否打开了 `../forge/src/app/cases/...`？  
5. 没有的组件是否写了 `FORGE-GAP` 而不是 div 手搓？  

## 与 skills 的关系

| Skill | 何时读本文件 |
|-------|----------------|
| `forge-starter-new-page` | **必读** Step 0 |
| `forge-starter-new-module` | 不读（无 UI） |
| `forge-starter-quick-start` | 报告 backlog 时按角色注明建议组件包即可 |

更全的页面模式（日历/聊天/发票等）见 monorepo `page-patterns.md`；Starter 默认 CRUD 用上表足够。
