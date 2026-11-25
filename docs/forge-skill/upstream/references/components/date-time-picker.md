# date-time-picker

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/date-time-picker.tsx`；core **0.11.6**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DateTimePicker (value)

```ts
({ value, defaultValue, onChange, withSeconds, step, minDate, maxDate, label, placeholder, clearable, disabled, errorMessage, name, color, shape, motion, locale, width, className }: DateTimePickerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `Date \| null \| undefined` |  |
| `defaultValue` | 否 | `Date \| null \| undefined` |  |
| `onChange` | 否 | `((value: Date \| null) => void) \| undefined` |  |
| `withSeconds` | 否 | `boolean \| undefined` |  |
| `step` | 否 | `number \| undefined` | Minute (and second) step. |
| `minDate` | 否 | `Date \| undefined` |  |
| `maxDate` | 否 | `Date \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `clearable` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `errorMessage` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` | Submits an ISO-like local string "YYYY-MM-DDTHH:mm(:ss)". |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `shape` | 否 | `FloatingFieldShape \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `width` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## DateTimePickerProps (type)

```ts
export interface DateTimePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  withSeconds?: boolean;
  /** Minute (and second) step. */
  step?: number;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  /** Submits an ISO-like local string "YYYY-MM-DDTHH:mm(:ss)". */
  name?: string;
  color?: FormAccentColor;
  shape?: FloatingFieldShape;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  width?: string;
  className?: string;
}
```
