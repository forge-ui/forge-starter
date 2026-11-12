# 任务会话

分类：AI 与智能体。短会话模式的自主智能体任务：左侧对话记录与带快捷操作的追问输入框，回复逐字生成可停止；右侧概要、知识库授权与结果产物。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ChatInputBar、Modal、PageTitleToolbar、StatusBadge。

## 最小可用示例

```tsx
import { AgentRun } from "@/components/blocks/agent-run";

export default function Example() {
  return (<AgentRun />);
}
```

## AgentRun Props

| Prop | 必填 | Type |
|---|---|---|
| session | 否 | `AgentRunSession \| undefined` |
| className | 否 | `string \| undefined` |
