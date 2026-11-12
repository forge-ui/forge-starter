# 经营概览

分类：看板首屏。将关键指标、收支趋势与收入构成集中在一个完整的经营首屏。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：BarChartStatCard、Button、ChartHeader、ChartMetricRow、DonutChart、GroupedBarChart、LineChartStatCard、Panel、cn。

## 最小可用示例

```tsx
import { OverviewDashboard } from "@/components/blocks/overview-dashboard";

export default function Example() {
  return (<OverviewDashboard title="经营概览" description="知行科技 · 本周经营情况" />);
}
```

## OverviewDashboard Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| description | 否 | `string \| undefined` |
| periodLabel | 否 | `string \| undefined` |
| metrics | 否 | `OverviewMetric[] \| undefined` |
| trend | 否 | `{ data: import("@forge-ui-official/core").GroupedBarPoint[]; series: import("@forge-ui-official/core").ChartMetricSeries[]; activeIndex?: number; tooltipItems?: import("@forge-ui-official/core").GroupedBarTooltipItem[]; yAxisLabels?: string[]; heightClass?: string; } \| undefined` |
| composition | 否 | `DonutChartProps \| undefined` |
| onExport | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
