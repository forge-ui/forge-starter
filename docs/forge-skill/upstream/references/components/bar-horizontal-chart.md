# bar-horizontal-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/bar-horizontal-chart.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BarHorizontalChart (value)

```ts
({ data, domain, target, targetLabel, ranges, motion, accent, activeIndex, color, inactiveColor, barWidth, showLabels, showTooltip, tooltipValue, tooltipTrend, }: BarHorizontalChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `data` | 是 | `BarHorizontalChartDataItem[]` |  |
| `domain` | 否 | `[number, number] \| undefined` |  |
| `target` | 否 | `number \| undefined` |  |
| `targetLabel` | 否 | `string \| undefined` |  |
| `ranges` | 否 | `{ to: number; color?: string; }[] \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `inactiveColor` | 否 | `string \| undefined` |  |
| `barWidth` | 否 | `"wide" \| "thin" \| undefined` |  |
| `showLabels` | 否 | `boolean \| undefined` |  |
| `showTooltip` | 否 | `boolean \| undefined` |  |
| `tooltipValue` | 否 | `string \| undefined` |  |
| `tooltipTrend` | 否 | `"up" \| "down" \| undefined` |  |
