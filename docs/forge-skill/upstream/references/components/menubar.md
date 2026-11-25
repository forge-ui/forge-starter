# menubar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/menubar.tsx`；core **0.11.6**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Menubar (value)

```ts
({ menus, accent, ariaLabel, className, motion }: MenubarProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `menus` | 是 | `MenubarMenu[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## MenubarMenu (type)

```ts
export interface MenubarMenu {
  label: string;
  items: DropdownMenuEntry[];
  disabled?: boolean;
}
```

## MenubarProps (type)

```ts
export interface MenubarProps {
  menus: MenubarMenu[];
  accent?: DropdownMenuAccent;
  ariaLabel?: string;
  className?: string;
  motion?: MotionPreference;
}
```
