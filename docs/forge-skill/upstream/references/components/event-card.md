# event-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/event-card.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## EventCard (value)

```ts
({ title, timeRange, color, avatars, overflowCount, width, className, }: { title: string; timeRange?: string; color?: EventCardColor; avatars?: string[]; overflowCount?: number; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `timeRange` | 否 | `string \| undefined` | e.g. "10:00-11:00" |
| `color` | 否 | `EventCardColor \| undefined` |  |
| `avatars` | 否 | `string[] \| undefined` |  |
| `overflowCount` | 否 | `number \| undefined` | Number to show in "+N" overflow chip. If omitted, no chip is shown. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill calendar/list columns. Use fixed only for compact standalone showcases. |
| `className` | 否 | `string \| undefined` |  |

## EventCardColor (type)

```ts
export type EventCardColor = AccentColor | "red" | "yellow" | "green" | "cyan" | "orange";
```

## 选型建议

<!-- 待补：什么场景用这个 -->
