# dropdown-panel

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/dropdown-panel.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DropdownDivider (value)

```ts
() => JSX.Element
```

## DropdownPanel (value)

```ts
({ children, width, padding, className, motion, }: { children: ReactNode; width?: string; padding?: string; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `width` | 否 | `string \| undefined` |  |
| `padding` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## 选型

- 用户菜单 / profile 下拉 / kebab 展开 → `DropdownPanel`
- 列表分组 → 中间插 `DropdownDivider`
- 带触发器的完整下拉 → 配合 `IconTrigger` + 自己管理 open state
