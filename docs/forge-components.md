# Forge 组件接入（Starter 适配）

通用选型唯一正文：[forge-skill](https://github.com/forge-ui/forge/tree/main/skills/forge-skill)。版本同步入口见 [forge-skill/README.md](forge-skill/README.md)，同步后正文在 `forge-skill/upstream/SKILL.md`。先定角色与主 Screen，再选 Blocks / Components，最后查安装包声明和主仓 cases。

## Starter 接线入口

角色与路由统一见 [page-roles.md](page-roles.md)、[reference-pages.md](reference-pages.md)，不在此维护第二份模板对照表。

| 接入点 | Starter 约定 |
|---|---|
| 页面壳 | 复用 `components/app-shell.tsx`；业务控件 `color={siteConfig.accent}` |
| 图标 | Solar，唯一入口 `@forge-ui-official/core/icons` |
| 表单与轻详情 | 既有 `components/ui/modal.tsx`；轻详情以 `?id=` 保留筛选上下文 |
| 删除确认 | core `ConfirmationDialog` 受控 `open` / `onOpenChange` 独立使用；省略 open 的内联模式才需要已有 Modal 宿主 |
| 资源台 | `WorkspaceSplit` / `FolderNav` / `ResourceCard` 是本仓适配，不是 core 根导出 |
| 时间 | `lib/format/datetime.ts`，客户端安全 |

涉及 Ask AI 的原接线表本轮保留，交由任务 A 维护：

| 场景 | 约定 | Starter 入口 | Kit case |
|---|---|---|---|
| 列表页头 + 工具带 | Kit `PageTitleToolbar`，`actions` 内放 `ToolbarActions` + `AskAiEntry` + 业务按钮；单行工具带用 `ButtonGroup`+`TextField` 或 `Toolbar`/`ToolbarSearchInput` | 同上 | `toolbar` |
| Ask AI | Kit `AskAi`（抽屉 + 全屏 + `sessions`）。composer 用 `ChatInputBar`，抽屉里必须垫 gutter + `min-w-0`；回复用几组示范问答，按题选用 Agent 组件，不要整页丢 `/cases/agent` 英文 demo。`hideHeader` 时不要传 `AppLayout.askAi` | `ask-ai-entry`、`/ref/agent` | `page-header` `agent` |
| Agent 痕迹 / 任务 / 审批 | `ThinkingTrace` `StreamingAnswer` `ToolChips` `AgentTaskRows` `ApprovalCard` | `/ref/agent` | `agent` |
| Agent 检索 / 建议 / 命令 | `ContextCards` `RecommendationCard` `InsightCards` `CommandSearch` | `/ref/agent` | `agent` |
| Agent 产物 | `AgentDiffTable` `AgentCodeBlock` `AgentFlowchart` `ChatInputBar` | `/ref/agent` | `agent` |

core 0.4.7 已导出 `Modal`、`Drawer`、`ToastProvider` / `useToast`。本地宿主是既有集成选择，不是缺能力；不要围绕受控确认重复套遮罩，不在业务页另挂 ToastProvider。语义状态保留 Kit `StatusBadge` 默认 soft；分类/角色保持文字，一表最多一列状态胶囊。

以下涉及 Ask AI 的旧表项冻结给任务 A，Drawer 导出判断已被上一段的 0.4.7 事实替代，不作当前通用选型依据：

| 原表项 | 冻结内容 |
|---|---|
| Drawer | Kit 可能未导出；先 FORGE-GAP。Ask AI 用 Kit `AskAi`，不要自研抽屉或全屏层 |

## 全站 Toast

沿用 `import { toast } from "@/lib/toast"`，调用 `toast.success/error/info(...)`。宿主在 AppShell，实现在 `lib/toast.ts` 与 `components/ui/toast-provider.tsx`；不要页内成功横幅。

### 全站 Ask AI（Kit，core ≥0.1.17）

Starter 业务页默认 `hideHeader: true`，所以 **不要** 写 `<AppLayout askAi={…} />` 指望顶栏出现按钮。

```tsx
import { PageTitleToolbar, ToolbarActions, Breadcrumbs, Button } from "@forge-ui-official/core";
import { AskAiEntry } from "@/components/ask-ai-entry";

<PageTitleToolbar
  title="账号管理"
  breadcrumbs={<Breadcrumbs color={siteConfig.accent} items={[{ label: "工作台", href: "/dashboard/" }, { label: "账号管理" }]} />}
  actions={<ToolbarActions><AskAiEntry /><Button color={siteConfig.accent} onClick={openCreate}>新建</Button></ToolbarActions>}
/>
```

- 宿主：`AskAiProvider` 已挂 `AppShell`，换页不卸、对话保住
- 入口：业务页统一直接使用 core `PageTitleToolbar`，`actions` 放 `ToolbarActions` + `AskAiEntry` + 业务按钮。`breadcrumbs` 放 Kit `Breadcrumbs`；当前预设模式没有入口插槽，采用仍受支持的组合接口保留全局 Ask AI 实例。不要逐页传 `askAi` 创建新实例。工作台与参考页仍可单独挂 `AskAiEntry`。
- 全屏 / 会话：走 Kit 抽屉顶栏全屏钮 + `sessions` / `currentSessionId` / `landingTitle`。core 不读 localStorage，不要另挂全视口层
- 输入：Kit `ChatInputBar`（模型选择 + 发送）。模型列表来自模型管理里启用且有密钥的条目，发送带 `modelId`；没有可用模型时不画选择器，退本地规则。不要手搓底栏，也不要挂未实现的附件 / Sources / Commands / 语音。core ≥0.4.6 通过 `panelMode="responsive"` + `onDockedChange` 在 ≥1440px 时并排，稳定宿主仅在 docked 时给业务壳预留右侧 460px；窄屏仍由 Kit 管理模态抽屉，不能只隐藏遮罩。`headerLayout="session"` 以会话标题领头，右侧提供新建、全屏和关闭。空会话使用 `landingTitle` + `landingDescription`，无推荐问题时也保留欢迎区。抽屉 460px，自定义 `composer` 核心不带 `p-4`，宿主必须自己垫 gutter + `min-w-0`，别把宽栏直接贴边
- 回复：演示走 `AskAiTranscript` 四条中文问答（页面 / 下一步 / 状态 / 权限）。对照页 `/ref/agent` 只看组件，不要把英文 case 原文塞进抽屉
- 终止（core ≥0.3.5）：`ChatInputBar status="running"` + `onStop`，覆盖等待响应和文字播放阶段；停止时取消当前请求及进度读取，并将回复 delivery 设为 stopped。
- 发送：`lib/ask-ai.ts` 的 `sendAskAi` → `POST /api/ask-ai`。优先用所选/默认的库内模型，没有再用 `ASK_AI_LLM_*`，都没有走本地规则。不要另做一套抽屉，也不要把 key 放进前端


## 检查入口

通用检查引用主仓唯一清单；Starter 差异见 [audit-checklist.md](audit-checklist.md)。执行 `.agents/skills/forge-starter-audit/SKILL.md`；技术检查不能代替浏览器验收。

### ChatInputBar 0.4.1 快捷操作

Ask AI 在侧栏和全屏都传入同一组业务快捷卡片。由 Kit `defaultQuickActionsOpen` + `hasMessages` 管理：空会话默认展开，发送后收起，加号菜单可以重新展开；切换会话时用会话 ID 重置 composer。

快捷动作配置包含 `kind`（Kit 内建动效插画）、`placeholder` 和本地 `instruction`。选择卡片只改变可移除标签和提示语，不改用户草稿；`onSend(message, action)` 由 `composeActionMessage` 按本地动作 ID 生成提问，再进入原发送链路，长度校验包括动作提示与附件。未知动作不附加提示，失败重试不重复附加。卡片不是授权或直接写入入口，权限、确认、取消与工具白名单仍由原服务端执行。

模型和权限菜单继续使用真实配置；没有生图、语音或日程服务时不展示这些动作。中文输入、空白区聚焦、卡片动效与 reduced-motion 由 core 提供。

### core 0.4.3 上下文对象

`ComposerSource.kind` 支持 agent / skill / tool；选中后显示可移除动态标签，`avatarSrc` 用于智能体头像。`onSend(message, quickAction, context)` 的 context.sources 必须按当前可用对象 id 校验，再接回原发送处理器；选中本身不执行操作。未指定 kind 的存量来源继续插入 @ 文本。Starter / Dataset Ask AI 的候选工具来自服务端原有注册表和权限过滤；不得提供不存在或未授权的技能。
