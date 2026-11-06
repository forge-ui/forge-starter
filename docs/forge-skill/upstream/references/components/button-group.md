# button-group

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/button-group.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ButtonGroup (value)

```ts
({ items, activeIndex, color, shape, onChange, className, motion, ariaLabel, }: { items: ButtonGroupItem[]; activeIndex?: number; color?: ButtonGroupColor; shape?: ButtonGroupShape; onChange?: (index: number) => void; className?: string; motion?: MotionPreference; ariaLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `ButtonGroupItem[]` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `shape` | 否 | `ButtonGroupShape \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |

## ButtonGroupColor (type)

```ts
export type ButtonGroupColor = keyof typeof activeItemColors;
```

## ButtonGroupItem (type)

```ts
export interface ButtonGroupItem {
  label: string;
}
```

## ButtonGroupShape (type)

```ts
export type ButtonGroupShape = "rounded" | "pill";
```

## 选型

- **ButtonGroup vs TabBar**：
  - ButtonGroup 更紧凑（外框内切分），适合过滤 / 时间区间 / 视图切换（卡片视图 / 列表视图）
  - TabBar 有下划线 + 底部延伸，适合页面级 tab
- pill 形状看起来更轻，rounded 更正式
