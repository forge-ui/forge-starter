# 智能体对话

分类：AI 与智能体。按自主智能体与应用智能体分组的会话侧栏，可搜索、展开历史会话；选中智能体后展示介绍与开场建议，带快捷操作和访问权限的输入框，回复逐字生成。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ChatBubble、ChatInputBar、IconButton、StreamingAnswer。

## 最小可用示例

```tsx
import { AiAssistantHome } from "@/components/blocks/ai-assistant-home";

export default function Example() {
  return (<AiAssistantHome />);
}
```

## AiAssistantHome Props

| Prop | 必填 | Type |
|---|---|---|
| peers | 否 | `ChatPeer[] \| undefined` |
| threads | 否 | `ChatThread[] \| undefined` |
| className | 否 | `string \| undefined` |
