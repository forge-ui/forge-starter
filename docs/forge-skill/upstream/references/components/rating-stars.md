# rating-stars

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/rating-stars.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## RatingStars (value)

```ts
({ value, total, showValue, size, className, onChange, readOnly, disabled, locale, ariaLabel, motion }: { value: number; total?: number; showValue?: boolean; size?: RatingStarsSize; className?: string; onChange?: (value: number) => void; readOnly?: boolean; disabled?: boolean; locale?: "zh" | "en"; ariaLabel?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `number` |  |
| `total` | 否 | `number \| undefined` |  |
| `showValue` | 否 | `boolean \| undefined` |  |
| `size` | 否 | `RatingStarsSize \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((value: number) => void) \| undefined` | Omit to keep the original read-only rating. |
| `readOnly` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## RatingStarsSize (type)

```ts
export type RatingStarsSize = "sm" | "md" | "lg";
```

## 选型建议

<!-- 待补：什么场景用这个 -->
