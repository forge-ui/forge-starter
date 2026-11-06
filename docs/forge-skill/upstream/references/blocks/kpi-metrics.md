# KPI 指标行

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：BarChartStatCard、LineChartStatCard、Panel、StatCard、cn。

## 最小可用示例

```tsx
import { KpiMetrics } from "@/components/blocks/kpi-metrics";

export default function Example() {
  return (<KpiMetrics metrics={[{ id: "revenue", title: "营业收入", value: "¥32,200", trend: "10%", data: [12, 24, 18, 36, 42] }, { id: "orders", title: "订单", value: "1020", trend: "32%", visualization: "line", data: [20, 30, 24, 40, 52] }, { id: "customers", title: "客户", value: "860", data: [10, 30, 60, 95, 50, 40, 30] }]} />);
}
```

## KpiMetrics Props

| Prop | 必填 | Type |
|---|---|---|
| metrics | 否 | `({ title: string; value: ReactNode; animateValue?: boolean; locale?: string; numberFormat?: Intl.NumberFormatOptions; motion?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").MotionPreference; trend?: string; trendDirection?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").TrendDirection; subtitle?: string; theme?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").CardTheme \| ("dark" \| "orange"); size?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").StatCardSize; icon?: ReactNode; badgeVariant?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").CardBadgeVariant; action?: ReactNode; onKebabClick?: () => void; density?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").CardDensity; width?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").CardWidth; className?: string; } & { id: string; visualization?: "line" \| "bar"; data?: number[]; })[] \| undefined` |
| children | 否 | `ReactNode` |
| className | 否 | `string \| undefined` |
| variant | 否 | `"chart" \| "plain" \| undefined` |
| bars | 否 | `number[] \| undefined` |

## FinanceMetricCard Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| value | 是 | `string` |
| color | 是 | `"purple" \| "red"` |
| direction | 是 | `"up" \| "down"` |
