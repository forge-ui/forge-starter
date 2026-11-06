# 对话页标题栏

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：无。

## 最小可用示例

```tsx
import { ConversationHeader } from "@/components/blocks/conversation-header";

export default function Example() {
  return (<ConversationHeader title="订单协作" subtitle="运营工作区" />);
}
```

## ConversationHeader Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| subtitle | 是 | `ReactNode` |
| children | 否 | `ReactNode` |
