## 选型

- 真实模型的思考过程、等待首字 → `Reasoning`（宿主给 status、时长、步骤）
- 首字之前的一行等待 → `ThinkingIndicator`

不要用：
- 静态演示页里自己播放的思考动画 → `ThinkingTrace`
- 工具调用 → `ToolCall`，不要塞进 Reasoning 的步骤
