# menu-item

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/menu-item.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MenuItem (value)

```ts
({ accent, surface, intent, kind, state, active, lead, label, badge, href, ariaLabel, expanded, className, motion, onClick, }: { accent?: MenuItemAccent; surface?: MenuItemSurface; intent?: MenuItemIntent; kind?: MenuItemKind; state?: MenuItemState; active?: boolean; lead?: MenuItemLead; label?: string; badge?: number; href?: string; ariaLabel?: string; expanded?: boolean; className?: string; motion?: MotionPreference; onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `accent` | 否 | `AccentColor \| undefined` |  |
| `surface` | 否 | `MenuItemSurface \| undefined` |  |
| `intent` | 否 | `MenuItemIntent \| undefined` |  |
| `kind` | 否 | `MenuItemKind \| undefined` |  |
| `state` | 否 | `MenuItemState \| undefined` |  |
| `active` | 否 | `boolean \| undefined` | shortcut for state='active' |
| `lead` | 否 | `MenuItemLead \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `badge` | 否 | `number \| undefined` |  |
| `href` | 否 | `string \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `expanded` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |

## MenuItemAccent (type)

```ts
export type MenuItemAccent = AccentColor;
```

## MenuItemIntent (type)

```ts
export type MenuItemIntent = "default" | "danger";
```

## MenuItemKind (type)

```ts
export type MenuItemKind = "single" | "submenu" | "dropdown";
```

## MenuItemLead (type)

```ts
export type MenuItemLead =
  | { kind: "icon"; icon: ReactNode }
  | { kind: "image"; src: string; alt?: string };
```

## MenuItemState (type)

```ts
export type MenuItemState = "idle" | "hover" | "active" | "disabled";
```

## MenuItemSurface (type)

```ts
export type MenuItemSurface = "default" | "onColoredBg";
```

## 选型

- sidebar 菜单项 → `MenuItem kind="dropdown|submenu"` + `lead="icon"`
- dropdown 列表项 → `MenuItem kind="single"`
- 危险菜单项 → `intent="danger"`（红色文字）
- 业务自定义菜单 → 直接用 `MenuItem`，自行组合
