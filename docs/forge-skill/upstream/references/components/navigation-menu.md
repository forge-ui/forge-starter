# navigation-menu

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/navigation-menu.tsx`；core **0.11.5**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## NavigationMenu (value)

```ts
({ items, ariaLabel, className, motion }: NavigationMenuProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `NavigationMenuItem[]` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## NavigationMenuItem (type)

```ts
export type NavigationMenuItem =
  | { label: string; href: string; active?: boolean }
  /** A dropdown panel: pass `links` for a link grid, or `content` for anything custom. */
  | { label: string; links?: NavigationMenuLink[]; content?: ReactNode; columns?: 1 | 2 };
```

## NavigationMenuLink (type)

```ts
export interface NavigationMenuLink {
  label: string;
  href: string;
  description?: string;
  icon?: ReactNode;
}
```

## NavigationMenuProps (type)

```ts
export interface NavigationMenuProps {
  items: NavigationMenuItem[];
  ariaLabel?: string;
  className?: string;
  motion?: MotionPreference;
}
```
