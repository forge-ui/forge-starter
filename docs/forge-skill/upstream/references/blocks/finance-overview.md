# 财务概览

分类：看板首屏。结合账户余额、收支趋势和储蓄目标，构建完整的财务工作台。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ChartMetricRow、CreditCard、GroupedBarChart、Panel、WalletGoalCard、cn。

## 最小可用示例

```tsx
import { FinanceOverview } from "@/components/blocks/finance-overview";

export default function Example() {
  return (<FinanceOverview title="财务概览" periodLabel="2026.10.25 — 10.31" />);
}
```

## FinanceOverview Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| description | 否 | `string \| undefined` |
| periodLabel | 否 | `string \| undefined` |
| accounts | 否 | `FinanceAccount[] \| undefined` |
| trend | 否 | `{ data: import("@forge-ui-official/core").GroupedBarPoint[]; series: import("@forge-ui-official/core").ChartMetricSeries[]; activeIndex?: number; tooltipItems?: import("@forge-ui-official/core").GroupedBarTooltipItem[]; yAxisLabels?: string[]; heightClass?: string; } \| undefined` |
| goals | 否 | `(WalletGoalCardProps & { id: string; })[] \| undefined` |
| className | 否 | `string \| undefined` |
