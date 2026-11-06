# history-grouped

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/history-grouped.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## HistoryGrouped (value)

```ts
({ title, subtitle, badge, items, action, progressHeight, color, className, }: { title: string; subtitle?: string; badge?: ReactNode; items: HistoryItemProps[]; action?: ReactNode; progressHeight?: string; color?: HistoryItemColor; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `badge` | 否 | `ReactNode` |  |
| `items` | 是 | `HistoryItemProps[]` |  |
| `action` | 否 | `ReactNode` |  |
| `progressHeight` | 否 | `string \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "gray" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 订单进度 / 流程追踪 → `HistoryGrouped`
- 单条时间轴（无卡） → 直接 `HistoryItem` 列表
- 活动流 → `ActivityCard`
