## 选型

- 一次工具调用（状态、计时、参数、结果、重试、就地确认）→ `ToolCall`
- 一轮里的多次调用折成一行 → `ToolCallGroup`

不要用：
- 面向最终用户、不关心参数时 → 只给一行 `ThinkingIndicator` 状态
- 只是思考 → `Reasoning`
