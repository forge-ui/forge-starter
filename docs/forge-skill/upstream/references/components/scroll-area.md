# scroll-area

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/scroll-area.tsx`；core **0.11.6**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ScrollArea (value)

```ts
({ children, orientation, maxHeight, height, className, contentClassName, ariaLabel, }: ScrollAreaProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `orientation` | 否 | `ScrollAreaOrientation \| undefined` | Scroll direction(s) that get a styled scrollbar. |
| `maxHeight` | 否 | `string \| undefined` | Max height of the scroll viewport, any CSS length. |
| `height` | 否 | `string \| undefined` | Height of the scroll viewport, any CSS length. |
| `className` | 否 | `string \| undefined` |  |
| `contentClassName` | 否 | `string \| undefined` | Class for the inner content wrapper. |
| `ariaLabel` | 否 | `string \| undefined` | Accessible name; set it when the area holds important content (it becomes focusable). |

## ScrollAreaOrientation (type)

```ts
export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
```

## ScrollAreaProps (type)

```ts
export interface ScrollAreaProps {
  children: ReactNode;
  /** Scroll direction(s) that get a styled scrollbar. */
  orientation?: ScrollAreaOrientation;
  /** Max height of the scroll viewport, any CSS length. */
  maxHeight?: string;
  /** Height of the scroll viewport, any CSS length. */
  height?: string;
  className?: string;
  /** Class for the inner content wrapper. */
  contentClassName?: string;
  /** Accessible name; set it when the area holds important content (it becomes focusable). */
  ariaLabel?: string;
}
```
