# Ask AI Agent 组件接入

真实对话通过已登记的 `assistant.present` 只读工具输出有界 JSON 消息块，前端从 core 导入组件。工具受 `dashboard:read` 过滤；模块数据仍必须使用该模块授权工具查询。呈现工具不能写库、执行代码、任意导航或创建确认凭证。

| Core 组件 | 真实入口与交互 |
| --- | --- |
| AskAi / PromptBar | 壳、会话、模型选择、发送 |
| StreamingAnswer | 正文、消息末尾 follow-ups |
| ThinkingTrace | 当前对话展示方案不挂载此组件；真实处理事件仍由 Harness 保存，参考页保留组件对照 |
| ToolChips | 任务状态下方的调用、失败与回执；diff 的建议增删数量（ToolDiffChip 是类型，不是独立组件） |
| AgentTaskRows | `harness.tasks` 提供真实步骤及状态，在回答展示完成后显示；等待补充、等待页面确认、取消使用对应 StatusBadge，不伪装为执行完成 |
| ApprovalCard | ask_user / respond(question) 的 multiple=true 多选，选择结果通过 optionIds 校验后继续同一任务 |
| Checklist / ChecklistItem | checklist 消息：逐项自查、独立核对勾选、提交结果继续对话；状态按消息保存在当前浏览器 |
| RecommendationCard | recommendation 消息：主建议和替代建议均发送相应问题 |
| InsightCards | insights 消息：切换分析卡并追问；支持查询数值生成趋势、柱形、占比图；历史卡仍可浏览，发送入口停用 |
| AgentDiffTable | diff 消息：选择增删建议，提交核对；不会直接应用到数据库 |
| AgentCodeBlock | code 消息：只读文本/JSON、代码与差异视图切换，无执行能力 |
| ContextCards | context 消息：浏览引用摘要，来源标签必须对应本轮工具事实或明确标注的业务规则 |
| CommandSearch | commands 消息：过滤后续问题，选择后发送 |
| AgentFlowchart | flow 消息：选择流程节点，查看节点和后续连线 |

## 协议与边界

- `lib/agent/presentation.ts` 为呈现 JSON 的校验与类型定义，最多每次四块，有数量和长度上限；不允许 HTML、任意 href 或执行脚本。
- `lib/agent/presentation-tool.ts` 注册工具；`components/ask-ai-presentation.tsx` 渲染和交互。
- `lib/ask-ai.ts` 同时校验实时返回和恢复历史，不把新消息块丢弃。
- 呈现块逐块校验重复 ID、差异列、流程引用和交互长度；工具输入、客户端响应、恢复历史使用相同规则。分析图数值必须来自已查询事实，协议限制数值范围、序列长度和占比合计。
- `lib/harness/progress.ts` 保存最多 30 个真实步骤。步骤 ID 在执行前后保持一致；提案准备与页面保存分别记录，只有服务器验证回执后保存步骤才完成。旧会话没有步骤时返回空数组。
- `GET /api/ask-ai/runs/?runId=...` 提供只读进度，校验用户、应用、部署版本及能力权限；响应只含 requestId 和 harness，不包含可重放页面操作。客户端按当前请求读取并丢弃过期响应，停止或结束请求后取消读取；当前展示仍在回答结束后使用最终结果。
- `multiple` 缺省为 false，旧单选 `optionId` 兼容；多选 `optionIds` 不允许重复、越界、空数组或混合提交。提交绑定会话归属、版本和交互 ID。
- Checklist 是用户自查，不是模型执行结果。推荐、差异等确认只是发起新问题；写入仍需原有签名提案、页面核对和保存回执。
- 历史消息与请求处理中，发送型控件禁用；来源、流程、代码等只读浏览不触发业务动作。
- 没有已配置模型时仍遵循现有本地规则，不声称本地规则可以生成所有结构化内容。

## 使用示例

- “先用多选让我选核对范围：账号、角色、菜单。”
- “给我一个可勾选的账号权限自查清单。”
- “查询账号和角色后给推荐方案、分析卡和引用依据。”
- “查询模型和角色，展示处理步骤和各类记录数量的分析图。”
- “画出从查询到页面核对的业务流程。”
- “展示待核对配置差异和只读 JSON 示例，不执行。”
- “把后续可问的问题做成可搜索列表。”

## Core 限制

当前 core 0.3.4 部分组件内置辅助文案为英文，消费端使用原组件。AgentTaskRows 原生状态只有 running / completed / failed；等待和取消保留独立状态。ApprovalCard 当前用于明确提交的多选；单选沿用已有即时选择，避免其 radio 自动提交闭包读到旧答案的问题。

原生组件的现有限制另包括：AgentDiffTable 的差异行目前仅支持鼠标点击切换，未提供键盘行选择接口；代码/差异切换与提交按钮支持键盘。消费端未复制表格以替换原实现。
