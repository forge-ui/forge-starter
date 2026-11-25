# preview-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/preview-card.tsx`；core **0.11.3**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PreviewCard (value)

```ts
({ trigger, children, side, align, delay, closeDelay, width, open: openProp, onOpenChange, className, motion, }: PreviewCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `trigger` | 是 | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | Usually a link. It must forward `ref` and spread props onto an `<a>` element. |
| `children` | 是 | `ReactNode` | Card content shown on hover or keyboard focus. |
| `side` | 否 | `PreviewCardSide \| undefined` |  |
| `align` | 否 | `PreviewCardAlign \| undefined` |  |
| `delay` | 否 | `number \| undefined` | Hover delay before opening, in milliseconds. |
| `closeDelay` | 否 | `number \| undefined` | Delay before closing after the pointer leaves, in milliseconds. |
| `width` | 否 | `string \| undefined` | Card width, any CSS width. Defaults to 320px. |
| `open` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## PreviewCardAlign (type)

```ts
export type PreviewCardAlign = "start" | "center" | "end";
```

## PreviewCardProps (type)

```ts
export interface PreviewCardProps {
  /** Usually a link. It must forward `ref` and spread props onto an `<a>` element. */
  trigger: ReactElement;
  /** Card content shown on hover or keyboard focus. */
  children: ReactNode;
  side?: PreviewCardSide;
  align?: PreviewCardAlign;
  /** Hover delay before opening, in milliseconds. */
  delay?: number;
  /** Delay before closing after the pointer leaves, in milliseconds. */
  closeDelay?: number;
  /** Card width, any CSS width. Defaults to 320px. */
  width?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  motion?: MotionPreference;
}
```

## PreviewCardSide (type)

```ts
export type PreviewCardSide = "top" | "bottom" | "left" | "right";
```
