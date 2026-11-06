# progress-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/progress-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProgressCard (value)

```ts
({ title, value, subtitle, theme, progress, progressColor, items, action, width, className, }: { title: string; value: string; subtitle: string; theme?: ProgressCardTheme; progress: number; progressColor: string; items: { label: string; value: string; color: string; }[]; action?: ReactNode; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `value` | 是 | `string` |  |
| `subtitle` | 是 | `string` |  |
| `theme` | 否 | `ProgressCardTheme \| undefined` |  |
| `progress` | 是 | `number` | 0-100 |
| `progressColor` | 是 | `string` | CSS color for the conic-gradient fill (e.g. "var(--fg-violet)") |
| `items` | 是 | `{ label: string; value: string; color: string; }[]` |  |
| `action` | 否 | `ReactNode` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 多分类进度可视化 → `ProgressCard`
- 单进度 → `ProgressStatCard` / `ProgressBar`
- 完整数据图表 → `DonutChart`（charts/）
