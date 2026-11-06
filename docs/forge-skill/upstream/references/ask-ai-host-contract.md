# Ask AI 宿主接入契约

适用当前 core 的 AskAi；API 以[生成参考](components/ask-ai.md)为准。以下是源码静态核对，不代替浏览器、辅助技术或业务后端验收。历史来源：[全屏布局记录](../../../docs/archive/ask-ai-fullscreen-layout.md)、[面板变更记录](../../../docs/archive/changes/2026-10-16-ask-ai-panel.md)。

## 布局与滚动

- 全屏消息区由 core 的 data-ask-ai-fs-scroll 管理纵向滚动。消息 slot 按自然高度展开，不加第二层 overflow 滚动；宿主不要另开跟随循环。会话列表可独立滚动，不与消息区争夺所有权。
- CSS 以主内容容器而非整个 viewport 分档：默认最大40rem，主区至少54rem时最大48rem。来源：core/src/styles/tokens.css 的 forge-ask-ai-fs-content 容器规则；不是全站最小宽度保证。
- core 根据 composer 实际高度预留底部空间；自定义 composer 应遵守同一所有权，不额外叠加固定页脚、重复 padding 或另一套 sticky 层。长内容、缩放、安全区、中文输入仍须实测。
- 当前 core 内置输入区最高192px；消息接近底部48px内跟随，否则暂停并提供“回到最新”。来源：core/src/internal/ask-ai-fullscreen.tsx。会话切换与 ResizeObserver 跟随是 core 职责；不据此宣称所有异步内容已验收。

## 面板与宿主

- panelMode 的非模态侧栏在至少1440px时启用，较窄环境回退模态抽屉；仅在 onDockedChange 为 true 时由宿主预留460px，关闭、全屏、窄屏或卸载后释放。来源：core/src/components/ui/ask-ai.tsx 的属性说明与媒体查询。
- 非模态布局不要锁住整个页面；模态焦点、关闭及 Escape 策略按[浮层规则](overlay-focus.md)验收，不用一次静态截图证明。保持稳定宿主实例，避免响应式切换丢失草稿与消息。
- 关闭面板不等于取消任务。取消、重试、流式请求、鉴权、持久化和真实录音均由宿主接入；未提供回调时不伪造相应能力。
- 异步结果绑定发起时的会话与请求身份，不能使用回调执行时恰好选中的会话。状态展示完成不等于真实任务完成。此为宿主约束，不是本轮实现后端或修复竞态的声明。

## 验收边界

分别记录宽窄屏、长消息、输入法、键盘、焦点恢复、会话切换与任务取消的实际证据。数据库、录音、模型服务和浏览器未连接时写“未核实”，不把模板演示当生产完成。
