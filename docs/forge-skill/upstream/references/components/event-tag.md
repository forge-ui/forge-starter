# event-tag

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/event-tag.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## EventTag (value)

```ts
({ label, color, size, variant, avatar, block, className, }: { label: string; color?: EventTagColor; size?: EventTagSize; variant?: EventTagVariant; avatar?: string; block?: boolean; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `variant` | 否 | `EventTagVariant \| undefined` |  |
| `avatar` | 否 | `string \| undefined` | Small circular avatar shown before the label (Figma Month cell style) |
| `block` | 否 | `boolean \| undefined` | Use block-level flex (fills parent width). Default inline-flex. |
| `className` | 否 | `string \| undefined` |  |

## EventTagColor (type)

```ts
export type EventTagColor = keyof typeof solidColors;
```

## EventTagSize (type)

```ts
export type EventTagSize = keyof typeof sizes;
```

## EventTagVariant (type)

```ts
export type EventTagVariant = "solid" | "outline";
```

## 选型建议

<!-- 待补：什么场景用这个 -->
