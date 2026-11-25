# time-picker

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/time-picker.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TimePicker (value)

```ts
({ value, defaultValue, onChange, withSeconds, step, label, placeholder, clearable, disabled, errorMessage, name, color, shape, motion, locale, width, className }: TimePickerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `string \| undefined` | "HH:mm" or "HH:mm:ss"; empty string or undefined for no value. |
| `defaultValue` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `withSeconds` | 否 | `boolean \| undefined` |  |
| `step` | 否 | `number \| undefined` | Minute (and second) step, e.g. 5 or 15. |
| `label` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `clearable` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `errorMessage` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `shape` | 否 | `FloatingFieldShape \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `width` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TimePickerProps (type)

```ts
export interface TimePickerProps {
  /** "HH:mm" or "HH:mm:ss"; empty string or undefined for no value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  withSeconds?: boolean;
  /** Minute (and second) step, e.g. 5 or 15. */
  step?: number;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  name?: string;
  color?: FormAccentColor;
  shape?: FloatingFieldShape;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  width?: string;
  className?: string;
}
```
