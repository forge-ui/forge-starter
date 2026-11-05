# drawer

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/drawer.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Drawer (value)

```ts
({ open, onOpenChange, title, children, footer, motion, side, className, locale, closeLabel, transition, revealOrigin }: DrawerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `side` | 否 | `"left" \| "right" \| undefined` |  |
| `transition` | 否 | `"slide" \| "reveal" \| undefined` |  |
| `revealOrigin` | 否 | `{ x: number; y: number; } \| undefined` |  |
| `open` | 是 | `boolean` |  |
| `onOpenChange` | 是 | `(open: boolean) => void` |  |
| `title` | 是 | `string` |  |
| `children` | 是 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `closeLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## DrawerProps (type)

```ts
export interface DrawerProps extends ModalProps { side?: "left" | "right"; transition?: "slide" | "reveal"; /** Viewport coordinates of the trigger center. */ revealOrigin?: { x: number; y: number } }
```
