# meter-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/meter-chart.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MeterChart (value)

```ts
({ segments, accent, trend, trendDirection, subtitle, height, }: MeterChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `MeterSegment[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `height` | 否 | `string \| undefined` | Meter bar height class. Default h-24 (96px) per figma. |
