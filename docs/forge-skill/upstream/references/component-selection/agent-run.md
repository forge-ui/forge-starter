## 选型

- 执行前给用户改计划 → `AgentPlan`
- 执行中看步骤、子步骤和等待确认 → `AgentTrail`
- Forge Agent 运行时的步骤 → `RunProgress`

不要用：
- 单次工具调用 → `ToolCall`
