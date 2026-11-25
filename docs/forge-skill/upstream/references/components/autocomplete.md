# autocomplete

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/autocomplete.tsx`；core **0.11.3**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Autocomplete (value)

```ts
({ options, value, defaultValue, onChange, onSelect, label, placeholder, emptyText, errorMessage, state, shape, color, searchIcon, width, headerAction, name, locale, className, motion, }: AutocompleteProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `options` | 是 | `(string \| AutocompleteOption)[]` |  |
| `value` | 否 | `string \| undefined` |  |
| `defaultValue` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onSelect` | 否 | `((option: AutocompleteOption) => void) \| undefined` | Fires when a suggestion is picked (not on free typing). |
| `label` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `emptyText` | 否 | `ReactNode` | Shown when the text matches nothing. Omit to hide the list instead. |
| `errorMessage` | 否 | `string \| undefined` |  |
| `state` | 否 | `FloatingFieldState \| undefined` |  |
| `shape` | 否 | `FloatingFieldShape \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `searchIcon` | 否 | `boolean \| undefined` | Show a search icon at the start. |
| `width` | 否 | `string \| undefined` |  |
| `headerAction` | 否 | `ReactNode` |  |
| `name` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## AutocompleteColor (type)

```ts
export type AutocompleteColor = FormAccentColor;
```

## AutocompleteOption (type)

```ts
export interface AutocompleteOption {
  /** Text written into the input when picked. */
  value: string;
  /** Display text; defaults to `value`. */
  label?: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}
```

## AutocompleteProps (type)

```ts
export interface AutocompleteProps {
  options: (string | AutocompleteOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fires when a suggestion is picked (not on free typing). */
  onSelect?: (option: AutocompleteOption) => void;
  label?: string;
  placeholder?: string;
  /** Shown when the text matches nothing. Omit to hide the list instead. */
  emptyText?: ReactNode;
  errorMessage?: string;
  state?: AutocompleteState;
  shape?: AutocompleteShape;
  color?: AutocompleteColor;
  /** Show a search icon at the start. */
  searchIcon?: boolean;
  width?: string;
  headerAction?: ReactNode;
  name?: string;
  locale?: "zh" | "en";
  className?: string;
  motion?: MotionPreference;
}
```

## AutocompleteShape (type)

```ts
export type AutocompleteShape = FloatingFieldShape;
```

## AutocompleteState (type)

```ts
export type AutocompleteState = FloatingFieldState;
```
