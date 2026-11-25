# popconfirm

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/popconfirm.tsx`；core **0.11.5**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Popconfirm (value)

```ts
({ trigger, title, description, confirmLabel, cancelLabel, tone, onConfirm, onCancel, side, align, open: openProp, onOpenChange, motion, className }: PopconfirmProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `trigger` | 是 | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | The button that asks for confirmation. Must forward ref and props to a DOM element. |
| `title` | 是 | `ReactNode` |  |
| `description` | 否 | `ReactNode` |  |
| `confirmLabel` | 否 | `string \| undefined` |  |
| `cancelLabel` | 否 | `string \| undefined` |  |
| `tone` | 否 | `"default" \| "danger" \| undefined` | `danger` for deletes and other irreversible actions. |
| `onConfirm` | 是 | `() => void \| Promise<unknown>` | May return a promise; the button shows a spinner and the bubble stays open until it settles. |
| `onCancel` | 否 | `(() => void) \| undefined` |  |
| `side` | 否 | `"bottom" \| "top" \| "left" \| "right" \| undefined` |  |
| `align` | 否 | `"start" \| "center" \| "end" \| undefined` |  |
| `open` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## PopconfirmProps (type)

```ts
export interface PopconfirmProps {
  /** The button that asks for confirmation. Must forward ref and props to a DOM element. */
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` for deletes and other irreversible actions. */
  tone?: "default" | "danger";
  /** May return a promise; the button shows a spinner and the bubble stays open until it settles. */
  onConfirm: () => void | Promise<unknown>;
  onCancel?: () => void;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  motion?: MotionPreference;
  className?: string;
}
```
