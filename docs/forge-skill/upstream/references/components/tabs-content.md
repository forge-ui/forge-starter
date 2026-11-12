# tabs-content

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/tabs-content.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TabsContent (value)

```ts
({ transition, ...props }: TabsContentProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `activeKey` | 是 | `string \| number` | Changing this key remounts content. Keep form state above this component. |
| `children` | 否 | `ReactNode` |  |
| `panels` | 否 | `{ key: string \| number; content: ReactNode; id?: string; labelledBy?: string; ariaLabel?: string; }[] \| undefined` | Optional full panel set enables native touch scrolling and mouse dragging. |
| `onActiveKeyChange` | 否 | `((key: string \| number) => void) \| undefined` |  |
| `onProgressChange` | 否 | `((fractionalIndex: number) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `transition` | 否 | `"fade" \| "slide" \| undefined` | Fade preserves the existing entry-only behavior. Slide also animates exit and height. |
| `direction` | 否 | `"forward" \| "backward" \| undefined` | Slide direction. Omit for automatic numeric-key ordering; string keys default to forward. |
| `id` | 否 | `string \| undefined` |  |
| `labelledBy` | 否 | `string \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TabsContentProps (type)

```ts
export interface TabsContentProps {
  /** Changing this key remounts content. Keep form state above this component. */
  activeKey: string | number;
  children?: ReactNode;
  /** Optional full panel set enables native touch scrolling and mouse dragging. */
  panels?: { key: string | number; content: ReactNode; id?: string; labelledBy?: string; ariaLabel?: string }[];
  onActiveKeyChange?: (key: string | number) => void;
  onProgressChange?: (fractionalIndex: number) => void;
  motion?: MotionPreference;
  /** Fade preserves the existing entry-only behavior. Slide also animates exit and height. */
  transition?: "fade" | "slide";
  /** Slide direction. Omit for automatic numeric-key ordering; string keys default to forward. */
  direction?: "forward" | "backward";
  id?: string;
  labelledBy?: string;
  ariaLabel?: string;
  className?: string;
}
```
