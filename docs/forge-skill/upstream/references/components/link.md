# link

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/link.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## LinkColor (type)

```ts
export type LinkColor = keyof typeof linkColors;
```

## StyledLink (value)

```ts
({ children, href, color, disabled, iconLeft, iconRight, className, effect, motion, }: { children: ReactNode; href: string; color?: LinkColor; disabled?: boolean; iconLeft?: ReactNode; iconRight?: ReactNode; className?: string; effect?: "magnetic" | "roll"; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `href` | 是 | `string` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "red" \| "gray" \| "dark" \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `iconLeft` | 否 | `ReactNode` |  |
| `iconRight` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |
| `effect` | 否 | `"magnetic" \| "roll" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## 选型

- 正文内的跳转链接 → `StyledLink`
- 整块可点卡片 / 按钮 → `Button` 或 `IconButton`
- 纯 URL 跳转（无需样式） → 直接用 `<Link>`
