# modal

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/modal.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Modal (value)

```ts
({ open, onOpenChange, title, children, footer, motion, locale, closeLabel, className }: ModalProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `open` | 是 | `boolean` |  |
| `onOpenChange` | 是 | `(open: boolean) => void` |  |
| `title` | 是 | `string` |  |
| `children` | 是 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `closeLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ModalProps (type)

```ts
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  motion?: MotionPreference;
  locale?: "zh" | "en";
  closeLabel?: string;
  className?: string;
}
```
