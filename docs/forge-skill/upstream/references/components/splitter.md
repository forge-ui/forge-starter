# splitter

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/splitter.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Splitter (value)

```ts
({ children, orientation, size, defaultSize, onSizeChange, min, max, handleLabel, className }: SplitterProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `[ReactNode, ReactNode]` | Exactly two panes: list and detail, editor and preview. |
| `orientation` | 否 | `"horizontal" \| "vertical" \| undefined` |  |
| `size` | 否 | `number \| undefined` | First pane size in percent. |
| `defaultSize` | 否 | `number \| undefined` |  |
| `onSizeChange` | 否 | `((size: number) => void) \| undefined` |  |
| `min` | 否 | `number \| undefined` |  |
| `max` | 否 | `number \| undefined` |  |
| `handleLabel` | 否 | `string \| undefined` | Accessible name of the drag handle. |
| `className` | 否 | `string \| undefined` |  |

## SplitterProps (type)

```ts
export interface SplitterProps {
  /** Exactly two panes: list and detail, editor and preview. */
  children: [ReactNode, ReactNode];
  orientation?: "horizontal" | "vertical";
  /** First pane size in percent. */
  size?: number;
  defaultSize?: number;
  onSizeChange?: (size: number) => void;
  min?: number;
  max?: number;
  /** Accessible name of the drag handle. */
  handleLabel?: string;
  className?: string;
}
```
