# dropdown-menu

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/dropdown-menu.tsx`；core **0.11.3**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ContextMenu (value)

```ts
({ children, items, accent, open: openProp, defaultOpen, onOpenChange, className, areaClassName, motion, }: ContextMenuProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `DropdownMenuEntry[]` |  |
| `accent` | 否 | `AccentColor \| undefined` | Highlight color for checked entries. |
| `open` | 否 | `boolean \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `children` | 是 | `ReactNode` | Area that opens the menu on right click or long press. |
| `areaClassName` | 否 | `string \| undefined` | Class for the trigger area. |

## ContextMenuEntry (type)

```ts
export type ContextMenuEntry = DropdownMenuEntry;
```

## ContextMenuProps (type)

```ts
export type ContextMenuProps = SharedMenuProps & {
  /** Area that opens the menu on right click or long press. */
  children: ReactNode;
  /** Class for the trigger area. */
  areaClassName?: string;
};
```

## DropdownMenu (value)

```ts
({ trigger, items, accent, side, align, openOnHover, open: openProp, defaultOpen, onOpenChange, className, motion, }: DropdownMenuProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `DropdownMenuEntry[]` |  |
| `accent` | 否 | `AccentColor \| undefined` | Highlight color for checked entries. |
| `open` | 否 | `boolean \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `trigger` | 是 | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | Element that opens the menu. It must forward `ref` and spread props onto a DOM element (Button, IconTrigger, native button). |
| `side` | 否 | `DropdownMenuSide \| undefined` |  |
| `align` | 否 | `DropdownMenuAlign \| undefined` |  |
| `openOnHover` | 否 | `boolean \| undefined` | Open on hover as well as click. |

## DropdownMenuAccent (type)

```ts
export type DropdownMenuAccent = AccentColor;
```

## DropdownMenuActionEntry (type)

```ts
export type DropdownMenuActionEntry = EntryBase & {
  type?: "item";
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  /** Shortcut hint shown on the right, e.g. "⌘K". Display only. */
  shortcut?: string;
  danger?: boolean;
  /** Renders the item as a link. */
  href?: string;
  onSelect?: () => void;
};
```

## DropdownMenuAlign (type)

```ts
export type DropdownMenuAlign = "start" | "center" | "end";
```

## DropdownMenuCheckboxEntry (type)

```ts
export type DropdownMenuCheckboxEntry = EntryBase & {
  type: "checkbox";
  label: ReactNode;
  icon?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};
```

## DropdownMenuDividerEntry (type)

```ts
export type DropdownMenuDividerEntry = { type: "divider"; key?: string };
```

## DropdownMenuEntry (type)

```ts
export type DropdownMenuEntry =
  | DropdownMenuActionEntry
  | DropdownMenuCheckboxEntry
  | DropdownMenuSubmenuEntry
  | DropdownMenuGroupEntry
  | DropdownMenuDividerEntry;
```

## DropdownMenuGroupEntry (type)

```ts
export type DropdownMenuGroupEntry = { type: "group"; key?: string; label: ReactNode; items: DropdownMenuEntry[] };
```

## DropdownMenuProps (type)

```ts
export type DropdownMenuProps = SharedMenuProps & {
  /** Element that opens the menu. It must forward `ref` and spread props onto a DOM element (Button, IconTrigger, native button). */
  trigger: ReactElement;
  side?: DropdownMenuSide;
  align?: DropdownMenuAlign;
  /** Open on hover as well as click. */
  openOnHover?: boolean;
};
```

## DropdownMenuSide (type)

```ts
export type DropdownMenuSide = "top" | "bottom" | "left" | "right";
```

## DropdownMenuSubmenuEntry (type)

```ts
export type DropdownMenuSubmenuEntry = EntryBase & {
  type: "submenu";
  label: ReactNode;
  icon?: ReactNode;
  items: DropdownMenuEntry[];
};
```
