# 资产概览

分类：看板首屏。总资产、现金与待收款趋势卡，配合企业卡与资金目标完成度。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CreditCard、LineChartStatCard、Panel、PlusIcon、ProgressBar、cn。

## 最小可用示例

```tsx
import { WealthOverview } from "@/components/blocks/wealth-overview";

export default function Example() {
  return (<WealthOverview onAddCard={() => {}} />);
}
```

## WealthOverview Props

| Prop | 必填 | Type |
|---|---|---|
| metrics | 否 | `WealthMetric[] \| undefined` |
| cards | 否 | `({ locale?: "zh" \| "en"; cardNumberLabel?: string; holderNameLabel?: string; cardNumber?: string; holderName?: string; expiry?: string; theme?: import("@forge-ui-official/core").FinancialTheme; variant?: import("@forge-ui-official/core").FinancialVariant; width?: import("@forge-ui-official/core").CardWidth; className?: string; } & { id: string; })[] \| undefined` |
| goals | 否 | `WealthGoal[] \| undefined` |
| onAddCard | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
