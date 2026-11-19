## 选型

- 写操作、付款、删除前请用户确认（风险、前后对比、允许范围、拒绝原因）→ `Approval`
- Forge Agent 运行时的提案确认 → `ConfirmCard`

不要用：
- 只读查询 → 不需要确认
- 工具调用自带的确认 → `ToolCall` 的 awaiting-approval 状态（AgentParts 会自动渲染）
