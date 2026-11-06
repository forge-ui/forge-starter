# pie-chart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/pie-chart.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PieChart (value)

```ts
({ segments, accent, size, trackColor }: PieChartProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `PieSegment[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| undefined` |  |
| `trackColor` | 否 | `string \| undefined` | Optional track color for unfilled remainder. Defaults to gray (fg-grey-200). |
