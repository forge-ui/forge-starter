# image-stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/image-stat-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ImageStatCard (value)

```ts
({ title, subtitle, value, trend, trendDirection, trendSubtitle, theme, size, action, onKebabClick, avatars, backgroundImage, backgroundImageAlt, density, width, className, }: { title: string; subtitle?: string; value: string; trend?: string; trendDirection?: TrendDirection; trendSubtitle?: string; theme?: ImageStatCardTheme; size?: ImageStatCardSize; action?: ReactNode; onKebabClick?: () => void; avatars?: string[]; backgroundImage?: string; backgroundImageAlt?: string; density?: CardDensity; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` | Secondary text below the title (e.g. date range "2 Jul - Today") |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `trendSubtitle` | 否 | `string \| undefined` | Secondary text next to trend (e.g. "+$150 today") |
| `theme` | 否 | `ImageStatCardTheme \| undefined` |  |
| `size` | 否 | `ImageStatCardSize \| undefined` |  |
| `action` | 否 | `ReactNode` | Custom action slot (e.g. external-link button). Takes priority over onKebabClick. |
| `onKebabClick` | 否 | `(() => void) \| undefined` |  |
| `avatars` | 否 | `string[] \| undefined` | Bottom-right overlapping avatar group. Hidden when `backgroundImage` is set. |
| `backgroundImage` | 否 | `string \| undefined` | Subject photo source (e.g. team-of-the-month portrait). Pinned to the card's bottom-right; text content stays in the left half above it. |
| `backgroundImageAlt` | 否 | `string \| undefined` |  |
| `density` | 否 | `CardDensity \| undefined` | Use compact inside dense dashboards while preserving the default Figma showcase scale. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## ImageStatCardProps (type)

```ts
export type ImageStatCardProps = Parameters<typeof ImageStatCard>[0];
```

## 选型

- 项目 / 团队摘要卡（需要展示责任人头像） → `ImageStatCard`
- 日期范围的汇总指标 → 用 `subtitle` 标注期间
- 纯数字指标不需要头像 → `StatCard lg`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
