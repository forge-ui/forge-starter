# small-calendar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/small-calendar.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SmallCalendar (value)

```ts
({ title, subtitle, color, events, onMenuClick, width, className, }: { title?: string; subtitle?: string; color?: AccentColor; events?: SmallCalendarEvent[]; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `events` | 否 | `SmallCalendarEvent[] \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## SmallCalendarEvent (type)

```ts
export interface SmallCalendarEvent {
  day: number;
  title: string;
  timeRange: string;
  color?: EventCardColor;
  avatars?: string[];
  overflowCount?: number;
}
```

## 选型建议

<!-- 待补：什么场景用这个 -->
