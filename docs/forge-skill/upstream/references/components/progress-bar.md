# progress-bar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/progress-bar.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProgressBar (value)

```ts
({ value, color, size, label, labelVariant, labelSize, showPercentage, onDark, variant, indeterminate, motion, locale, children, className, }: { value?: number; color?: ProgressColor; size?: ProgressSize; label?: string; labelVariant?: ProgressLabelVariant; labelSize?: ProgressLabelSize; showPercentage?: boolean; onDark?: boolean; variant?: "linear" | "ring"; indeterminate?: boolean; motion?: MotionPreference; locale?: "zh" | "en"; children?: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `number \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| "gray" \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `labelVariant` | 否 | `ProgressLabelVariant \| undefined` |  |
| `labelSize` | 否 | `ProgressLabelSize \| undefined` |  |
| `showPercentage` | 否 | `boolean \| undefined` |  |
| `onDark` | 否 | `boolean \| undefined` |  |
| `variant` | 否 | `"linear" \| "ring" \| undefined` |  |
| `indeterminate` | 否 | `boolean \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `children` | 否 | `ReactNode` | Content centered in a ring, such as a remaining-time label. |
| `className` | 否 | `string \| undefined` |  |

## ProgressColor (type)

```ts
export type ProgressColor = keyof typeof progressColors;
```

## ProgressLabelSize (type)

```ts
export type ProgressLabelSize = "xs" | "sm";
```

## ProgressLabelVariant (type)

```ts
export type ProgressLabelVariant = "default" | "value";
```

## ProgressSize (type)

```ts
export type ProgressSize = keyof typeof progressSizes;
```

## 选型

- 任务进度 / 上传进度 → `default` label + showPercentage
- 数字量化展示（金额 / 配额 / 容量） → `labelVariant="value"`
- 在深色卡片 / dark mode → `onDark`
- 需要 label 在顶部（而非同行） → 外层自己布局
