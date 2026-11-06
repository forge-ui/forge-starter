# activity-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/activity-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ActivityCard (value)

```ts
({ icon, headerText, datetime, avatar, title, description, metadata, onMenuClick, }: { icon: ReactNode; headerText: string; datetime: string; avatar: string; title: string; description: string; metadata: { label: string; value: string | ReactNode; }[]; onMenuClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icon` | 是 | `ReactNode` |  |
| `headerText` | 是 | `string` |  |
| `datetime` | 是 | `string` |  |
| `avatar` | 是 | `string` |  |
| `title` | 是 | `string` |  |
| `description` | 是 | `string` |  |
| `metadata` | 是 | `{ label: string; value: string \| ReactNode; }[]` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |

## 选型

- 团队协作活动流 → `ActivityCard`
- 轻量时间线 → `HistoryItem` / `HistoryGrouped`
- 纯通知 → `NotificationItem`
