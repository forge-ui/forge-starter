# comment-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/comment-item.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CommentData (type)

```ts
export type CommentData = CommentReply & {
  images?: string[];
  replies?: CommentReply[];
  className?: string;
};
```

## CommentItem (value)

```ts
({ avatar, name, date, content, images, onReply, replyLabel, replies, className, }: CommentData) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `avatar` | 是 | `string` |  |
| `name` | 是 | `string` |  |
| `date` | 是 | `string` |  |
| `content` | 是 | `string` |  |
| `onReply` | 否 | `(() => void) \| undefined` |  |
| `replyLabel` | 否 | `string \| undefined` |  |
| `images` | 否 | `string[] \| undefined` |  |
| `replies` | 否 | `CommentReply[] \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CommentReply (type)

```ts
export type CommentReply = {
  avatar: string;
  name: string;
  date: string;
  content: string;
  onReply?: () => void;
  replyLabel?: string;
};
```

## 选型

- 讨论区 / 评论列表 → `CommentItem`
- 打分评价 → `ReviewItem`（带 rating）
- 活动日志 → `ActivityCard`
