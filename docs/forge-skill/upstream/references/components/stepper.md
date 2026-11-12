# stepper

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/stepper.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Stepper (value)

```ts
({ total, current, color, className, items, onStepChange, motion, locale, indicator, }: { total?: number; current?: number; color?: StepperColor; className?: string; items?: StepperItem[]; onStepChange?: (current: number) => void; motion?: MotionPreference; locale?: "zh" | "en"; indicator?: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `total` | 否 | `number \| undefined` |  |
| `current` | 否 | `number \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `items` | 否 | `StepperItem[] \| undefined` |  |
| `onStepChange` | 否 | `((current: number) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `indicator` | 否 | `ReactNode` | A single moving marker, for example the vehicle in a delivery tracker. |

## StepperColor (type)

```ts
export type StepperColor = keyof typeof onColors;
```

## StepperItem (type)

```ts
export type StepperItem = { id: string; label: string; description?: string; icon?: ReactNode };
```

## 选型

- Onboarding / 新手引导底部指示器
- 多步表单顶部进度
- 图片轮播的位置提示
