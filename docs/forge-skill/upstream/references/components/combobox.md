# combobox

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/combobox.tsx`；core **0.11.5**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Combobox (value)

```ts
(props: ComboboxProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `options` | 是 | `ComboboxOption[]` |  |
| `label` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `emptyText` | 否 | `ReactNode` | Shown when the query matches nothing. |
| `errorMessage` | 否 | `string \| undefined` |  |
| `state` | 否 | `FloatingFieldState \| undefined` |  |
| `shape` | 否 | `FloatingFieldShape \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `width` | 否 | `string \| undefined` | Field width, any CSS width. Defaults to 100% of the parent. |
| `headerAction` | 否 | `ReactNode` |  |
| `name` | 否 | `string \| undefined` | Form field name; submits the selected value(s). |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `multiple` | 否 | `boolean \| undefined` |  |
| `value` | 否 | `string \| string[] \| null \| undefined` |  |
| `defaultValue` | 否 | `string \| string[] \| null \| undefined` |  |
| `onChange` | 否 | `((value: string \| null) => void) \| ((value: string[]) => void) \| undefined` |  |

## ComboboxColor (type)

```ts
export type ComboboxColor = FormAccentColor;
```

## ComboboxOption (type)

```ts
export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}
```

## ComboboxProps (type)

```ts
export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;
```

## ComboboxShape (type)

```ts
export type ComboboxShape = FloatingFieldShape;
```

## ComboboxState (type)

```ts
export type ComboboxState = FloatingFieldState;
```
