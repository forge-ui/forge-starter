# review-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/review-item.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ReviewItem (value)

```ts
(props: ReviewItemRegular | ReviewItemCard) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `"regular" \| "card" \| undefined` |  |
| `avatar` | 是 | `string` |  |
| `name` | 是 | `string` |  |
| `date` | 是 | `string` |  |
| `rating` | 是 | `number` |  |
| `content` | 是 | `string` |  |
| `ratingLabel` | 否 | `string \| undefined` |  |
| `images` | 否 | `string[] \| undefined` |  |
| `overflowImageCount` | 否 | `number \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 产品评论 / 星级打分 → `ReviewItem`
- 纯文字评论 → `CommentItem`
- 简单活动记录 → `ActivityCard`
