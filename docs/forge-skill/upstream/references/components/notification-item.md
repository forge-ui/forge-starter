# notification-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/notification-item.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## NotificationItem (value)

```ts
({ tag, time, title, body, unread, color, onMarkRead, actionLabel, className, leadIcon, }: { tag?: string; time?: string; title: string; body?: string; unread?: boolean; color?: NotificationItemColor; onMarkRead?: () => void; actionLabel?: string; className?: string; leadIcon?: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tag` | 否 | `string \| undefined` |  |
| `time` | 否 | `string \| undefined` |  |
| `title` | 是 | `string` |  |
| `body` | 否 | `string \| undefined` |  |
| `unread` | 否 | `boolean \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `onMarkRead` | 否 | `(() => void) \| undefined` |  |
| `actionLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `leadIcon` | 否 | `ReactNode` |  |

## NotificationItemColor (type)

```ts
export type NotificationItemColor = AccentColor;
```

## 选型

- 通知中心 panel 条目 → `NotificationItem`
- 实时 toast 提示 → 用第三方库（如 `sonner` / `react-hot-toast`）
- 业务活动记录 → `ActivityCard`
