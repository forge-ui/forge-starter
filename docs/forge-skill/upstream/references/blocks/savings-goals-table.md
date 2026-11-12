# 储蓄目标表

分类：财务。资金目标的目标金额、存入进度与截止日期，支持多选和新建目标。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、DataTable、Modal、PlusIcon、ProgressBar、TextField、cn。

## 最小可用示例

```tsx
import { SavingsGoalsTable } from "@/components/blocks/savings-goals-table";

export default function Example() {
  return (<SavingsGoalsTable onCreate={goal => console.log(goal.title)} />);
}
```

## SavingsGoalsTable Props

| Prop | 必填 | Type |
|---|---|---|
| goals | 否 | `SavingsGoal[] \| undefined` |
| onCreate | 否 | `((goal: SavingsGoal) => void) \| undefined` |
| className | 否 | `string \| undefined` |
