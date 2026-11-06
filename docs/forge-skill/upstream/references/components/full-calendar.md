# full-calendar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/full-calendar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CalendarEvent (type)

```ts
export interface CalendarEvent {
  day: number;
  label: string;
  color: EventTagColor;
  avatar?: string;
  hour?: number;
}
```

## FullCalendar (value)

```ts
({ view, color, year: yearProp, month: monthProp, day: dayProp, events, detailPanel, onCloseDetail, onViewChange, onEdit, onMore, className, }: { view?: CalendarView; color?: AccentColor; year?: number; month?: number; day?: number; events?: CalendarEvent[]; detailPanel?: ReactNode; onCloseDetail?: () => void; onViewChange?: (view: CalendarView) => void; onEdit?: () => void; onMore?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `view` | 否 | `CalendarView \| undefined` | Controlled when onViewChange is set; otherwise the select keeps its own view after the first change. |
| `color` | 否 | `AccentColor \| undefined` |  |
| `year` | 否 | `number \| undefined` | Shown until the user moves the calendar. |
| `month` | 否 | `number \| undefined` |  |
| `day` | 否 | `number \| undefined` |  |
| `events` | 否 | `CalendarEvent[] \| undefined` |  |
| `detailPanel` | 否 | `ReactNode` | Floating detail overlay. Pass ReactNode to show, omit to hide. |
| `onCloseDetail` | 否 | `(() => void) \| undefined` |  |
| `onViewChange` | 否 | `((view: CalendarView) => void) \| undefined` |  |
| `onEdit` | 否 | `(() => void) \| undefined` |  |
| `onMore` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->
