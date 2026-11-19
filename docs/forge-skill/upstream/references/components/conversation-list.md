# conversation-list

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/conversation-list.tsx`；core **0.9.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ConversationItem (type)

```ts
export type ConversationItem = {
  id: string;
  title: string;
  /** Last activity; groups the list into today, yesterday, this week and earlier. */
  updatedAt?: number | Date;
  /** First line of the last message, shown under the title. */
  preview?: string;
  pinned?: boolean;
  /** The agent is still working in this conversation. */
  running?: boolean;
  /** Has a reply the user has not read. */
  unread?: boolean;
};
```

## ConversationList (value)

```ts
({ items, currentId, onSelect, onNew, onRename, onDelete, onPin, searchAfter, now: fixedNow, locale, motion, className }: ConversationListProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `ConversationItem[]` |  |
| `currentId` | 否 | `string \| undefined` |  |
| `onSelect` | 是 | `(id: string) => void` |  |
| `onNew` | 否 | `(() => void) \| undefined` |  |
| `onRename` | 否 | `((id: string, title: string) => void) \| undefined` |  |
| `onDelete` | 否 | `((id: string) => void) \| undefined` |  |
| `onPin` | 否 | `((id: string, pinned: boolean) => void) \| undefined` |  |
| `searchAfter` | 否 | `number \| undefined` | Shows a search field once there are more items than this. |
| `now` | 否 | `number \| undefined` | Reference time for the groups; pass it when rendering on the server. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ConversationListProps (type)

```ts
export type ConversationListProps = {
  items: ConversationItem[];
  currentId?: string;
  onSelect: (id: string) => void;
  onNew?: () => void;
  onRename?: (id: string, title: string) => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string, pinned: boolean) => void;
  /** Shows a search field once there are more items than this. */
  searchAfter?: number;
  /** Reference time for the groups; pass it when rendering on the server. */
  now?: number;
  locale?: AgentLocale;
  motion?: MotionPreference;
  className?: string;
};
```

## 选型

- 按时间分组、可搜索、置顶、重命名、删除的对话列表 → `ConversationList`（AgentPanel 的历史按钮已内置）

不要用：
- 普通导航列表 → `SidebarMenu` / `ListItem`
