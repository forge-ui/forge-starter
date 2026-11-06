# kebab-menu

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/kebab-menu.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## KebabMenu (value)

```ts
({ items, accent, surface, align, className, motion, }: { items: KebabMenuItem[]; accent?: KebabMenuAccent; surface?: IconTriggerSurface; align?: "left" | "right"; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `KebabMenuItem[]` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `surface` | 否 | `IconTriggerSurface \| undefined` |  |
| `align` | 否 | `"left" \| "right" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## KebabMenuAccent (type)

```ts
export type KebabMenuAccent = AccentColor;
```

## KebabMenuItem (type)

```ts
export type KebabMenuItem = {
  icon?: ReactNode;
  label: string;
  onSelect?: () => void;
  danger?: boolean;
};
```

## 选型

- 表格行尾、卡片右上角的"更多"菜单 → `KebabMenu`
- 自定义触发器 + 自定义面板 → `IconTrigger` + `DropdownPanel` 组合
- 纯 icon 按钮（无菜单） → `IconButton`
