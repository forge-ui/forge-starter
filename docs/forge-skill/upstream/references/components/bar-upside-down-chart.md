# bar-upside-down-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/bar-upside-down-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BarUpsideDownChart (value)

```ts
({ data, accent, activeIndex, upperColor, lowerColor, barWidth, showLabels, showTooltip, tooltipUpperValue, tooltipLowerValue, tooltipTrend, height, }: BarUpsideDownChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `data` | 是 | `BarUpsideDownChartDataItem[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `upperColor` | 否 | `string \| undefined` | Upper bar color override. Defaults to accent.bg. |
| `lowerColor` | 否 | `string \| undefined` | Lower bar color override. Defaults to accent.ramp[2] (mid-light shade). |
| `barWidth` | 否 | `"wide" \| "thin" \| undefined` |  |
| `showLabels` | 否 | `boolean \| undefined` |  |
| `showTooltip` | 否 | `boolean \| undefined` |  |
| `tooltipUpperValue` | 否 | `string \| undefined` |  |
| `tooltipLowerValue` | 否 | `string \| undefined` |  |
| `tooltipTrend` | 否 | `"up" \| "down" \| undefined` |  |
| `height` | 否 | `string \| undefined` |  |
