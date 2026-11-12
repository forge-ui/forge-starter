# 多智能体编排

分类：AI 与智能体。编排者拆分任务给多个子智能体：树状分工、调用时间线与选中智能体的调用明细，可回放。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Panel、StatusBadge、cn。

## 最小可用示例

```tsx
import { AgentOrchestration } from "@/components/blocks/agent-orchestration";

export default function Example() {
  return (<AgentOrchestration />);
}
```

## AgentOrchestration Props

| Prop | 必填 | Type |
|---|---|---|
| run | 否 | `AgentOrchestrationData \| undefined` |
| className | 否 | `string \| undefined` |
