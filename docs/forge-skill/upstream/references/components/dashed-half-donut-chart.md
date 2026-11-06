# dashed-half-donut-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/dashed-half-donut-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DashedHalfDonutChart (value)

```ts
({ segments, accent, centerValue, trend, trendDirection, subtitle, trackColor, }: DashedHalfDonutChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `DashedHalfDonutSegment[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `centerValue` | 否 | `string \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `trackColor` | 否 | `string \| undefined` | Optional track color. Defaults to accent's lightest ramp stop. |
