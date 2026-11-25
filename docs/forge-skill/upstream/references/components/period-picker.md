# period-picker

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/period-picker.tsx`；core **0.11.3**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PeriodGranularity (type)

```ts
export type PeriodGranularity = "month" | "quarter" | "year";
```

## PeriodPicker (value)

```ts
({ granularity, value, defaultValue, onChange, minDate, maxDate, label, placeholder, clearable, disabled, errorMessage, name, color, shape, motion, locale, width, className }: PeriodPickerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `granularity` | 是 | `PeriodGranularity` |  |
| `value` | 否 | `Date \| null \| undefined` |  |
| `defaultValue` | 否 | `Date \| null \| undefined` |  |
| `onChange` | 否 | `((start: Date \| null) => void) \| undefined` |  |
| `minDate` | 否 | `Date \| undefined` |  |
| `maxDate` | 否 | `Date \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `clearable` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `errorMessage` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` | Submits "YYYY-MM", "YYYY-Qn" or "YYYY". |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `shape` | 否 | `FloatingFieldShape \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `width` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## PeriodPickerProps (type)

```ts
export interface PeriodPickerProps {
  granularity: PeriodGranularity;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (start: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  /** Submits "YYYY-MM", "YYYY-Qn" or "YYYY". */
  name?: string;
  color?: FormAccentColor;
  shape?: FloatingFieldShape;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  width?: string;
  className?: string;
}
```
