# list-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/list-item.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DescriptionItem (value)

```ts
({ lead, label, content, actions, className, }: { lead?: DescriptionItemLead; label: string; content: ReactNode; actions?: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `lead` | 否 | `DescriptionItemLead \| undefined` |  |
| `label` | 是 | `string` |  |
| `content` | 是 | `ReactNode` |  |
| `actions` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## DescriptionItemLead (type)

```ts
export type DescriptionItemLead = ListItemIconLead | ListItemImageLead;
```

## ListItem (value)

```ts
({ lead, title, subtitle, value, trend, trendDirection, tailSubtext, trailing, className, onSwipeAction, swipeActionLabel, motion, }: { lead?: ListItemLead; title: string; subtitle?: string; value?: string; trend?: string; trendDirection?: "up" | "down"; tailSubtext?: string; trailing?: ReactNode; className?: string; onSwipeAction?: () => void; swipeActionLabel?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `lead` | 否 | `ListItemLead \| undefined` |  |
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| undefined` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `"up" \| "down" \| undefined` |  |
| `tailSubtext` | 否 | `string \| undefined` |  |
| `trailing` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |
| `onSwipeAction` | 否 | `(() => void) \| undefined` |  |
| `swipeActionLabel` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ListItemAvatarLead (type)

```ts
export type ListItemAvatarLead = {
  kind: "avatar";
  src?: string;
  initials?: string;
  alt?: string;
  online?: boolean;
  size?: AvatarSize;
};
```

## ListItemIconLead (type)

```ts
export type ListItemIconLead = {
  kind: "icon";
  icon: ReactNode;
  color?: CircleIconColor;
  variant?: CircleIconVariant;
  size?: CircleIconSize;
};
```

## ListItemImageLead (type)

```ts
export type ListItemImageLead = {
  kind: "image";
  src: string;
  alt?: string;
};
```

## ListItemLead (type)

```ts
export type ListItemLead =
  | ListItemIconLead
  | ListItemAvatarLead
  | ListItemImageLead;
```

## 选型

- 收入 / 账单 / 交易行 → `ListItem` lead=icon
- 用户行 → `ListItem` lead=avatar
- 商品行（方图） → `ListItem` lead=image 或 `ProductRow`
- 详情页字段 → `DescriptionItem`
