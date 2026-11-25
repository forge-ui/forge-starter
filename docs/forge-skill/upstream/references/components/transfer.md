# transfer

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/transfer.tsx`；core **0.11.5**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Transfer (value)

```ts
({ items, value, defaultValue, onChange, titles, searchable, color, motion, locale, className }: TransferProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `TransferItem[]` |  |
| `value` | 否 | `string[] \| undefined` | Values in the right-hand ("chosen") list. |
| `defaultValue` | 否 | `string[] \| undefined` |  |
| `onChange` | 否 | `((value: string[]) => void) \| undefined` |  |
| `titles` | 否 | `[ReactNode, ReactNode] \| undefined` |  |
| `searchable` | 否 | `boolean \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TransferItem (type)

```ts
export interface TransferItem {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
```

## TransferProps (type)

```ts
export interface TransferProps {
  items: TransferItem[];
  /** Values in the right-hand ("chosen") list. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  titles?: [ReactNode, ReactNode];
  searchable?: boolean;
  color?: FormAccentColor;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  className?: string;
}
```
