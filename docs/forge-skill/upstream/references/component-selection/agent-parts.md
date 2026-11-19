## 选型

- useChat 的 message.parts → `AgentParts`（思考、工具、确认、正文、来源、文件一次渲染）

不要用：
- 非 AI SDK 的自定义运行时 → 自己组合 Reasoning、ToolCall、StreamingAnswer
