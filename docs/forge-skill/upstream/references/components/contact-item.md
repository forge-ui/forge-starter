# contact-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/contact-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ContactItem (value)

```ts
({ type, color, avatar, initials, name, message, online, active, unreadCount, time, className, }: { type?: "person" | "team"; color?: AccentColor; avatar?: string; initials?: string; name: string; message?: string; online?: boolean; active?: boolean; unreadCount?: number; time?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `type` | 否 | `"person" \| "team" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `avatar` | 否 | `string \| undefined` |  |
| `initials` | 否 | `string \| undefined` |  |
| `name` | 是 | `string` |  |
| `message` | 否 | `string \| undefined` |  |
| `online` | 否 | `boolean \| undefined` |  |
| `active` | 否 | `boolean \| undefined` |  |
| `unreadCount` | 否 | `number \| undefined` |  |
| `time` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 消息列表 / 联系人行 → `ContactItem`
- 通用头像行（不含消息） → `ListItem` lead="avatar"
- 评论头像 → `Avatar` 原子
