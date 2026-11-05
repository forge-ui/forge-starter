# bar-chart-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/bar-chart-stat-card.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BarChartStatCard (value)

```ts
({ title, value, trend, trendDirection, subtitle, theme, size, density, barColor, bars, width, className, }: { title: string; value: string; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: BarChartStatCardTheme; size?: StatCardSize; density?: "default" | "compact"; barColor?: BarColor; bars?: number[]; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `BarChartStatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `density` | 否 | `"default" \| "compact" \| undefined` |  |
| `barColor` | 否 | `BarColor \| undefined` |  |
| `bars` | 否 | `number[] \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## BarColor (type)

```ts
export type BarColor = "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan";
```

## 选型

- 离散周期对比（周销售 / 日访问） → `BarChartStatCard`
- 连续趋势 → `LineChartStatCard`
- 完成度占比 → `WheelChartStatCard`
- 多维图表 → 用 `charts/` 下的 `BarChart`
