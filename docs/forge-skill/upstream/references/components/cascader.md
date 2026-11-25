# cascader

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/cascader.tsx`；core **0.11.3**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Cascader (value)

```ts
({ options, value, defaultValue, onChange, changeOnSelect, label, placeholder, separator, clearable, disabled, errorMessage, name, color, shape, motion, locale, width, className }: CascaderProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `options` | 是 | `CascaderOption[]` |  |
| `value` | 否 | `string[] \| undefined` | Path of values from the top level to the chosen option. |
| `defaultValue` | 否 | `string[] \| undefined` |  |
| `onChange` | 否 | `((path: string[], options: CascaderOption[]) => void) \| undefined` |  |
| `changeOnSelect` | 否 | `boolean \| undefined` | Allow choosing a parent, not only a leaf (e.g. "整个省"). |
| `label` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `separator` | 否 | `string \| undefined` |  |
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

## CascaderOption (type)

```ts
export interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
}
```

## CascaderProps (type)

```ts
export interface CascaderProps {
  options: CascaderOption[];
  /** Path of values from the top level to the chosen option. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (path: string[], options: CascaderOption[]) => void;
  /** Allow choosing a parent, not only a leaf (e.g. "整个省"). */
  changeOnSelect?: boolean;
  label?: string;
  placeholder?: string;
  separator?: string;
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
