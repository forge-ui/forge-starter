# folder

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/folder.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Folder (value)

```ts
({ label, items, color, size, open, defaultOpen, onOpenChange, onItemClick, disabled, className, mode, variant, layout, paperColor, tabPosition, openOn, frost, tilt, speed, bounce, peek, intro, draggable, zoomOnClick, theme }: FolderProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `items` | 否 | `FolderItem[] \| undefined` |  |
| `color` | 否 | `string \| undefined` |  |
| `mode` | 否 | `"flap" \| "book" \| undefined` |  |
| `variant` | 否 | `"solid" \| "glass" \| "matte" \| undefined` |  |
| `layout` | 否 | `"row" \| "spread" \| "stack" \| undefined` |  |
| `paperColor` | 否 | `string \| undefined` |  |
| `tabPosition` | 否 | `"left" \| "right" \| "center" \| undefined` |  |
| `openOn` | 否 | `"hover" \| "click" \| undefined` |  |
| `frost` | 否 | `number \| undefined` |  |
| `tilt` | 否 | `number \| undefined` |  |
| `speed` | 否 | `number \| undefined` |  |
| `bounce` | 否 | `number \| undefined` |  |
| `peek` | 否 | `boolean \| undefined` |  |
| `intro` | 否 | `boolean \| undefined` |  |
| `draggable` | 否 | `boolean \| undefined` |  |
| `zoomOnClick` | 否 | `boolean \| undefined` |  |
| `theme` | 否 | `"light" \| "dark" \| undefined` |  |
| `size` | 否 | `number \| "lg" \| "md" \| "sm" \| undefined` |  |
| `open` | 否 | `boolean \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `onItemClick` | 否 | `((item: FolderItem, index: number) => void) \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FolderItem (type)

```ts
export type FolderItem = { id?: string; label?: string; title?: string; image?: string; alt?: string; description?: string; content?: ReactNode };
```

## FolderProps (type)

```ts
export type FolderProps = {
  label: string;
  items?: FolderItem[];
  color?: string;
  mode?: "flap" | "book";
  variant?: "solid" | "glass" | "matte";
  layout?: "spread" | "stack" | "row";
  paperColor?: string;
  tabPosition?: "left" | "center" | "right";
  openOn?: "click" | "hover";
  frost?: number;
  tilt?: number;
  speed?: number;
  bounce?: number;
  peek?: boolean;
  intro?: boolean;
  draggable?: boolean;
  zoomOnClick?: boolean;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (item: FolderItem, index: number) => void;
  disabled?: boolean;
  className?: string;
};
```
