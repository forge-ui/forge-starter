# smooth-line-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/smooth-line-chart.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SmoothLineChart (value)

```ts
({ series, stacked, bands, motion, onActiveIndexChange, ariaLabel, interpolation, highlightToActive, markers, accent, activeIndex, showTooltip, tooltipItems, showYAxis, yAxisLabels, xAxisLabels, yDomain, height, }: SmoothLineChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `series` | 是 | `LineSeries[]` |  |
| `stacked` | 否 | `boolean \| undefined` |  |
| `bands` | 否 | `{ lower: number[]; upper: number[]; color?: string; }[] \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `onActiveIndexChange` | 否 | `((index: number \| undefined) => void) \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `interpolation` | 否 | `"linear" \| "smooth" \| undefined` |  |
| `highlightToActive` | 否 | `boolean \| undefined` |  |
| `markers` | 否 | `{ index: number; label: string; }[] \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `showTooltip` | 否 | `boolean \| undefined` |  |
| `tooltipItems` | 否 | `ChartTooltipItem[] \| undefined` |  |
| `showYAxis` | 否 | `boolean \| undefined` |  |
| `yAxisLabels` | 否 | `string[] \| undefined` |  |
| `xAxisLabels` | 否 | `string[] \| undefined` |  |
| `yDomain` | 否 | `[number, number] \| undefined` | Optional [min, max] for y-axis. Default: auto from data. |
| `height` | 否 | `string \| undefined` |  |
