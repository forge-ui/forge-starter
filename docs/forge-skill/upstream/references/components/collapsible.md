# collapsible

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/collapsible.tsx`；core **0.11.3**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Collapsible (value)

```ts
({ title, children, open, defaultOpen, onOpenChange, disabled, motion, className }: CollapsibleProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `ReactNode` | Text or content of the toggle row. |
| `children` | 是 | `ReactNode` |  |
| `open` | 否 | `boolean \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CollapsibleProps (type)

```ts
export interface CollapsibleProps {
  /** Text or content of the toggle row. */
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  motion?: MotionPreference;
  className?: string;
}
```
