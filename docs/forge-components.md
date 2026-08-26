# Forge 组件怎么选（Starter 专用）

问题：写业务页时 AI 不知道 Kit 里有什么、该用哪个。  
解法：**本表选型 → 抄 Starter 样板 → monorepo 总表/cases 查 props**。

## 权威入口（有旁路 forge 时优先）

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
3. 抄 Starter 样板     → accounts、approvals、dashboard
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
| 列表、管理 | `DataTable` `Button` `ButtonGroup` `TextField` `StatusText`(本仓) `Breadcrumbs` `IconButton` `PlusIcon` | `accounts/page` `approvals/page` | `table` `tab` `toolbar` `button-link` |
| 筛选条 | **单行** `ButtonGroup` + `TextField`（搜索） | 同上 | `tab` `input-field` |
| 新建/编辑弹窗 | `TextField` `TextArea` `SelectOption` + 本仓 `Modal` | `account-form-dialog` `approval-form-dialog` | `input-field` `modal` |
| 轻详情（看完回列表） | `StatusText`(本仓) `DescriptionItem`/`字段行` + `Modal` 底栏按钮 | `approval-detail-dialog` | `list` `modal` |
| 重详情（档案） | `Breadcrumbs` `StatusText`(本仓) `StatCard` `TabBar` `DataTable` 侧栏字段 | `accounts/[id]` | `page-header` `card` `tab` `list` `table` |
| 删除确认 | `ConfirmationDialog` **外包** `Modal`/遮罩 | `accounts/page` 删除 | `modal` |
| 工作台、指标 | `StatCard` `ChartCard` 图表家族 `DataTable` | `dashboard` | `card` `chart` `table` |
| **资源工作台** | `WorkspaceSplit` `FolderNav` `ResourceCard` 网格 + toast | `/ref/resource-workspace` | starter 组件 |
| 设置单卡 | `TextField` `Button` 窄卡片 | `settings/profile` 等 | `input-field` |
| 空态 | 文案 + `Button`；可选 solar 图标 | 各列表 empty | `button-link` |

> **状态呈现纪律**：彩色胶囊（`StatusBadge`/`Label`）在业务页已弃用（绊线拦截）。状态字段一律用本仓 `components/ui/status-text.tsx` 的 `StatusText` 纯文本（props 与 `StatusBadge` 同形：red=危险红字、grey=失效灰字、其余黑字）；分类/角色/标签用 `CellText`/`CellMuted`。禁止彩虹胶囊与手搓底色 pill。

### 不要默认上的（除非业务明确要）

| 组件/能力 | 原因 |
|-----------|------|
| `DataTable.sortable: true` | **不会自动排序**，未实现逻辑=假按钮 |
| 自拼 sidebar、topbar | 用本仓 `AppShell`、Kit `AppLayout` |
| Drawer | Kit 可能未导出；先 FORGE-GAP |
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
  TextField,
  TextArea,
  SelectOption,
  // 详情/档案按需：
  StatCard,
  TabBar,
  DescriptionItem,
  type ColumnDef,
} from "@forge-ui-official/core";
import { Modal } from "@/components/ui/modal";
import { StatusText } from "@/components/ui/status-text"; // 状态字段纯文本（彩色胶囊已弃用）
import { ResourceCard } from "@/components/resource-card";
import { FolderNav, WorkspaceSplit } from "@/components/workspace-split";
import { toast } from "@/lib/toast";
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
