# bar-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/bar-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BarChart (value)

```ts
({ data, onActiveIndexChange, onSelect, pinnedIndex, domain, referenceValue, referenceLabel, motion, ariaLabel, accent, activeIndex, color, inactiveColor, barWidth, showLabels, showTooltip, tooltipValue, tooltipTrend, height, }: BarChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `data` | 是 | `BarChartDataItem[]` |  |
| `onActiveIndexChange` | 否 | `((index: number \| undefined) => void) \| undefined` |  |
| `onSelect` | 否 | `((index: number) => void) \| undefined` |  |
| `pinnedIndex` | 否 | `number \| undefined` |  |
| `domain` | 否 | `[number, number] \| undefined` |  |
| `referenceValue` | 否 | `number \| undefined` |  |
| `referenceLabel` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `color` | 否 | `string \| undefined` | Override bar color (Tailwind bg-* class). Defaults to accent.bg. |
| `inactiveColor` | 否 | `string \| undefined` | Override inactive bar color. Defaults to same as active. |
| `barWidth` | 否 | `"wide" \| "thin" \| undefined` |  |
| `showLabels` | 否 | `boolean \| undefined` |  |
| `showTooltip` | 否 | `boolean \| undefined` |  |
| `tooltipValue` | 否 | `string \| undefined` |  |
| `tooltipTrend` | 否 | `"up" \| "down" \| undefined` |  |
| `height` | 否 | `string \| undefined` |  |
