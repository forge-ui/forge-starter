# choice-groups

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/choice-groups.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CheckboxGroup (value)

```ts
({ options, value, defaultValue, onChange, selectAllLabel, name, disabled, color, orientation, ariaLabel, motion, className }: CheckboxGroupProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `options` | 是 | `ChoiceGroupOption[]` |  |
| `value` | 否 | `string[] \| undefined` |  |
| `defaultValue` | 否 | `string[] \| undefined` |  |
| `onChange` | 否 | `((value: string[]) => void) \| undefined` |  |
| `selectAllLabel` | 否 | `string \| undefined` | Adds a parent checkbox that selects every option and shows a partial state. |
| `name` | 否 | `string \| undefined` | Form field name; each checked option submits its value. |
| `disabled` | 否 | `boolean \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `orientation` | 否 | `ChoiceGroupOrientation \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CheckboxGroupProps (type)

```ts
export interface CheckboxGroupProps {
  options: ChoiceGroupOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Adds a parent checkbox that selects every option and shows a partial state. */
  selectAllLabel?: string;
  /** Form field name; each checked option submits its value. */
  name?: string;
  disabled?: boolean;
  color?: ChoiceGroupColor;
  orientation?: ChoiceGroupOrientation;
  ariaLabel?: string;
  motion?: MotionPreference;
  className?: string;
}
```

## ChoiceGroupColor (type)

```ts
export type ChoiceGroupColor = FormAccentColor;
```

## ChoiceGroupOption (type)

```ts
export interface ChoiceGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
```

## ChoiceGroupOrientation (type)

```ts
export type ChoiceGroupOrientation = "vertical" | "horizontal";
```

## RadioGroup (value)

```ts
({ options, value, defaultValue, onChange, name, required, disabled, color, orientation, ariaLabel, className }: RadioGroupProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `options` | 是 | `ChoiceGroupOption[]` |  |
| `value` | 否 | `string \| null \| undefined` |  |
| `defaultValue` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `name` | 否 | `string \| undefined` | Form field name; submits the chosen value. |
| `required` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `orientation` | 否 | `ChoiceGroupOrientation \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` | Accessible name when there is no visible group label. |
| `className` | 否 | `string \| undefined` |  |

## RadioGroupProps (type)

```ts
export interface RadioGroupProps {
  options: ChoiceGroupOption[];
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Form field name; submits the chosen value. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  color?: ChoiceGroupColor;
  orientation?: ChoiceGroupOrientation;
  /** Accessible name when there is no visible group label. */
  ariaLabel?: string;
  className?: string;
}
```

## ToggleGroup (value)

```ts
(props: ToggleGroupProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `options` | 是 | `ToggleGroupOption[]` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `multiple` | 否 | `boolean \| undefined` |  |
| `value` | 否 | `string \| string[] \| null \| undefined` |  |
| `defaultValue` | 否 | `string \| string[] \| undefined` |  |
| `onChange` | 否 | `((value: string \| null) => void) \| ((value: string[]) => void) \| undefined` |  |

## ToggleGroupOption (type)

```ts
export interface ToggleGroupOption {
  value: string;
  label?: string;
  icon?: ReactNode;
  /** Required when the option has only an icon. */
  ariaLabel?: string;
  disabled?: boolean;
}
```

## ToggleGroupProps (type)

```ts
export type ToggleGroupProps = ToggleGroupBase & (
  | { multiple?: false; value?: string | null; defaultValue?: string; onChange?: (value: string | null) => void }
  | { multiple: true; value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void }
);
```
