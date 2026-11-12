# calendar-day-cell

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/calendar-day-cell.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CalendarDayCell (value)

```ts
({ day, isToday, isSelected, isOtherMonth, events, maxVisible, moreAvatar, onMoreClick, className, }: { day: number; isToday?: boolean; isSelected?: boolean; isOtherMonth?: boolean; events?: { label: string; color: EventTagColor; avatar?: string; }[]; maxVisible?: number; moreAvatar?: string; onMoreClick?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `day` | 是 | `number` |  |
| `isToday` | 否 | `boolean \| undefined` |  |
| `isSelected` | 否 | `boolean \| undefined` |  |
| `isOtherMonth` | 否 | `boolean \| undefined` |  |
| `events` | 否 | `{ label: string; color: EventTagColor; avatar?: string; }[] \| undefined` |  |
| `maxVisible` | 否 | `number \| undefined` | Max visible event tags before showing "+N More" (default 3) |
| `moreAvatar` | 否 | `string \| undefined` | Avatar shown next to "+N More..." text |
| `onMoreClick` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->
