# small-daily-calendar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/small-daily-calendar.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DailyEvent (type)

```ts
export interface DailyEvent {
  title: string;
  timeRange: string;
  /** Start hour (0-23) */
  startHour: number;
  /** Duration in hours (can be fractional) */
  duration: number;
  /** Color for EventCard bottom bar */
  color?: EventCardColor;
  avatars?: string[];
  overflowCount?: number;
}
```

## SmallDailyCalendar (value)

```ts
({ title, subtitle, color, events, nowHour, onMenuClick, className, }: { title?: string; subtitle?: string; color?: AccentColor; events?: DailyEvent[]; nowHour?: number; onMenuClick?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `events` | 否 | `DailyEvent[] \| undefined` |  |
| `nowHour` | 否 | `number \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->
