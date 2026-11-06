# chart-list-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/chart-list-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartListItem (value)

```ts
({ icon: Icon, accent, title, subtitle, value, trend, trendDirection, }: ChartListItemProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icon` | 否 | `IconComponent \| undefined` | Forge icon component reference (e.g. `WalletLinear`). Accent drives its color + bg. |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `value` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
