# progress-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/progress-stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProgressStatCard (value)

```ts
({ title, value, trend, trendDirection, subtitle, theme, size, progressValue, progressColor, icon, action, onKebabClick, density, width, className, }: { title: string; value: string; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: ProgressStatCardTheme; size?: StatCardSize; progressValue?: number; progressColor?: ProgressFillColor; icon?: ReactNode; action?: ReactNode; onKebabClick?: () => void; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `ProgressStatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `progressValue` | 否 | `number \| undefined` | 0-100 |
| `progressColor` | 否 | `ProgressFillColor \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `onKebabClick` | 否 | `(() => void) \| undefined` |  |
| `density` | 否 | `CardDensity \| undefined` | Use compact inside dense dashboards while preserving the default Figma showcase scale. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## ProgressStatCardProps (type)

```ts
export type ProgressStatCardProps = Parameters<typeof ProgressStatCard>[0];
```

## 选型

- 有百分比的指标（完成率 / 使用率 / 容量） → `ProgressStatCard`
- 纯数字指标 → `StatCard`
- 带小图 sparkline 的 → `LineChartStatCard`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
