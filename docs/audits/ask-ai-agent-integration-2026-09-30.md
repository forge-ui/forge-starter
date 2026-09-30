# 审计报告：Ask AI Agent 组件接入（2026-09-30）

本报告覆盖 Forge 规范符合性，并单列与本次组件接入直接相关的交互和状态检查。它不代替完整业务验收。

**当前阶段：静态审计、`pnpm check` 和 57 项隔离数据库/协议测试已通过；浏览器主路径、截图和 console 仍在收尾，尚未给出最终通过结论。**

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
| S 页面结构 | 业务页右侧唯一 Ask AI 入口 → Kit 抽屉或全屏 → 会话消息 → 输入栏。消息内为用户请求、回答、按请求产生的组件、正文结束后的实际任务条与待交互内容 | 对齐 agent case 的组件职责，按真实回复选择组件；不会把整页英文画廊塞进抽屉。`components/ask-ai-entry.tsx:628`、`components/ask-ai-transcript.tsx:152` |
| O 内容根 | `AskAiProvider` 保活唯一 Kit 实例；消息 `AskAiScrollArea` 使用 `min-h-0`、面内滚动；composer 自带 gutter 和 `min-w-0` | 保留 Kit AskAi 的抽屉与全屏，不增加第二套 AppLayout。`components/app-shell.tsx:256`、`components/ask-ai-scroll-area.tsx:140`、`components/ask-ai-entry.tsx:658`。首屏 gutter 仍需浏览器确认 |
| N 节外壳 | 纵向消息 stack；原生 Agent 卡片保持自身外形；查询 `DataTable` 直接渲染；等待/取消状态对应各自的步骤 label | 无表外装饰白卡，无页面级自造栅格。`components/ask-ai-transcript.tsx:281`、`components/ask-ai-harness.tsx:22`、`components/ask-ai-presentation.tsx:20` |
| C 组件 | UI 从 core 导入。任务由服务端执行节点产生，呈现数据有 Zod 边界，发送型回调回到现有请求链路 | `AgentTaskRows` 承载 core 支持的真实执行状态；等待和取消以有字段归属的原生 `StatusBadge` 展示。`lib/harness/engine.ts:154`、`components/ask-ai-harness.tsx:24`、`lib/agent/presentation.ts:17` |

## 逐条清单

判定中的「通过」是当前源码证据；需要视觉证据的条目在处置栏保留待验。Q2/Q4 的「违规（待验证）」表示交付证据尚未齐备，不能据此声称执行失败。

### M — 信息架构与菜单

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| M1 | 不适用 | `components/ask-ai-entry.tsx:771`，入口仍挂页头槽 | 未新增主菜单或 `/new` 菜单 |
| M2 | 不适用 | `components/app-shell.tsx:266`，沿用 `shellMenuItems` | 未修改菜单图标 |
| M3 | 不适用 | `components/app-shell.tsx:256`，现有 Provider 内扩展 | 未新增业务模块、路由或菜单 id |
| M4 | 不适用 | `components/ask-ai-entry.tsx:789`，入口是挂载槽 | 未新增占位菜单 |
| M5 | 不适用 | `components/app-shell.tsx:266` | 未调整菜单结构 |
| M6 | 不适用 | `components/ask-ai-entry.tsx:789` | 未新增菜单 href |

### R — 路由与页面角色

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| R1 | 通过 | `docs/page-roles.md:64`；`components/ask-ai-entry.tsx:639` | 明确 agent 角色，沿用 AskAi 壳 |
| R2 | 不适用 | `components/ask-ai-transcript.tsx:152` | 本次未建立业务实体详情 |
| R3 | 不适用 | `components/ask-ai-form.tsx:57`、`:61` | 草稿带入现有业务表单，未新增独立 `/new` 或 `/edit` 页 |
| R4 | 不适用 | `components/ask-ai-entry.tsx:547` | 页面操作继续走现有语义表单协议，未增加弹窗深链 |
| R5 | 不适用 | `components/ask-ai-entry.tsx:549` | 未新增兼容 redirect 页 |

### H — 页头与面包屑

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| H1 | 通过 | `components/ask-ai-entry.tsx:797`、`:779` | A/B 入口继续复用唯一 Kit AskAi，没有叠第二套页头 |
| H2 | 不适用 | `components/ask-ai-entry.tsx:812` | 保留宿主业务页已有面包屑，本次不新增 |
| H3 | 不适用 | `components/ask-ai-entry.tsx:771` | 无新增 `[id]` 页面 |
| H4 | 不适用 | `components/ask-ai-entry.tsx:812` | 未改面包屑层级 |
| H5 | 不适用 | `components/ask-ai-transcript.tsx:173` | 无新增全页详情返回动线或侧栏 meta 卡 |
| H6 | 通过 | `components/ask-ai-entry.tsx:765`；`components/ask-ai-harness.tsx:22` | 用 AskAi 与语义节标题，无页内 PageHeader 卡 |
| H7 | 通过 | `components/ask-ai-harness.tsx:25`、`:26` | 等待/取消状态绑定对应步骤 label；没有孤立的状态汇总胶囊 |

### L — 布局与骨架

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| L1 | 通过 | `components/app-shell.tsx:256`、`:258` | 登录壳内唯一 Provider，未新增 sidebar/topbar |
| L2 | 通过 | `components/ask-ai-transcript.tsx:79`；`components/ask-ai-entry.tsx:658` | p-5 是 AskAi 消息内边距；不是业务页根二次 padding |
| L3 | 不适用 | `components/ask-ai-transcript.tsx:152` | agent 对话，不是 collection 筛选列表 |
| L4 | 不适用 | `components/ask-ai-transcript.tsx:152` | 未新增全页详情 |
| L5 | 不适用 | `components/ask-ai-presentation.tsx:26` | 分析卡是消息内容，不是 Dashboard 骨架 |
| L6 | 通过（静态） | `components/ask-ai-presentation.tsx:20`；`components/ask-ai-harness.tsx:22` | 原生组件、gap-3/5；密度与窄屏视觉待截图 |
| L7 | 通过（静态） | `components/ask-ai-transcript.tsx:281` | 查询表按比例分列、520px 最小宽度，无 flex 抢剩宽；首末列待浏览器截图 |
| L8 | 通过 | `components/ask-ai-transcript.tsx:281`；`components/ask-ai-presentation.tsx:34` | DataTable 直接渲染；差异表采用原生 AgentDiffTable，无外套白卡 |
| L9 | 通过 | `components/ask-ai-form.tsx:87`；`components/ask-ai-transcript.tsx:364` | 清单/消息一维 Flex；表单和建议组用 Kit Grid |
| L10 | 通过（静态） | `app/globals.css:27`；`components/ask-ai-scroll-area.tsx:140` | 壳锁视口、消息面内滚动；首屏顶/右/底 gutter 待浏览器确认 |

### C — 组件用法

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| C1 | 通过 | `components/ask-ai-harness.tsx:4`；`components/ask-ai-presentation.tsx:4` | Agent 和通用控件均从 core 导入，复用既有 toast 与语义适配层 |
| C2 | 不适用 | `components/ask-ai-transcript.tsx:281` | 不是全页 collection；消息查询结果仍用原生 DataTable，继续核 L7/L8 |
| C3 | 通过 | `components/ask-ai-transcript.tsx:284` | 查询结果列未启用假 sortable |
| C4 | 不适用 | `components/ask-ai-transcript.tsx:297`；`lib/agent/confirm.ts:23` | 对话只发起页面确认，未裸用 ConfirmationDialog |
| C5 | 通过 | `components/ask-ai-harness.tsx:26`；`lib/ask-ai-progress.ts:23` | 状态有中文文字，不靠颜色表达 |
| C6 | 通过 | `components/ask-ai-transcript.tsx:278`、`:305`；`components/ask-ai-form.tsx:43`；`components/ask-ai-harness.tsx:62` | 草稿/确认同时在控件和回调拦 disabled；普通工具事件为「已调用」，不会据调用开始声称完成 |
| C7 | 通过 | `components/ask-ai-harness.tsx:26`；`components/ask-ai-presentation.tsx:20` | DescriptionItem 使用 content；对照安装包 types 核全部 Agent props；图表序列有界且校验总量 |
| C8 | 通过 | `node_modules/@forge-ui-official/core/dist/index.d.ts:102`；`components/ask-ai-presentation.tsx:4` | 使用已安装版本真实导出，未引入 Toast/Drawer/Sheet |
| C9 | 不适用 | `components/ask-ai-transcript.tsx:288` | 此处为只读查询表，没有独立详情接口或重复查看操作列；导航仍走现有页面动作 |
| C10 | 不适用 | `components/ask-ai-presentation.tsx:26` | 未新增详情指标卡 |

### V — 视觉 token

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| V1 | 通过 | `components/ask-ai-harness.tsx:22`；`components/ask-ai-presentation.tsx:63` | 本次接入仅 fg token，无默认色和新裸 hex |
| V2 | 通过 | `components/ask-ai-entry.tsx:630`；`components/ask-ai-presentation.tsx:66` | 业务控件使用 siteConfig.accent；原生 Agent 组件继承壳主题 |
| V3 | 通过 | `components/ask-ai-harness.tsx:4`；`components/ask-ai-presentation.tsx:4` | 本次未手写新图标，继续使用 core 自带 solar 图标 |
| V4 | 通过 | `lib/agent/presentation.ts:10`；`components/ask-ai-presentation.tsx:26` | 分析图使用 core tone 枚举，不接受任意颜色 |
| V5 | 通过（静态） | `components/ask-ai-harness.tsx:23`；`components/ask-ai-presentation.tsx:64` | 对话节标题使用 Kit 字号体系，业务页标题未改；视觉待截图 |
| V6 | 通过 | `components/ask-ai-harness.tsx:26`；`lib/ask-ai-progress.ts:23` | 等待黄、失败红、取消灰；StatusBadge 默认 soft。AgentTaskRows 的原生执行行不改成自造胶囊 |
| V7 | 通过（静态） | `components/ask-ai-harness.tsx:23`、`:24`；`components/ask-ai-presentation.tsx:64` | 标题黑、说明 grey-700；已把执行行重要 meta 从 core grey-500 提到 grey-700；视觉待截图 |

### F — 表单与交互 surface

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| F1 | 通过 | `components/ask-ai-form.tsx:57`、`:61`；`components/ask-ai-entry.tsx:547` | 对话草稿先校验，再填现有页面表单；实际保存沿用业务表单宿主 |
| F2 | 通过 | `lib/agent/confirm.ts:15`、`:25`；`components/ask-ai-entry.tsx:553` | 删除只生成页面确认，带权限和版本校验；呈现组件不能直接删库 |
| F3 | 通过 | `components/ask-ai-form.tsx:43`、`:88`；`components/ask-ai-harness.tsx:106` | 文本校验落字段；多选错误落当前选择控件旁 |
| F4 | 通过 | `components/ask-ai-entry.tsx:556`、`:581`；`components/ask-ai-transcript.tsx:352` | 动作结果使用全站 toast；消息中的任务状态是协议状态，不是伪保存成功绿条 |
| F5 | 不适用 | `components/ask-ai-entry.tsx:547` | 本次未改业务创建成功后的详情形态 |
| F6 | 通过 | `components/ask-ai-entry.tsx:765` | 抽屉、全屏均由 Kit AskAi 提供，无自研 Drawer/Sheet |

### D — 数据与状态

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| D1 | 不适用 | `components/ask-ai-transcript.tsx:162`；`components/ask-ai-entry.tsx:663` | 非 collection。对话已有等待、失败、恢复重试与无建议提示，不伪造列表三态 |
| D2 | 不适用 | `components/ask-ai-transcript.tsx:152` | 未新增全页详情 |
| D3 | 通过 | `lib/harness/engine.ts:99`、`:154`；`lib/agent/presentation-tool.ts:10` | 任务来自服务端 checkpoint；呈现只返回 JSON；业务保存仍由原 service/API 路径负责 |
| D4 | 不适用 | `lib/harness/types.ts:29` | 在既有 JSON 运行记录增任务字段，未混入 users 或新增业务表 |
| D5 | 不适用 | `components/ask-ai-entry.tsx:628` | 会话选择、阅读展开属于临时对话 UI 状态，未新增可分享列表筛选 |
| D6 | 通过 | `app/api/ask-ai/route.ts:51`；`lib/harness/progress.ts:31`；`lib/harness/engine.ts:241` | 请求拒收 apiKey；公开任务去掉 interactionId；异常不持久化原始供应商/数据库错误 |

### E — 工程组织

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| E1 | 通过 | `components/ask-ai-presentation.tsx:12`；`lib/harness/progress.ts:1`；`lib/agent/presentation.ts:1` | UI、JSON schema、执行协议、任务投影分离；未新增臃肿 page.tsx |
| E2 | 通过 | `app/api/ask-ai/route.ts:40`；`app/api/ask-ai/runs/route.ts:6`；`app/api/ask-ai/forms/route.ts:12` | requireSession、Zod、jsonOk/jsonError/apiError 和中文失败文案 |
| E3 | 通过 | `components/ask-ai-harness.tsx:16`；`lib/ask-ai-progress.ts:23` | 任务状态与任务解析统一；消息组件仍按协议分派，未为每种模型复制 UI |
| E4 | 通过 | `components/ask-ai-harness.tsx:1`；`components/ask-ai-presentation.tsx:1`；`components/ask-ai-entry.tsx:1` | client 标记对应真实 hook、输入、选择和回调 |

### Q — 交付验证

| 条目 | 判定 | 证据 | 处置 |
| --- | --- | --- | --- |
| Q1 | 通过 | `package.json:16`；见重验记录 | 主实现者最终 pnpm check 通过；15 条既有 ref 画廊警告另记 |
| Q2 | 违规（待验证） | `components/ask-ai-entry.tsx:639` | 主实现者复用已运行 Chrome 验证真实主路径；截图待归档 |
| Q3 | 通过 | 本报告「对照物」「分层记录」；`app/(app)/ref/agent/page.tsx:73` | 对照 agent 角色，未拿 accounts 当全站基线 |
| Q4 | 违规（待验证） | `components/ask-ai-entry.tsx:765` | 主实现者待提供浏览器 console 和 Next overlay 检查结果 |

## 组件接入核对

| Core 组件 | 真实数据和交互证据 | 审查结果 |
| --- | --- | --- |
| AskAi / PromptBar | `components/ask-ai-entry.tsx:628`，会话、模型和请求链路 | 继续复用同一实例和现有输入栏展示；发送主路径待浏览器验收 |
| StreamingAnswer | `components/ask-ai-transcript.tsx:242`，真实回答绑定 delivery | 恢复历史静态展示，追问回 onAsk；播放收尾待浏览器验收 |
| ThinkingTrace | `components/ask-ai-transcript.tsx:160`，当前助手正文入口 | 用户确认保留另一聊天的展示调整，当前不挂载此组件；本次不恢复 |
| ToolChips | `components/ask-ai-harness.tsx:45`，调用事件与回执 | 普通调用为「已调用」，失败和回执分别为「未完成」「已核实」 |
| AgentTaskRows | `lib/harness/engine.ts:154`、`:163`、`:177`；`components/ask-ai-harness.tsx:16` | context/model/tool 实际开始与完成创建 checkpoint；等待/取消保留自己的语义 |
| ApprovalCard | `components/ask-ai-harness.tsx:82`；`lib/harness/engine.ts:83` | 多选结果继续同一任务，绑定版本和 interaction；服务端拒绝重复/越界/混合提交 |
| Checklist / ChecklistItem | `components/ask-ai-presentation.tsx:43` | 用户自查按消息保存；勾选不当作业务执行成功 |
| RecommendationCard | `components/ask-ai-presentation.tsx:22` | 主方案与替代方案各发送对应请求，统一标待核对 |
| InsightCards | `components/ask-ai-presentation.tsx:26`；`lib/agent/presentation.ts:12` | spark/bars/segments 原生图表；历史继续浏览但不重发追问 |
| AgentDiffTable | `components/ask-ai-presentation.tsx:34` | 提交差异带 columns 字段含义；回到工具核对链路 |
| AgentCodeBlock | `components/ask-ai-presentation.tsx:32` | 只读配置与 diff 浏览，无执行能力 |
| ContextCards | `components/ask-ai-presentation.tsx:31` | 本轮来源摘要，由 schema 限定；没有任意 HTML 或执行链接 |
| CommandSearch | `components/ask-ai-presentation.tsx:29` | 选项精确映射 question 后发送 |
| AgentFlowchart | `components/ask-ai-presentation.tsx:33`；`lib/agent/presentation.ts:31` | 原生节点选择；拒绝指向不存在节点的边 |

## 对照偏差与已知限制

1. Kit case 是展廊；真实 Ask AI 按请求呈现内容，不并排铺满所有组件。这是合理业务差异。
2. 原生 `AgentTaskRows` 只支持 running/completed/failed。等待用户、等待页面与取消状态使用 `DescriptionItem` + soft `StatusBadge`，不伪装成执行中或成功。
3. 正文 POST 仍一次返回完整 JSON。只读 GET 可按当前请求、revision 每 1.5 秒读取 checkpoint，停止后清理且不执行 fill/navigation；按用户确认的展示范围，当前界面不消费运行中的 progress，任务条只在 chromeReady 后出现。数据通道就绪不能写成运行中进度已展示。证据：`lib/ask-ai-progress-client.ts:13`、`components/ask-ai-entry.tsx:300`、`components/ask-ai-transcript.tsx:187`、`lib/harness/starter.ts:209`。
4. core 0.3.4 部分 Agent 辅助文案为英文。`AgentDiffTable` 原生差异行只提供鼠标选择，没有键盘选择接口；消费端不复制一套表格。核心能力限制单列，不能声称全键盘覆盖。
5. ThinkingTrace 和运行中占位当前不挂载，任务状态汇总未恢复；这是用户明确确认的展示选择。本次数据接入不覆盖另一聊天的展示调整。
6. 单选继续用原有即时选择按钮；ApprovalCard 用于明确提交的多选，避免当前 core radio 回调读取旧答案的问题。组件接入并不意味着所有 props 都要在同一业务路径使用。

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
| 协议/任务/播放测试 | 主实现者在隔离 PostgreSQL 环境执行 57/57 通过：`node scripts/semantic-test-env.mjs node --import tsx --test --test-concurrency=1 tests/harness/{engine,progress,starter,store,operations,presentation}.test.ts tests/ask-ai/*.test.ts` |
| 浏览器路径与截图 | 待主实现者完成，审计子任务未并发操作 Chrome |
| console / Next overlay | 待主实现者补充 |
| 修复闭环 | C6 交互禁用与 ToolChips 用语已复核；Q1 已闭环；Q2/Q4 待浏览器收尾 |
