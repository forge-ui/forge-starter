# half-donut-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/half-donut-chart.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## HalfDonutChart (value)

```ts
({ segments, accent, centerValue, trend, trendDirection, subtitle, trackColor, }: HalfDonutChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `HalfDonutSegment[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `centerValue` | 否 | `string \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `trackColor` | 否 | `string \| undefined` | Optional track color for unfilled remainder. Defaults to accent's lightest ramp stop. |
