# tab-bar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/tab-bar.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TabBar (value)

```ts
({ tabs, color, surface, appearance, progress, onChange, className, motion, ariaLabel, }: { tabs: TabItem[]; color?: TabBarColor; surface?: TabBarSurface; appearance?: "underline" | "dock"; progress?: number; onChange?: (index: number) => void; className?: string; motion?: MotionPreference; ariaLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tabs` | 是 | `TabItem[]` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `surface` | 否 | `TabBarSurface \| undefined` |  |
| `appearance` | 否 | `"underline" \| "dock" \| undefined` |  |
| `progress` | 否 | `number \| undefined` | Fractional panel index for a scroll-linked indicator. |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |

## TabBarColor (type)

```ts
export type TabBarColor = keyof typeof tabActiveColors;
```

## TabBarSurface (type)

```ts
export type TabBarSurface = "inline" | "page";
```

## TabItem (type)

```ts
export interface TabItem {
  label: string;
  active?: boolean;
  badge?: number;
  icon?: ReactNode;
  /** Optional association with the matching TabsContent panel. */
  id?: string;
  controls?: string;
}
```

## 选型

- 页面内部分 tab 切换（详情页的多视图、设置页的多分组）
- **ButtonGroup 是另一个选项** — 胶囊分段样式，适合紧凑空间
- tab 多（> 5）且需要 icon 时，考虑自己封装一层
