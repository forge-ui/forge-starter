# history-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/history-item.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## HistoryItem (value)

```ts
({ variant, color, title, description, datetime, showDatetime, tags, icon, avatar, showConnector, className, }: HistoryItemProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `HistoryItemVariant \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "gray" \| undefined` |  |
| `title` | 是 | `string` |  |
| `description` | 否 | `ReactNode` |  |
| `datetime` | 否 | `string \| undefined` |  |
| `showDatetime` | 否 | `HistoryItemShowDatetime \| undefined` |  |
| `tags` | 否 | `ReactNode` |  |
| `icon` | 否 | `ReactNode` |  |
| `avatar` | 否 | `string \| undefined` |  |
| `showConnector` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## HistoryItemColor (type)

```ts
export type HistoryItemColor = keyof typeof historyItemColors;
```

## HistoryItemProps (type)

```ts
export interface HistoryItemProps {
  variant?: HistoryItemVariant;
  color?: HistoryItemColor;
  title: string;
  description?: ReactNode;
  datetime?: string;
  showDatetime?: HistoryItemShowDatetime;
  tags?: ReactNode;
  icon?: ReactNode;
  avatar?: string;
  showConnector?: boolean;
  className?: string;
}
```

## HistoryItemShowDatetime (type)

```ts
export type HistoryItemShowDatetime = "inline" | "bottom";
```

## HistoryItemVariant (type)

```ts
export type HistoryItemVariant = "regular" | "badge" | "profile";
```

## 选型

- 操作日志时间轴 → `HistoryItem variant="regular"`
- 状态变更（icon 明确） → `variant="badge"`
- 人物动态 → `variant="profile"`
- 分组按日期 → 外层包 `HistoryGrouped`
