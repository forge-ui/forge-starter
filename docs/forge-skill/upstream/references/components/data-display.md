# data-display

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/data-display.tsx`；core **0.11.5**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CopyButton (value)

```ts
({ value, label, copiedLabel, ariaLabel, onCopy, className }: CopyButtonProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `string` |  |
| `label` | 否 | `string \| undefined` | Visible text; without it the button is icon-only. |
| `copiedLabel` | 否 | `string \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` | Accessible name for the icon-only button. |
| `onCopy` | 否 | `((value: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CopyButtonProps (type)

```ts
export interface CopyButtonProps {
  value: string;
  /** Visible text; without it the button is icon-only. */
  label?: string;
  copiedLabel?: string;
  /** Accessible name for the icon-only button. */
  ariaLabel?: string;
  onCopy?: (value: string) => void;
  className?: string;
}
```

## Descriptions (value)

```ts
({ items, title, extra, columns, variant, layout, className }: DescriptionsProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `DescriptionsItem[]` |  |
| `title` | 否 | `ReactNode` |  |
| `extra` | 否 | `ReactNode` | Actions on the right of the title, e.g. an "编辑" button. |
| `columns` | 否 | `2 \| 1 \| 3 \| 4 \| undefined` | Columns on wide screens; collapses to one column on phones. |
| `variant` | 否 | `"plain" \| "bordered" \| undefined` | `bordered` draws a table-like grid with shaded labels. |
| `layout` | 否 | `"horizontal" \| "vertical" \| undefined` | `horizontal` puts the label beside the value. |
| `className` | 否 | `string \| undefined` |  |

## DescriptionsItem (type)

```ts
export interface DescriptionsItem {
  label: ReactNode;
  value: ReactNode;
  /** Columns this item spans (desktop). */
  span?: number;
}
```

## DescriptionsProps (type)

```ts
export interface DescriptionsProps {
  items: DescriptionsItem[];
  title?: ReactNode;
  /** Actions on the right of the title, e.g. an "编辑" button. */
  extra?: ReactNode;
  /** Columns on wide screens; collapses to one column on phones. */
  columns?: 1 | 2 | 3 | 4;
  /** `bordered` draws a table-like grid with shaded labels. */
  variant?: "plain" | "bordered";
  /** `horizontal` puts the label beside the value. */
  layout?: "vertical" | "horizontal";
  className?: string;
}
```

## Kbd (value)

```ts
({ keys, children, className }: { keys?: string[]; children?: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `keys` | 否 | `string[] \| undefined` |  |
| `children` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## Separator (value)

```ts
({ orientation, label, className }: { orientation?: "horizontal" | "vertical"; label?: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `orientation` | 否 | `"horizontal" \| "vertical" \| undefined` |  |
| `label` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## Tag (value)

```ts
({ children, color, icon, onRemove, removeLabel, size, className }: TagProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `TagColor \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |
| `onRemove` | 否 | `(() => void) \| undefined` | Shows a remove button, e.g. for active filters or selected values. |
| `removeLabel` | 否 | `string \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TagColor (type)

```ts
export type TagColor = "grey" | "blue" | "green" | "yellow" | "red" | "violet";
```

## TagProps (type)

```ts
export interface TagProps {
  children: ReactNode;
  color?: TagColor;
  icon?: ReactNode;
  /** Shows a remove button, e.g. for active filters or selected values. */
  onRemove?: () => void;
  removeLabel?: string;
  size?: "sm" | "md";
  className?: string;
}
```

## Timeline (value)

```ts
({ items, pending, className }: { items: TimelineItem[]; pending?: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `TimelineItem[]` |  |
| `pending` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## TimelineItem (type)

```ts
export interface TimelineItem {
  title: ReactNode;
  description?: ReactNode;
  /** Time or date label. */
  time?: ReactNode;
  tone?: TimelineTone;
  /** Replaces the dot, e.g. an icon or avatar. */
  icon?: ReactNode;
}
```

## TimelineTone (type)

```ts
export type TimelineTone = "default" | "accent" | "success" | "warning" | "error";
```
