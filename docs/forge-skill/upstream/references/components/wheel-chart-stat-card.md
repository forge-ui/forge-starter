# wheel-chart-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/wheel-chart-stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## WheelChartStatCard (value)

```ts
({ title, value, trend, trendDirection, subtitle, theme, size, density, wheelColor, wheelPercent, icon, width, className, }: { title: string; value: string; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: WheelChartStatCardTheme; size?: StatCardSize; density?: "default" | "compact"; wheelColor?: WheelColor; wheelPercent?: number; icon?: ReactNode; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `WheelChartStatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `density` | 否 | `"default" \| "compact" \| undefined` |  |
| `wheelColor` | 否 | `WheelColor \| undefined` |  |
| `wheelPercent` | 否 | `number \| undefined` |  |
| `icon` | 否 | `ReactNode` | Icon for the top-right chip (only rendered in size="wide"). |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## WheelChartStatCardProps (type)

```ts
export type WheelChartStatCardProps = Parameters<typeof WheelChartStatCard>[0];
```

## WheelColor (type)

```ts
export type WheelColor = "purple" | "blue" | "green" | "red" | "orange" | "yellow" | "cyan";
```

## 选型

- 单指标完成度展示（使用率 / 满意度 / 目标达成） → `WheelChartStatCard`
- 线性进度 → `ProgressStatCard`
- 多指标对比环 → `DonutChart`（`charts/`）

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
