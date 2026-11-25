# tag-input

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/tag-input.tsx`；core **0.11.5**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TagInput (value)

```ts
({ value, defaultValue, onChange, label, placeholder, max, validate, separators, disabled, errorMessage, name, color, shape, locale, className }: TagInputProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `string[] \| undefined` |  |
| `defaultValue` | 否 | `string[] \| undefined` |  |
| `onChange` | 否 | `((tags: string[]) => void) \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `max` | 否 | `number \| undefined` | Upper limit; the input disables when reached. |
| `validate` | 否 | `((tag: string) => string \| null \| undefined) \| undefined` | Return an error message to reject a tag, e.g. an invalid email. |
| `separators` | 否 | `string[] \| undefined` | Keys that commit the typed text, besides Enter. |
| `disabled` | 否 | `boolean \| undefined` |  |
| `errorMessage` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `shape` | 否 | `FloatingFieldShape \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TagInputProps (type)

```ts
export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  /** Upper limit; the input disables when reached. */
  max?: number;
  /** Return an error message to reject a tag, e.g. an invalid email. */
  validate?: (tag: string) => string | null | undefined;
  /** Keys that commit the typed text, besides Enter. */
  separators?: string[];
  disabled?: boolean;
  errorMessage?: string;
  name?: string;
  color?: FormAccentColor;
  shape?: FloatingFieldShape;
  locale?: "zh" | "en";
  className?: string;
}
```
