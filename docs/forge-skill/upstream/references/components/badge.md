# badge

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/badge.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ArtisticIcon (value)

```ts
({ children, color, variant, }: { children: ReactNode; color?: ArtisticIconColor; variant?: ArtisticIconVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| undefined` |  |
| `variant` | 否 | `ArtisticIconVariant \| undefined` |  |

## ArtisticIconColor (type)

```ts
export type ArtisticIconColor = keyof typeof artisticShells;
```

## ArtisticIconVariant (type)

```ts
export type ArtisticIconVariant = "gradient" | "orbs";
```

## CircleIcon (value)

```ts
({ children, color, size, variant, }: { children: ReactNode; color?: CircleIconColor; size?: CircleIconSize; variant?: CircleIconVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| "red" \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| "xs" \| undefined` |  |
| `variant` | 否 | `"solid" \| "light" \| "neutral" \| undefined` |  |

## CircleIconColor (type)

```ts
export type CircleIconColor = keyof typeof circleIconVariants.solid;
```

## CircleIconSize (type)

```ts
export type CircleIconSize = keyof typeof circleIconSizes;
```

## CircleIconVariant (type)

```ts
export type CircleIconVariant = keyof typeof circleIconVariants;
```

## Label (value)

```ts
({ children, color, size, variant, }: { children: ReactNode; color?: LabelColor; size?: LabelSize; variant?: LabelVariant; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| "yellow" \| "cyan" \| "red" \| "gray" \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| undefined` |  |
| `variant` | 否 | `LabelVariant \| undefined` |  |

## LabelColor (type)

```ts
export type LabelColor = keyof typeof labelColors;
```

## LabelSize (type)

```ts
export type LabelSize = keyof typeof labelSizes;
```

## LabelVariant (type)

```ts
export type LabelVariant = "outline" | "solid";
```

## NotificationBadge (value)

```ts
({ children, color, }: { children: ReactNode; color?: NotificationBadgeColor; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "black" \| undefined` |  |

## NotificationBadgeColor (type)

```ts
export type NotificationBadgeColor = keyof typeof notificationColors;
```

## 选型

| 场景 | 采用 |
|---|---|
| 铃铛未读数/角标 | NotificationBadge |
| 业务生命周期状态 | StatusBadge，variant="soft"，文字与语义色同时呈现 |
| 分类/角色/渠道 | 普通文字，不做彩虹胶囊 |
| 表格状态列 | 默认 soft StatusBadge，通常最多一个状态胶囊列 |
| 明确要求的营销强调 | Label 的真实变体，先确认视觉需求，不替代业务状态规则 |

完整规范见 [状态表达](../status-presentation.md)。
