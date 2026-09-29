# Ask AI Harness 交互规范审计（2026-09-29）

本报告只覆盖规范符合性。范围：`components/ask-ai-entry.tsx`、`components/ask-ai-transcript.tsx`、`components/ask-ai-harness.tsx`、`components/ask-ai-form.tsx`、`lib/ask-ai.ts`。

## 对照物与分层记录

| 角色 | chrome | 对照页 | case |
| --- | --- | --- | --- |
| agent 对话附件，挂业务页页头 | 沿用宿主页 A/B；对话本身为 Kit AskAi | `/ref/agent`、现有 AskAiProvider | agent、input-field、table |

| 层 | 本层 JSX 结构 | 对照与判定 |
| --- | --- | --- |
| S | 业务页入口 → Kit AskAi → 会话消息 → 交互选择/表单 → PromptBar | 沿用统一壳；协议交互替换自由文本猜测，属于合理业务差异 |
| O | 唯一稳定 portal 挂载；消息区 min-h-0、min-w-0、overflow-y-auto；composer 独立 gutter | 保留 Kit 抽屉/全屏，不新增壳；Chrome 已核首屏底 gutter |
| N | 消息纵向 stack；表格直接落 stack；候选按钮组与自定义输入；最近三条 ThinkingTrace | 没有卡片套卡片；候选集合是一维操作组，Flex 合理 |
| C | Kit Button、TextField、StatusBadge、ThinkingTrace、PromptBar、DataTable、Grid | props 已核已安装 core 的 d.ts 与 `/ref/agent`；fg token 与 accent 一致 |

## 逐项核查

每条均按本次 Ask AI 范围判定；页面/路由未改项明确不适用。真实 Chrome 已补齐 Q2、Q4 与视觉核验；证据和适用范围见末尾验收记录。

| ID | 结果 | 证据 | 处置 |
| --- | --- | --- | --- |
| M1 | 不适用 | `components/ask-ai-entry.tsx` 仅页头插槽，无新增菜单 | — |
| M2 | 不适用 | `components/ask-ai-entry.tsx` 无侧栏图标 | — |
| M3 | 不适用 | `components/ask-ai-entry.tsx` 沿用模块内入口，无新路由 | — |
| M4 | 通过 | `lib/ask-ai.ts` 结果链接限定站内绝对路径，无占位 href | — |
| M5 | 不适用 | `components/ask-ai-entry.tsx` 页头 action，未调整菜单分组 | — |
| M6 | 不适用 | `components/ask-ai-entry.tsx` 未调整菜单链接 | — |
| R1 | 通过 | `components/ask-ai-transcript.tsx` agent 附件角色，对照 `/ref/agent` | — |
| R2 | 不适用 | `components/ask-ai-entry.tsx` 页面填入由现有业务路由承接 | — |
| R3 | 不适用 | `components/ask-ai-form.tsx` 对话草稿，实际保存仍由业务页弹窗 | — |
| R4 | 不适用 | `components/ask-ai-entry.tsx` 使用既有 fill.href，不增深链路由 | — |
| R5 | 不适用 | `components/ask-ai-entry.tsx` 无 redirect 页变更 | — |
| H1 | 通过 | `components/ask-ai-entry.tsx`、`` 保留 A/B 页头挂载入口 | — |
| H2 | 不适用 | `components/ask-ai-entry.tsx` 透传既有 PageTitleToolbar props | — |
| H3 | 不适用 | `components/ask-ai-transcript.tsx` 无详情面包屑 | — |
| H4 | 不适用 | `components/ask-ai-transcript.tsx` 无面包屑变更 | — |
| H5 | 不适用 | `components/ask-ai-transcript.tsx` 无详情返回导航 | — |
| H6 | 通过 | `components/ask-ai-entry.tsx` Kit AskAi，未以 PageHeader 做内容卡 | — |
| H7 | 通过 | `components/ask-ai-harness.tsx` “本次任务”字段 + StatusBadge | — |
| L1 | 通过 | `components/ask-ai-entry.tsx` 唯一 AskAi portal，沿用 AppShell | — |
| L2 | 通过 | `components/ask-ai-transcript.tsx` 对话内部 p-5；未改业务页根 padding | — |
| L3 | 不适用 | `components/ask-ai-harness.tsx` 对话选择组，不是 collection 工具带 | — |
| L4 | 不适用 | `components/ask-ai-transcript.tsx` 不新增全页详情 | — |
| L5 | 不适用 | `components/ask-ai-transcript.tsx` 不新增 dashboard | — |
| L6 | 通过 | `components/ask-ai-harness.tsx` 统一 gap-3，候选按钮可换行 | Chrome 抽屉/Kit 全屏截图，换行正常 |
| L7 | 通过 | `components/ask-ai-transcript.tsx` 表列按比例、tableMinWidth=520，无 flex 吃剩宽 | Chrome 结果表核对，表内横向滚动，未撑破抽屉 |
| L8 | 通过 | `components/ask-ai-transcript.tsx` DataTable 直接落消息 stack | — |
| L9 | 通过 | `components/ask-ai-form.tsx`、`components/ask-ai-transcript.tsx` 使用 Kit Grid；按钮组为一维 Flex | — |
| L10 | 通过 | `components/ask-ai-entry.tsx` 消息内滚；`` composer gutter | Chrome 首屏截图：composer 与底部 gutter 清晰 |
| C1 | 通过 | `components/ask-ai-harness.tsx` 所有新增控件从 core 导入 | 已把旧 SuggestionPrompts 原生按钮换为 Kit Button |
| C2 | 通过 | `components/ask-ai-transcript.tsx` 会话数据仍用 DataTable | — |
| C3 | 通过 | `components/ask-ai-transcript.tsx` 无 sortable 假按钮 | — |
| C4 | 不适用 | `components/ask-ai-transcript.tsx` 仅写入提案预览，真实删除确认由既有业务页处理 | — |
| C5 | 通过 | `components/ask-ai-harness.tsx` StatusBadge 有中文状态 | — |
| C6 | 通过 | `components/ask-ai-harness.tsx`、``、`` 分别发送 optionId/text/cancel；非装饰按钮 | 真实浏览器行为由 Q2 覆盖 |
| C7 | 通过 | `components/ask-ai-harness.tsx` 对照 core thinking-trace.d.ts；TextField 对照 input-field case | 用 ThinkingTrace 中文“处理记录”，关闭自动播放；待答状态由上方 StatusBadge 标识 |
| C8 | 通过 | `components/ask-ai-harness.tsx`、`components/ask-ai-entry.tsx` 导出存在，typecheck 通过 | — |
| C9 | 不适用 | `components/ask-ai-transcript.tsx` 通用只读结果表协议不声明单元格详情动作；实体选择由 options 承接 | — |
| C10 | 不适用 | `components/ask-ai-harness.tsx` 未新增指标卡 | — |
| V1 | 通过 | `components/ask-ai-harness.tsx` 新增颜色均 fg-* | — |
| V2 | 通过 | `components/ask-ai-harness.tsx`、``、`components/ask-ai-entry.tsx` 控件使用 siteConfig.accent | — |
| V3 | 不适用 | `components/ask-ai-harness.tsx` 无新增自绘图标 | — |
| V4 | 不适用 | `components/ask-ai-harness.tsx` 无新图表 | — |
| V5 | 通过 | `components/ask-ai-harness.tsx` 对话节标题 text-sm；宿主页头未改变 | — |
| V6 | 通过 | `components/ask-ai-harness.tsx` StatusBadge 默认 soft；候选项是普通文字 | — |
| V7 | 通过 | `components/ask-ai-harness.tsx`、``、`` 主文字黑，描述 grey-700 | 修复来源标签与用户 label 的旧 grey-500；最终视觉由 Q2 复核 |
| F1 | 不适用 | `components/ask-ai-form.tsx` 对话草稿沿用既有字段控件，页面 Modal 不改 | — |
| F2 | 通过 | `components/ask-ai-entry.tsx` 确认仅排入页面操作，删除最终由业务页确认 | — |
| F3 | 通过 | `components/ask-ai-harness.tsx`、`` 空白/超长输入落字段错误；账号草稿沿用字段校验 | — |
| F4 | 通过 | `components/ask-ai-entry.tsx`、`` 使用全站 toast；进度是任务状态，非成功横条 | — |
| F5 | 不适用 | `components/ask-ai-entry.tsx` 保存后业务导航沿用页面逻辑 | — |
| F6 | 通过 | `components/ask-ai-entry.tsx` 使用 Kit AskAi，没有自研 Drawer/Sheet | — |
| D1 | 通过 | `components/ask-ai-entry.tsx`、`` 恢复 loading/error/retry；空会话仍有入口提示 | — |
| D2 | 不适用 | `components/ask-ai-transcript.tsx` 无全页详情 | — |
| D3 | 通过 | `lib/ask-ai.ts` 服务端恢复，`` API 提交；React state 是视图缓存 | 服务端持久化由主任务测试 |
| D4 | 不适用 | `lib/ask-ai.ts` UI 不操作数据库或登录表 | — |
| D5 | 不适用 | `components/ask-ai-harness.tsx` 交互输入为临时态；页面 query 由适配器管理 | — |
| D6 | 通过 | `lib/ask-ai.ts` 请求仅 modelId + harness；未引入 apiKey | — |
| E1 | 通过 | `components/ask-ai-harness.tsx` 纯协议 renderer；`lib/ask-ai.ts` 客户端 API；无 service/DB 混进 UI | — |
| E2 | 不适用 | `lib/ask-ai.ts` 本切片为 API 客户端；服务端由主任务单独审计 | — |
| E3 | 通过 | `components/ask-ai-harness.tsx` 通用 Interaction renderer 与业务表单分离 | — |
| E4 | 通过 | 四个交互组件首行均 use client，实际使用 React state/events | — |
| Q1 | 通过 | Node 22.23.2 下 pnpm check | tsc 通过，tripwire 通过，15 条既有 /ref 警告 |
| Q2 | 通过 | 复用稳定 Chrome：候选选择、指定名称、刷新恢复、表单填入、保存续办、页面取消 | 截图与真实模型记录见末尾 |
| Q3 | 通过 | 本报告对照物和 S→O→N→C 记录；`/ref/agent` 组件与 type props | — |
| Q4 | 通过 | 同一 Chrome 检查 console 与 Next overlay | 修复重复建议 key 后无新错误；开发 HMR 提示另记 |

## 修复、偏差与重验

- 已修复：旧示范建议使用手写 button；旧来源/用户 label 颜色过浅。均在原作用域内替换。
- Chrome 初验发现 AgentTaskRows 自带英文 Completed/Running 且密度偏高，已替换为 Kit ThinkingTrace：中文“处理记录”，最近三步，settled=true/play=false；待答状态统一由中文 StatusBadge 承载，Chrome 已视觉重验。
- 合理偏差：交互 options、custom text、cancel 是协议驱动；没有照搬展廊固定 demo。保留现有账号草稿与最终页面确认。
- `pnpm check` 已通过；另以真实 JSON 序列化往返执行了客户端协议验证：空 question 的结构化 reply、服务器 pending 恢复、HTTP 409 错误类型均通过。
- 并行集成期间的 `lib/harness/starter.ts` 类型阻塞已解除，ThinkingTrace 与页面取消清理接入后的 `pnpm check` 再次通过，仍仅 15 条既有 /ref 警告。尝试直接用 Node CJS 渲染 Kit 被包的 ESM exports 限制中止，此项不作浏览器或渲染通过证据。
- 浏览器视觉审查已完成候选按钮、自定义输入、取消、刷新恢复、页面填入、保存续办、会话切换及 Kit 全屏。409 同步由真实 HTTP 和协议测试覆盖，未把它计作浏览器人工触发证据。截图包含列表上下文与抽屉底 gutter。
- 清单反哺建议：未来为 agent 对话附件增加明确的角色条目，覆盖任务状态 label、交互过期/取消、持久化恢复、停止重放页面副作用。当前不修改清单。

## 第二批：账号列表的取消清理接入

范围：`app/(app)/accounts/page.tsx`；配套协议 `lib/agent/fill.ts`。账号详情页只有手动表单、没有 Agent fill 状态，本次保持原样，避免误关用户手动草稿。

角色 / chrome / 对照页 / case：collection + form-modal / A / `/ref/list-table` + `account-form-dialog` / table、input-field、modal。

| 层 | 本层结构 | 对照与判定 |
| --- | --- | --- |
| S | 页头 → 单条筛选搜索工具带 → 异步列表/空态 → 分页；弹窗与删除确认独立宿主 | 保留列表骨架；新增取消事件只控制已归属操作的状态 |
| O | flex-col gap-6，没有第二套壳或页面额外 padding | 不改变 AppShell gutter，Chrome 截图已复核 |
| N | 表直接落 stack，错误/空态单独展示 | 没有为取消能力增加新卡片 |
| C | 既有 Kit 控件；新增匹配 operationId 的状态清理 | 手动草稿无 operationId，不会被取消事件清理 |

下表证据均为 `app/(app)/accounts/page.tsx` 的行号。

| ID | 结果 | 证据与处置 |
| --- | --- | --- |
| M1 | 不适用 | ，沿用账号路由，无菜单变更 |
| M2 | 不适用 | ，无菜单图标变更 |
| M3 | 不适用 | ，无新增模块或路由 |
| M4 | 通过 | ，工作台真实路由 |
| M5 | 不适用 | ，无菜单分组变更 |
| M6 | 通过 | ，沿用尾斜杠 |
| R1 | 通过 | 、、，collection 骨架 |
| R2 | 通过 | ，名称跳现有全页详情，未新增第二套详情 |
| R3 | 通过 | ，沿用 AccountFormDialog |
| R4 | 通过 | ，create/edit query 继续生效 |
| R5 | 不适用 | ，无 redirect 页变更 |
| H1 | 通过 | ，A 页头加 PageTitleActions |
| H2 | 通过 | ，末项无 href |
| H3 | 不适用 | ，列表无动态实体面包屑 |
| H4 | 通过 | ，首层工作台 |
| H5 | 不适用 | ，非全页详情 |
| H6 | 通过 | ，无页内 PageHeader |
| H7 | 通过 | ，状态列有状态列头 |
| L1 | 通过 | ，沿用 AppShell，无新增壳 |
| L2 | 通过 | ，根 flex-col gap-6，无 p-6 |
| L3 | 通过 | ，单条 ButtonGroup + TextField |
| L4 | 不适用 | ，非全页详情 |
| L5 | 不适用 | ，非看板 |
| L6 | 通过 | 、，保留既有密度，Chrome 截图已复验 |
| L7 | 通过 | ，保留原固定列宽，Chrome 已核完整表格 |
| L8 | 通过 | ，DataTable 无额外白卡 |
| L9 | 不适用 | ，一维工具带；无页面分栏 |
| L10 | 通过 | ，壳结构未改，Chrome 首屏截图已核 gutter |
| C1 | 通过 | ，控件继续使用 core；取消事件不引入新控件 |
| C2 | 通过 | ，使用 DataTable |
| C3 | 通过 | ，列未启用无行为 sortable |
| C4 | 通过 | ，ConfirmationDialog 带既有遮罩宿主 |
| C5 | 通过 | ，状态使用文字 label |
| C6 | 通过 | 、，取消实际关闭匹配表单/弹窗；手动草稿不匹配 |
| C7 | 通过 | 、，保留既有组件 props |
| C8 | 通过 | ，导出有效，typecheck 通过 |
| C9 | 通过 | ，名称 button 打开详情且保留 returnTo；操作列仅编辑/删除 |
| C10 | 不适用 | ，无指标卡 |
| V1 | 通过 | ，本次唯一颜色修复为 fg-grey-700 |
| V2 | 通过 | 、、、，沿用 siteConfig.accent |
| V3 | 通过 | ，既有 solar 线性操作图标 |
| V4 | 不适用 | ，无图表 |
| V5 | 通过 | ，A 页头 text-display-l |
| V6 | 通过 | ，状态沿用 soft StatusBadge |
| V7 | 通过 | ，修复错误说明原 grey-500 为 grey-700；加载/空态仍允许浅灰 |
| F1 | 通过 | ，AccountFormDialog，草稿状态仍归列表 |
| F2 | 通过 | ，删除继续经真实确认 |
| F3 | 通过 | ，保留 AccountFormDialog 字段级校验 |
| F4 | 通过 | 、，仍使用 toast |
| F5 | 通过 | ，创建成功导航仍由原对话框逻辑处理 |
| F6 | 通过 | ，未引入 Drawer/Sheet |
| D1 | 通过 | 、、，错误重试、加载、空态分支齐全 |
| D2 | 不适用 | ，列表没有详情加载态 |
| D3 | 通过 | ，业务 store 未改；取消通过 operations API |
| D4 | 不适用 | ，本切片不调整数据库表 |
| D5 | 通过 | 、，筛选仍在 URL query |
| D6 | 通过 | ，列表无密码、token、密钥列 |
| E1 | 通过 | ，页面仅处理归属本页面的临时状态；存储清理由 fill 协议封装 |
| E2 | 不适用 | ，只调用现有受保护 API，未新增服务端端点 |
| E3 | 通过 | ，沿用 dropAgentChain，共用精确取消协议 |
| E4 | 通过 | ，client 组件实际使用交互 hooks |
| Q1 | 通过 | 集成后 pnpm check 通过；15 条 /ref 既有警告 |
| Q2 | 通过 | Chrome 验证 AI 表单取消；手动草稿/其他会话保留由精确操作隔离测试覆盖 |
| Q3 | 通过 | 已读 `/ref/list-table` 并完成 S→O→N→C 对照 |
| Q4 | 通过 | 同次检查 console / Next overlay；修复后无新错误 |

取消协议隔离验证已通过：同操作清理、其他会话保留、手动草稿保留、旧 operationId 调用 abandon 不删除另一 continuation。真实 Chrome 已确认页面取消后弹窗关闭、列表数量不增加、会话同步“已取消”。


## 本地验收记录

- 环境：既有稳定 Google Chrome、`http://127.0.0.1:3167`、隔离 PostgreSQL、真实 Qwen Plus。未部署，未修改用户正在编辑的模型配置。
- 已点通：多个候选选择第二项打开模型详情；刷新恢复待选交互；指定唯一账号名称；账号详情实际 URL 与页面标题核对；对话表单带入页面、修改最终姓名后保存、服务器回读最终值；页面取消同步会话已取消；Kit 全屏/退出全屏与历史会话。
- 真实模型改写：账号详情先挑 → waiting-user；模型详情用户选 → waiting-user；只列账号不打开详情 → completed + table。3/3 通过，原句选择交互也已真实 Chrome 复验。语义判断仍需持续扩充回归，未宣称全意图零误判。
- 自动验证：Harness + semantic 124/124；导航 13/13；`pnpm check` 通过，仅 15 条既有 /ref 色彩警告。包含独立 tickets 业务适配器、真实 SQL/HTTP 往返、候选指定/重名、CAS、重复请求、取消、回执、用户与版本隔离。
- 初验重复建议 key 已修复。之后 Chrome 无新 error / Next 错误覆盖层，仅源文件编辑触发 Fast Refresh 的开发提示。
- 本轮创建的 `harness_browser_0929` 业务测试记录已按 ID + 用户名精确清理；原有测试账号保留。
- 截图：`.semantic/evidence/harness-20260929/choices.png`（候选）、`choices-specified.png`（指定名称）、`fullscreen.png`（全屏）、`cancelled.png`（页面取消）、`detail-opened.png`（实际详情与反馈）。真实模型请求结果见同目录 `model-eval.json`。
