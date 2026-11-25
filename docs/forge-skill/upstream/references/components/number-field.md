# number-field

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/number-field.tsx`；core **0.11.5**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## NumberField (value)

```ts
({ value, defaultValue, onChange, min, max, step, format, label, placeholder, suffix, errorMessage, state, shape, color, width, headerAction, name, locale, className, }: NumberFieldProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `number \| null \| undefined` |  |
| `defaultValue` | 否 | `number \| undefined` |  |
| `onChange` | 否 | `((value: number \| null) => void) \| undefined` | `null` when the input is cleared. |
| `min` | 否 | `number \| undefined` |  |
| `max` | 否 | `number \| undefined` |  |
| `step` | 否 | `number \| undefined` |  |
| `format` | 否 | `Intl.NumberFormatOptions \| undefined` | Display format, e.g. `{ style: "currency", currency: "CNY" }` or `{ style: "percent" }`. |
| `label` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `suffix` | 否 | `ReactNode` | Text after the number, e.g. a unit. |
| `errorMessage` | 否 | `string \| undefined` |  |
| `state` | 否 | `FloatingFieldState \| undefined` |  |
| `shape` | 否 | `FloatingFieldShape \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `width` | 否 | `string \| undefined` |  |
| `headerAction` | 否 | `ReactNode` |  |
| `name` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## NumberFieldColor (type)

```ts
export type NumberFieldColor = FormAccentColor;
```

## NumberFieldProps (type)

```ts
export interface NumberFieldProps {
  value?: number | null;
  defaultValue?: number;
  /** `null` when the input is cleared. */
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Display format, e.g. `{ style: "currency", currency: "CNY" }` or `{ style: "percent" }`. */
  format?: Intl.NumberFormatOptions;
  label?: string;
  placeholder?: string;
  /** Text after the number, e.g. a unit. */
  suffix?: ReactNode;
  errorMessage?: string;
  state?: NumberFieldState;
  shape?: NumberFieldShape;
  color?: NumberFieldColor;
  width?: string;
  headerAction?: ReactNode;
  name?: string;
  locale?: "zh" | "en";
  className?: string;
}
```

## NumberFieldShape (type)

```ts
export type NumberFieldShape = FloatingFieldShape;
```

## NumberFieldState (type)

```ts
export type NumberFieldState = FloatingFieldState;
```
