# donut-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/donut-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DonutChart (value)

```ts
({ segments, interactive, activeIndex, onActiveIndexChange, onSegmentToggle, motion, ariaLabel, accent, centerValue, trend, trendDirection, subtitle, size, trackColor, }: DonutChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `DonutSegment[]` |  |
| `interactive` | 否 | `boolean \| undefined` | Individually focusable segments normalized to the included total. |
| `activeIndex` | 否 | `number \| undefined` |  |
| `onActiveIndexChange` | 否 | `((index: number \| undefined) => void) \| undefined` |  |
| `onSegmentToggle` | 否 | `((index: number) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` | Accent color drives segment colors when not explicitly set. Default "blue". |
| `centerValue` | 否 | `string \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| undefined` |  |
| `trackColor` | 否 | `string \| undefined` | Optional track color for unfilled remainder. Defaults to gray (fg-grey-200). |
