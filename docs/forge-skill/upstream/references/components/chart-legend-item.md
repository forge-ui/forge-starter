# chart-legend-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/chart-legend-item.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartLegendItem (value)

```ts
({ color, accent, shade, label, value }: ChartLegendItemProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `color` | 否 | `string \| undefined` | Tailwind bg-* class override. When omitted, uses `accent` + `shade` index into ramp. |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `shade` | 否 | `0 \| 2 \| 1 \| 3 \| 4 \| undefined` | Ramp index (0 = deepest, 4 = lightest). Default 0. |
| `label` | 是 | `string` |  |
| `value` | 是 | `string` |  |
