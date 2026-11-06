# calendar-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/calendar-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CalendarCard (value)

```ts
({ size, variant, color, value, defaultDate, locale, labels, disabled, motion: motionPreference, className, onChange }: CalendarCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `size` | 否 | `"default" \| "compact" \| undefined` | Default preserves the original card geometry; compact uses form typography. |
| `variant` | 否 | `"card" \| "plain" \| undefined` | Plain removes both decorative card surfaces and their padding. |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "black" \| "red" \| "dark" \| "grey" \| "blue-dark" \| undefined` |  |
| `value` | 否 | `Date \| undefined` |  |
| `defaultDate` | 否 | `Date \| undefined` |  |
| `onChange` | 否 | `((date: Date) => void) \| undefined` |  |
| `locale` | 否 | `string \| undefined` |  |
| `labels` | 否 | `Partial<CalendarCardLabels> \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CalendarCardLabels (type)

```ts
export type CalendarCardLabels = { changeMonth: string; previousMonth: string; nextMonth: string; previousYear: string; nextYear: string };
```

## CalendarCardProps (type)

```ts
export type CalendarCardProps = {
  /** Default preserves the original card geometry; compact uses form typography. */
  size?: "default" | "compact";
  /** Plain removes both decorative card surfaces and their padding. */
  variant?: "card" | "plain";
  color?: ButtonColor;
  value?: Date;
  defaultDate?: Date;
  onChange?: (date: Date) => void;
  locale?: string;
  labels?: Partial<CalendarCardLabels>;
  disabled?: boolean;
  motion?: MotionPreference;
  className?: string;
};
```
