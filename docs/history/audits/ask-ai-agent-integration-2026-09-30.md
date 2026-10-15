# 审计报告：Ask AI Agent 组件接入（2026-09-30）

本报告覆盖 Forge 规范符合性，并单列与本次组件接入直接相关的交互和状态检查。它不代替完整业务验收。

**最终结论：本次约定范围通过审计。65 个规范条目已逐一核查，2 项审计发现均已修复；没有未闭环的实现红线。`pnpm check` 和 64/64 项定向测试通过（0 跳过）；真实模型浏览器主路径、历史状态与布局检查通过，console warn/error 均为空。**

代码快照：`794c837`。该提交包含另一聊天的并行变更；本审计仅修改本报告，测试和浏览器动作由主实现者完成，审计者独立复核源码与归档截图。

**用户确认的范围：保留另一聊天正在调整的 Ask AI 展示，只补真实数据接入。当前不恢复 ThinkingTrace、运行中占位和状态汇总；任务条继续在正文播放结束（chromeReady）后显示。这些选择不计为遗漏，也不声称运行中进度已经显示。**

## 对照物与范围

| 被审界面 | 角色 | chrome | 主对照 | case |
| --- | --- | --- | --- | --- |
| 全站 Ask AI 抽屉、全屏和会话 | agent（`docs/page-roles.md:64` 的扩展角色） | A，继承业务页紧凑页头右侧入口；对话内部不重复画业务页头 | `app/(app)/ref/agent/page.tsx:73` | `../forge/src/app/cases/agent/page.tsx:51`；已安装 core 0.3.4 的类型与实现 |
| 对话内预填草稿、确认与续办 | agent 中的交互内容 | 同上 | Ask AI 既有表单及页面确认路径 | 原生 `ApprovalCard`、`PromptBar` 与本仓业务表单宿主 |

直接检查：`components/ask-ai-entry.tsx`、`components/ask-ai-transcript.tsx`、`components/ask-ai-harness.tsx`、`components/ask-ai-presentation.tsx`、`components/ask-ai-form.tsx`、`components/ask-ai-scroll-area.tsx`、`lib/ask-ai.ts`、`lib/ask-ai-playback.ts`、`lib/ask-ai-progress.ts`、`lib/ask-ai-progress-client.ts`、`lib/agent/presentation.ts`、`lib/agent/presentation-tool.ts`、`lib/harness/engine.ts`、`lib/harness/progress.ts`、`lib/harness/starter.ts`、`lib/harness/types.ts`。

依赖取证：`components/app-shell.tsx`、`app/globals.css`、`lib/agent/registry.ts`、`lib/agent/confirm.ts`、`app/api/ask-ai/route.ts`、`app/api/ask-ai/forms/route.ts`、`app/api/ask-ai/runs/route.ts`。菜单、业务 CRUD 详情和对照页没有作为本次改造目标。初始工作区已有未提交改动，整仓 diff 不等于本次新增改动。

## 分层记录

| 层 | 实际 JSX / 数据结构 | 对照与判断 |
| --- | --- | --- |
| S 页面结构 | 业务页右侧唯一 Ask AI 入口 → Kit 抽屉或全屏 → 会话消息 → 输入栏。消息内为用户请求、回答、按请求产生的组件、正文结束后的实际任务条与待交互内容 | 对齐 agent case 的组件职责，按真实回复选择组件；不会把整页英文画廊塞进抽屉。`components/ask-ai-entry.tsx:650`、`components/ask-ai-transcript.tsx:152` |
| O 内容根 | `AskAiProvider` 保活唯一 Kit 实例；消息 `AskAiScrollArea` 使用 `min-h-0`、面内滚动；composer 自带 gutter 和 `min-w-0` | 保留 Kit AskAi 的抽屉与全屏，不增加第二套 AppLayout。`components/app-shell.tsx:256`、`components/ask-ai-scroll-area.tsx:140`、`components/ask-ai-entry.tsx:680`。普通抽屉及宿主首屏 gutter 已由截图确认 |
| N 节外壳 | 纵向消息 stack；原生 Agent 卡片保持自身外形；查询 `DataTable` 直接渲染；等待/取消状态对应各自的步骤 label | 无表外装饰白卡，无页面级自造栅格。`components/ask-ai-transcript.tsx:281`、`components/ask-ai-harness.tsx:31`、`components/ask-ai-presentation.tsx:20` |
| C 组件 | UI 从 core 导入。任务由服务端执行节点产生，呈现数据有 Zod 边界，发送型回调回到现有请求链路 | `AgentTaskRows` 承载 core 支持的真实执行状态；等待和取消以有字段归属的原生 `StatusBadge` 展示。`lib/harness/engine.ts:154`、`components/ask-ai-harness.tsx:33`、`lib/agent/presentation.ts:17` |

## 审计发现与处置

| # | 条目 | 严重级 | 问题与证据 | 处置 |
| --- | --- | --- | --- | --- |
| 1 | C6 | 红线 | 对话草稿与确认未完整继承忙碌/历史禁用。`components/ask-ai-transcript.tsx:278`、`:305`；`components/ask-ai-form.tsx:43` | 已修复：控件 disabled 与回调 guard 双层约束；旧轮表单不再重新出现为可执行操作 |
| 2 | C6 / 状态真实性 | 红线 | 工具事件在真正调用之前写入，不能统一标成功。`lib/harness/engine.ts:185`；`components/ask-ai-harness.tsx:73` | 已修复：普通事件标「已调用」，工具失败标「未完成」，回执标「已核实」 |

源码与浏览器证据已闭环；已知 core 限制和用户确认的展示选择见后文。

## 逐条清单

判定包含当前源码证据及适用的浏览器证据。不适用项均说明本次范围为何不触发该条款。

### M — 信息架构与菜单

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| M1 | 不适用 | `components/ask-ai-entry.tsx:800`，入口仍挂页头槽 | 未新增主菜单或 `/new` 菜单 |
| M2 | 不适用 | `components/app-shell.tsx:266`，沿用 `shellMenuItems` | 未修改菜单图标 |
| M3 | 不适用 | `components/app-shell.tsx:256`，现有 Provider 内扩展 | 未新增业务模块、路由或菜单 id |
| M4 | 不适用 | `components/ask-ai-entry.tsx:818`，入口是挂载槽 | 未新增占位菜单 |
| M5 | 不适用 | `components/app-shell.tsx:266` | 未调整菜单结构 |
| M6 | 不适用 | `components/ask-ai-entry.tsx:818` | 未新增菜单 href |

### R — 路由与页面角色

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| R1 | 通过 | `docs/page-roles.md:64`；`components/ask-ai-entry.tsx:661` | 明确 agent 角色，沿用 AskAi 壳 |
| R2 | 不适用 | `components/ask-ai-transcript.tsx:152` | 本次未建立业务实体详情 |
| R3 | 不适用 | `components/ask-ai-form.tsx:57`、`:61` | 草稿带入现有业务表单，未新增独立 `/new` 或 `/edit` 页 |
| R4 | 不适用 | `components/ask-ai-entry.tsx:567` | 页面操作继续走现有语义表单协议，未增加弹窗深链 |
| R5 | 不适用 | `components/ask-ai-entry.tsx:569` | 未新增兼容 redirect 页 |

### H — 页头与面包屑

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| H1 | 通过 | `components/ask-ai-entry.tsx:827`、`:808` | A/B 入口继续复用唯一 Kit AskAi，没有叠第二套页头 |
| H2 | 不适用 | `components/ask-ai-entry.tsx:841` | 保留宿主业务页已有面包屑，本次不新增 |
| H3 | 不适用 | `components/ask-ai-entry.tsx:800` | 无新增 `[id]` 页面 |
| H4 | 不适用 | `components/ask-ai-entry.tsx:841` | 未改面包屑层级 |
| H5 | 不适用 | `components/ask-ai-transcript.tsx:173` | 无新增全页详情返回动线或侧栏 meta 卡 |
| H6 | 通过 | `components/ask-ai-entry.tsx:794`；`components/ask-ai-harness.tsx:31` | 用 AskAi 与语义节标题，无页内 PageHeader 卡 |
| H7 | 通过 | `components/ask-ai-harness.tsx:34`、`:35` | 等待/取消状态绑定对应步骤 label；没有孤立的状态汇总胶囊 |

### L — 布局与骨架

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| L1 | 通过 | `components/app-shell.tsx:256`、`:258` | 登录壳内唯一 Provider，未新增 sidebar/topbar |
| L2 | 通过 | `components/ask-ai-transcript.tsx:79`；`components/ask-ai-entry.tsx:680` | p-5 是 AskAi 消息内边距；不是业务页根二次 padding |
| L3 | 不适用 | `components/ask-ai-transcript.tsx:152` | agent 对话，不是 collection 筛选列表 |
| L4 | 不适用 | `components/ask-ai-transcript.tsx:152` | 未新增全页详情 |
| L5 | 不适用 | `components/ask-ai-presentation.tsx:26` | 分析卡是消息内容，不是 Dashboard 骨架 |
| L6 | 通过 | `components/ask-ai-presentation.tsx:20`；`components/ask-ai-harness.tsx:31` | 原生组件、gap-3/5；普通抽屉与全屏截图中密度、任务文本换行和 composer gutter 正常 |
| L7 | 通过 | `components/ask-ai-transcript.tsx:281` | 查询表按比例分列、520px 最小宽度；全屏模型表首末列完整，普通抽屉表内横向滚动，不挤压外层 |
| L8 | 通过 | `components/ask-ai-transcript.tsx:281`；`components/ask-ai-presentation.tsx:34` | DataTable 直接渲染；差异表采用原生 AgentDiffTable，无外套白卡 |
| L9 | 通过 | `components/ask-ai-form.tsx:87`；`components/ask-ai-transcript.tsx:364` | 清单/消息一维 Flex；表单和建议组用 Kit Grid |
| L10 | 通过 | `app/globals.css:27`；`components/ask-ai-scroll-area.tsx:140` | 壳锁视口、消息面内滚动；models-page-gutters.png 确认首屏顶/右/底 gutter，drawer-task-results.png 确认抽屉面内滚动 |

### C — 组件用法

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| C1 | 通过 | `components/ask-ai-harness.tsx:4`；`components/ask-ai-presentation.tsx:4` | Agent 和通用控件均从 core 导入，复用既有 toast 与语义适配层 |
| C2 | 不适用 | `components/ask-ai-transcript.tsx:281` | 不是全页 collection；消息查询结果仍用原生 DataTable，继续核 L7/L8 |
| C3 | 通过 | `components/ask-ai-transcript.tsx:284` | 查询结果列未启用假 sortable |
| C4 | 不适用 | `components/ask-ai-transcript.tsx:297`；`lib/agent/confirm.ts:23` | 对话只发起页面确认，未裸用 ConfirmationDialog |
| C5 | 通过 | `components/ask-ai-harness.tsx:35`；`lib/ask-ai-progress.ts:23` | 状态有中文文字，不靠颜色表达 |
| C6 | 通过 | `components/ask-ai-transcript.tsx:278`、`:305`；`components/ask-ai-form.tsx:43`；`components/ask-ai-harness.tsx:73` | 草稿/确认同时在控件和回调拦 disabled；普通工具事件为「已调用」，不会据调用开始声称完成 |
| C7 | 通过 | `components/ask-ai-harness.tsx:35`；`components/ask-ai-presentation.tsx:20` | DescriptionItem 使用 content；对照安装包 types 核全部 Agent props；图表序列有界且校验总量 |
| C8 | 通过 | `node_modules/@forge-ui-official/core/dist/index.d.ts:102`；`components/ask-ai-presentation.tsx:4` | 使用已安装版本真实导出，未引入 Toast/Drawer/Sheet |
| C9 | 不适用 | `components/ask-ai-transcript.tsx:288` | 此处为只读查询表，没有独立详情接口或重复查看操作列；导航仍走现有页面动作 |
| C10 | 不适用 | `components/ask-ai-presentation.tsx:26` | 未新增详情指标卡 |

### V — 视觉 token

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| V1 | 通过 | `components/ask-ai-harness.tsx:31`；`components/ask-ai-presentation.tsx:63` | 本次接入仅 fg token，无默认色和新裸 hex |
| V2 | 通过 | `components/ask-ai-entry.tsx:652`；`components/ask-ai-presentation.tsx:66` | 业务控件使用 siteConfig.accent；原生 Agent 组件继承壳主题 |
| V3 | 通过 | `components/ask-ai-harness.tsx:4`；`components/ask-ai-presentation.tsx:4` | 本次未手写新图标，继续使用 core 自带 solar 图标 |
| V4 | 通过 | `lib/agent/presentation.ts:10`；`components/ask-ai-presentation.tsx:26` | 分析图使用 core tone 枚举，不接受任意颜色 |
| V5 | 通过 | `components/ask-ai-harness.tsx:32`；`components/ask-ai-presentation.tsx:64` | 对话节标题使用 Kit 字号体系；全屏与普通抽屉截图中标题层级一致 |
| V6 | 通过 | `components/ask-ai-harness.tsx:35`；`lib/ask-ai-progress.ts:23` | 等待黄、失败红、取消灰；StatusBadge 默认 soft。AgentTaskRows 的原生执行行不改成自造胶囊 |
| V7 | 通过 | `components/ask-ai-harness.tsx:32`、`:33`；`components/ask-ai-presentation.tsx:64` | 标题黑、说明 grey-700；执行行重要 meta 使用 grey-700，抽屉截图中任务名与说明清晰；历史 disabled 清单按禁用态降弱 |

### F — 表单与交互 surface

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| F1 | 通过 | `components/ask-ai-form.tsx:57`、`:61`；`components/ask-ai-entry.tsx:567` | 对话草稿先校验，再填现有页面表单；实际保存沿用业务表单宿主 |
| F2 | 通过 | `lib/agent/confirm.ts:15`、`:25`；`components/ask-ai-entry.tsx:574` | 删除只生成页面确认，带权限和版本校验；呈现组件不能直接删库 |
| F3 | 通过 | `components/ask-ai-form.tsx:43`、`:88`；`components/ask-ai-harness.tsx:117` | 文本校验落字段；多选错误落当前选择控件旁 |
| F4 | 通过 | `components/ask-ai-entry.tsx:577`、`:602`；`components/ask-ai-transcript.tsx:352` | 动作结果使用全站 toast；消息中的任务状态是协议状态，不是伪保存成功绿条 |
| F5 | 不适用 | `components/ask-ai-entry.tsx:567` | 本次未改业务创建成功后的详情形态 |
| F6 | 通过 | `components/ask-ai-entry.tsx:794` | 抽屉、全屏均由 Kit AskAi 提供，无自研 Drawer/Sheet |

### D — 数据与状态

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| D1 | 不适用 | `components/ask-ai-transcript.tsx:162`；`components/ask-ai-entry.tsx:685` | 非 collection。对话已有等待、失败、恢复重试与无建议提示，不伪造列表三态 |
| D2 | 不适用 | `components/ask-ai-transcript.tsx:152` | 未新增全页详情 |
| D3 | 通过 | `lib/harness/engine.ts:99`、`:154`；`lib/agent/presentation-tool.ts:10` | 任务来自服务端 checkpoint；呈现只返回 JSON；业务保存仍由原 service/API 路径负责 |
| D4 | 不适用 | `lib/harness/types.ts:29` | 在既有 JSON 运行记录增任务字段，未混入 users 或新增业务表 |
| D5 | 不适用 | `components/ask-ai-entry.tsx:650` | 会话选择、阅读展开属于临时对话 UI 状态，未新增可分享列表筛选 |
| D6 | 通过 | `app/api/ask-ai/route.ts:51`；`lib/harness/progress.ts:31`；`lib/harness/engine.ts:241` | 请求拒收 apiKey；公开任务去掉 interactionId；异常不持久化原始供应商/数据库错误 |

### E — 工程组织

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| E1 | 通过 | `components/ask-ai-presentation.tsx:12`；`lib/harness/progress.ts:1`；`lib/agent/presentation.ts:1` | UI、JSON schema、执行协议、任务投影分离；未新增臃肿 page.tsx |
| E2 | 通过 | `app/api/ask-ai/route.ts:40`；`app/api/ask-ai/runs/route.ts:6`；`app/api/ask-ai/forms/route.ts:12` | requireSession、Zod、jsonOk/jsonError/apiError 和中文失败文案 |
| E3 | 通过 | `components/ask-ai-harness.tsx:25`；`lib/ask-ai-progress.ts:23` | 任务状态与任务解析统一；消息组件仍按协议分派，未为每种模型复制 UI |
| E4 | 通过 | `components/ask-ai-harness.tsx:1`；`components/ask-ai-presentation.tsx:1`；`components/ask-ai-entry.tsx:1` | client 标记对应真实 hook、输入、选择和回调 |

### Q — 交付验证

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| Q1 | 通过 | `package.json:16`；见重验记录 | 主实现者最终 pnpm check 通过；15 条既有 ref 画廊警告另记 |
| Q2 | 通过 | `components/ask-ai-entry.tsx:661`；见浏览器证据表 | 复用已运行 Chrome，真实查询、多选续办、差异提交、历史浏览和关闭重开均完成；归档截图已独立复核 |
| Q3 | 通过 | 本报告「对照物」「分层记录」；`app/(app)/ref/agent/page.tsx:73` | 对照 agent 角色，未拿 accounts 当全站基线 |
| Q4 | 通过 | 浏览器 `testTab.dev.logs` 的 warn/error 均为空；本轮归档截图无 Next 错误 overlay | 主实现者在独立验证标签页取证，未发现新增 console error 或 React 警告 |

## 组件接入核对

| Core 组件 | 真实数据和交互证据 | 审查结果 |
| --- | --- | --- |
| AskAi / PromptBar | `components/ask-ai-entry.tsx:650`，会话、模型和请求链路 | 继续复用同一实例和输入栏；真实发送、全屏/抽屉切换、关闭重开同会话通过 |
| StreamingAnswer | `components/ask-ai-transcript.tsx:242`，真实回答绑定 delivery | 真实回答播放结束后显示任务与工具，历史静态展示，追问回 onAsk；浏览器路径通过 |
| ThinkingTrace | `components/ask-ai-transcript.tsx:160`，当前助手正文入口 | 用户确认保留另一聊天的展示调整，当前不挂载此组件；本次不恢复 |
| ToolChips | `components/ask-ai-harness.tsx:54`，调用事件与回执 | 普通调用为「已调用」，失败和回执分别为「未完成」「已核实」 |
| AgentTaskRows | `lib/harness/engine.ts:154`、`:163`、`:177`；`components/ask-ai-harness.tsx:25` | context/model/tool 实际开始与完成创建 checkpoint；等待/取消保留自己的语义 |
| ApprovalCard | `components/ask-ai-harness.tsx:93`；`lib/harness/engine.ts:83` | 多选模型配置与角色配置后继续同一任务，真实返回模型 2 条、角色 4 条；绑定版本和 interaction，服务端拒绝重复/越界/混合提交 |
| Checklist / ChecklistItem | `components/ask-ai-presentation.tsx:43` | 任务勾选按消息保存；历史两项均 checked 且 disabled，提交按钮 disabled；「已核对」确认不持久化，勾选不当作业务执行成功 |
| RecommendationCard | `components/ask-ai-presentation.tsx:22` | 主方案与替代方案各发送对应请求，统一标待核对 |
| InsightCards | `components/ask-ai-presentation.tsx:26`；`lib/agent/presentation.ts:12` | spark/bars/segments 原生图表；历史继续浏览但不重发追问 |
| AgentDiffTable | `components/ask-ai-presentation.tsx:34` | 提交差异带 columns 字段含义；回到工具核对链路 |
| AgentCodeBlock | `components/ask-ai-presentation.tsx:32` | 只读配置与 diff 浏览，无执行能力 |
| ContextCards | `components/ask-ai-presentation.tsx:31` | 本轮来源摘要，由 schema 限定；没有任意 HTML 或执行链接 |
| CommandSearch | `components/ask-ai-presentation.tsx:29` | 选项精确映射 question 后发送 |
| AgentFlowchart | `components/ask-ai-presentation.tsx:33`；`lib/agent/presentation.ts:31` | 原生节点选择；拒绝指向不存在节点的边 |

## 浏览器证据

浏览器动作由主实现者执行，复用已运行 Chrome 的独立验证标签；本审计子任务仅查看截图，未并发操作浏览器。真实模型已通过已登记工具查询模型、角色和权限，并返回呈现 JSON。

| 路径 | 实际行为与结果 | 图片 |
| --- | --- | --- |
| 查询表 | 真实模型清单的名称、供应商、模型、状态和默认列完整，无末列截断，无表外额外装饰卡 | `tmp/ask-ai-agent-integration-2026-09-30/models-table.png` |
| 清单 | 勾选两项并提交，后续请求包含两项名称；稳定历史中两项 checked、控件与提交按钮 disabled；「已核对」未 checked，不声称该确认持久化 | `tmp/ask-ai-agent-integration-2026-09-30/checklist-history-stable.png` |
| 分析卡 | 当前轮点击下一张切至「已配置角色」2/2，图表与追问入口可见；历史轮仍能从模型 1/2 切至角色 2/2，DOM 确认无追问发送按钮 | `tmp/ask-ai-agent-integration-2026-09-30/insights-live.png` |
| 流程 | 点击「核对模型」，选中边框改变，主实现者确认 Selected 核对模型 | `tmp/ask-ai-agent-integration-2026-09-30/flow-selected.png` |
| 非空差异 | 原有 remove 行 legacy 被取消后显示 0 removals / 1 addition；提交仅发送 label 行和 columns 字段含义，未直接保存 | `tmp/ask-ai-agent-integration-2026-09-30/diff-selected.png` |
| 代码 Diff | 从 Code 点击 Diff，出现 label 新增和 legacy 删除，计数 +1/-1 | 同上；早期 `code-diff.png` 是空差异样例，不作为增删选择证据 |
| 命令搜索 | 输入「审计」只剩一项，点击发送「审计角色具体有哪些权限？」；模型随后返回真实权限表 | 主实现者 DOM 与实际交互记录 |
| ApprovalCard | 多选「模型配置、角色配置」后提交；同一任务续办返回模型 2 条、角色 4 条，确认范围及两项查询均 Completed | `tmp/ask-ai-agent-integration-2026-09-30/approval-selected.png`、`approval-result.png` |
| 普通抽屉与会话保留 | 确认范围含「已收到你的选择」，查询模型/角色完成；ToolChips 为 2 个工具调用、1 条消息，标签「已调用」；关闭重开同会话结果保留 | `tmp/ask-ai-agent-integration-2026-09-30/drawer-task-results.png` |
| 宿主布局 | 侧栏展开、Ask AI 关闭时，模型页首屏顶/右/底 gutter 均保留，面内滚动 | `tmp/ask-ai-agent-integration-2026-09-30/models-page-gutters.png` |

## 对照偏差与已知限制

1. Kit case 是展廊；真实 Ask AI 按请求呈现内容，不并排铺满所有组件。这是合理业务差异。
2. 原生 `AgentTaskRows` 只支持 running/completed/failed。等待用户、等待页面与取消状态使用 `DescriptionItem` + soft `StatusBadge`，不伪装成执行中或成功。
3. 正文 POST 仍一次返回完整 JSON。只读 GET 可按当前请求、revision 每 1.5 秒读取 checkpoint，停止后清理且不执行 fill/navigation；按用户确认的展示范围，当前界面不消费运行中的 progress，任务条只在 chromeReady 后出现。数据通道就绪不能写成运行中进度已展示。证据：`lib/ask-ai-progress-client.ts:13`、`components/ask-ai-entry.tsx:301`、`components/ask-ai-transcript.tsx:186`、`lib/harness/starter.ts:209`。
4. core 0.3.4 部分 Agent 辅助文案为英文。`AgentDiffTable` 原生差异行只提供鼠标选择，没有键盘选择接口；消费端不复制一套表格。核心能力限制单列，不能声称全键盘覆盖。
5. ThinkingTrace 和运行中占位当前不挂载，任务状态汇总未恢复；这是用户明确确认的展示选择。本次数据接入不覆盖另一聊天的展示调整。
6. 单选继续用原有即时选择按钮；ApprovalCard 用于明确提交的多选，避免当前 core radio 回调读取旧答案的问题。组件接入并不意味着所有 props 都要在同一业务路径使用。

## 建议复核

- core 的英文辅助文案、差异行键盘选择和 radio 提交行为适合在组件库内统一完善。本次使用原生组件与既有适配，未复制局部实现。
- 15 条既有 ref 画廊绊线警告属于本次范围外；未据此扩大修改。

## 清单反哺建议

- 在页面角色主表明确补充 agent，避免对话 surface 被误归为 collection 或 form-page。
- 为 agent 增加「执行记录必须由工具/回执产生」「历史控件不重新执行」「确认只授权声明的动作」「恢复不重放页面副作用」检查项。
- 为代码、来源、流程、分析卡分别区分只读浏览和发送动作，避免简单 disabled 整块导致历史内容无法阅读。

以上为建议，未修改规范清单或对照页。

## 重验记录

| 项目 | 当前记录 |
| --- | --- |
| 完整规范与角色取证 | 已读 audit skill、audit-checklist、page-roles、forge-components、product、agent-native、module-template，以及本仓 ref/agent、旁路 cases/agent 和安装包类型 |
| 静态范围 | 所列 Ask AI UI 与协议文件逐一检查，65 个条目均有单独判定 |
| pnpm check | 主实现者执行通过（typecheck + 规范绊线）；15 条既有 ref 画廊警告，本次未扩大修复范围 |
| 协议/任务/播放测试 | 主实现者在隔离 PostgreSQL 环境执行 64/64 通过、0 跳过：`node scripts/semantic-test-env.mjs node --import tsx --test --test-concurrency=1 tests/harness/{engine,progress,starter,store,operations,presentation}.test.ts tests/ask-ai/*.test.ts` |
| 浏览器路径与截图 | 真实查询、清单提交/历史禁用、分析卡历史浏览、命令搜索、流程选择、非空差异、多选续办、全屏/抽屉与会话保留均完成；审计者已查看归档截图 |
| console / Next overlay | 主实现者浏览器 `testTab.dev.logs` 检查 warn/error=[]；审计者独立查看归档截图，无 Next 错误 overlay |
| 修复闭环 | C6 交互禁用与 ToolChips 用语已复核；Q1–Q4 已闭环；没有未完成的本次审计项 |
