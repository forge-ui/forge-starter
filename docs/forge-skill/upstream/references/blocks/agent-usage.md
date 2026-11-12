# 用量与成本

分类：AI 与智能体。本月花费对比预算、每日趋势，按项目或模型拆分成本，并列出值得关注的异常用量。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ButtonGroup、Panel、ProgressBar、SmoothLineChart、StatCard、StatusBadge、cn。

## 最小可用示例

```tsx
import { AgentUsage } from "@/components/blocks/agent-usage";

export default function Example() {
  return (<AgentUsage />);
}
```

## AgentUsage Props

| Prop | 必填 | Type |
|---|---|---|
| usage | 否 | `AgentUsageData \| undefined` |
| className | 否 | `string \| undefined` |
