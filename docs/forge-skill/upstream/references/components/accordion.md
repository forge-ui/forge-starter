# accordion

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/accordion.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Accordion (value)

```ts
({ items, value, defaultValue, onValueChange, motion, className }: AccordionProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `AccordionItem[]` |  |
| `value` | 否 | `string \| null \| undefined` |  |
| `defaultValue` | 否 | `string \| null \| undefined` |  |
| `onValueChange` | 否 | `((value: string \| null) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AccordionItem (type)

```ts
export interface AccordionItem { value: string; title: string; content: ReactNode; disabled?: boolean }
```

## AccordionProps (type)

```ts
export interface AccordionProps {
  items: AccordionItem[]; value?: string | null; defaultValue?: string | null;
  onValueChange?: (value: string | null) => void; motion?: MotionPreference; className?: string;
}
```
