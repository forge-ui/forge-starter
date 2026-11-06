# line-chart-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/line-chart-stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## LineChartColor (type)

```ts
export type LineChartColor =
  | "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan";
```

## LineChartStatCard (value)

```ts
({ title, value, animateValue, locale, numberFormat, motion, trend, trendDirection, subtitle, theme, size, chartColor, chartDirection, series, icon, density, width, className, }: { title: string; value: ReactNode; animateValue?: boolean; locale?: string; numberFormat?: Intl.NumberFormatOptions; motion?: MotionPreference; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: LineChartStatCardTheme; size?: StatCardSize; chartColor?: LineChartColor; chartDirection?: "up" | "down"; series?: number[]; icon?: ReactNode; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `ReactNode` |  |
| `animateValue` | 否 | `boolean \| undefined` | Roll numeric values when they change. Strings and custom content stay unchanged. |
| `locale` | 否 | `string \| undefined` | Locale for numeric values when animation or numberFormat is enabled. |
| `numberFormat` | 否 | `Intl.NumberFormatOptions \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `LineChartStatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `chartColor` | 否 | `LineChartColor \| undefined` |  |
| `chartDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `series` | 否 | `number[] \| undefined` | Optional data points for the wide-mode line chart. Ignored when size !== "wide". |
| `icon` | 否 | `ReactNode` | Icon for the top-right chip (only rendered in size="wide"). |
| `density` | 否 | `CardDensity \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## LineChartStatCardProps (type)

```ts
export type LineChartStatCardProps = Parameters<typeof LineChartStatCard>[0];
```

## 选型

- 有时间序列 / 持续波动的指标（DAU / 流量 / 销售额） → `LineChartStatCard`
- 单值指标 → `StatCard`
- 带百分比进度 → `ProgressStatCard`
- 多数据对比 → `BarChartStatCard`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
