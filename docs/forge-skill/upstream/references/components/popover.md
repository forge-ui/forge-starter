# popover

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/popover.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Popover (value)

```ts
({ trigger, children, title, description, side, align, sideOffset, open: openProp, defaultOpen, onOpenChange, openOnHover, width, className, motion, }: PopoverProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `trigger` | 是 | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | Element that toggles the popover. It must forward `ref` and spread props onto a DOM element (Button, IconTrigger, native button). |
| `children` | 是 | `ReactNode \| ((close: () => void) => ReactNode)` | Panel content. Pass a function to receive `close`. |
| `title` | 否 | `ReactNode` |  |
| `description` | 否 | `ReactNode` |  |
| `side` | 否 | `PopoverSide \| undefined` |  |
| `align` | 否 | `PopoverAlign \| undefined` |  |
| `sideOffset` | 否 | `number \| undefined` | Gap between trigger and panel, in pixels. |
| `open` | 否 | `boolean \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `openOnHover` | 否 | `boolean \| undefined` | Open on hover as well as click. |
| `width` | 否 | `string \| undefined` | Panel width, any CSS width. Defaults to content width (max 320px). |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## PopoverAlign (type)

```ts
export type PopoverAlign = "start" | "center" | "end";
```

## PopoverProps (type)

```ts
export interface PopoverProps {
  /** Element that toggles the popover. It must forward `ref` and spread props onto a DOM element (Button, IconTrigger, native button). */
  trigger: ReactElement;
  /** Panel content. Pass a function to receive `close`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  title?: ReactNode;
  description?: ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  /** Gap between trigger and panel, in pixels. */
  sideOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Open on hover as well as click. */
  openOnHover?: boolean;
  /** Panel width, any CSS width. Defaults to content width (max 320px). */
  width?: string;
  className?: string;
  motion?: MotionPreference;
}
```

## PopoverSide (type)

```ts
export type PopoverSide = "top" | "bottom" | "left" | "right";
```
