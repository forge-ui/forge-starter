# chart-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/chart-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartCard (value)

```ts
({ title, subtitle, children, footer, action, onMenuClick, size, width, minHeight, className, }: ChartCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `size` | 否 | `ChartCardSize \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Omitted/full fills the parent (dashboard/grid column). Use fixed only for Figma-size showcases. Takes precedence over `size`. |
| `minHeight` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
