# stat-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/stat-card.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## StatCard (value)

```ts
({ title, value, animateValue, locale, numberFormat, motion, trend, trendDirection, subtitle, theme, size, icon, badgeVariant, action, onKebabClick, density, width, className, }: { title: string; value: ReactNode; animateValue?: boolean; locale?: string; numberFormat?: Intl.NumberFormatOptions; motion?: MotionPreference; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: StatCardTheme; size?: StatCardSize; icon?: ReactNode; badgeVariant?: CardBadgeVariant; action?: ReactNode; onKebabClick?: () => void; density?: "default" | "compact"; width?: CardWidth; className?: string; }) => JSX.Element
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
| `theme` | 否 | `StatCardTheme \| undefined` |  |
| `size` | 否 | `"lg" \| "sm" \| "wide" \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |
| `badgeVariant` | 否 | `CardBadgeVariant \| undefined` | Badge style for the icon chip. Defaults to the theme's iconChipBg in sm/lg, and to "opacity" (themed 10% bg + colored icon) in wide. |
| `action` | 否 | `ReactNode` | Custom action slot (e.g. button). Takes priority over onKebabClick. |
| `onKebabClick` | 否 | `(() => void) \| undefined` | If set, renders the built-in kebab-menu button. |
| `density` | 否 | `"default" \| "compact" \| undefined` | Use compact inside dense dashboards while preserving the default Figma showcase scale. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- Dashboard 首页的主要指标 → `size="sm"`，多张排网格，默认填满列宽
- 重点强调的单指标 → `size="lg"` + `theme` 品牌色 + icon
- 需要强视觉横向锚点 → `size="wide"`
- 需要右上菜单 → `onKebabClick`，或传 `action` 自定义
- 需要图表的指标 → 用 `ProgressStatCard` / `LineChartStatCard` 等变体
