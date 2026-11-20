> 已废弃：新代码用 `ToolCallGroup` + `ToolCall`；下个大版本删除。

## 选型

- 已有 ToolChipItem 数据、要显示思考/写入/运行混排和文件增删 → `ToolChips`（内部用 ToolCall 渲染）

不要用：
- 新接 AI SDK 工具调用 → `ToolCall` / `ToolCallGroup`，或直接 `AgentParts`
