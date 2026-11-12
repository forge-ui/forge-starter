# style-guide

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/style-guide.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ColorScaleStop (type)

```ts
export interface ColorScaleStop {
  shade: string; // "50", "100", ..., "900"
  hex: string;
}
```

## ColorSection (value)

```ts
({ title, scale, darkLabelUntil, swatchSize, }: { title: string; scale: ColorScaleStop[]; darkLabelUntil: number; swatchSize?: ColorSwatchSize; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `scale` | 是 | `ColorScaleStop[]` |  |
| `darkLabelUntil` | 是 | `number` | Shades ≤ this value get dark text; above get white text. |
| `swatchSize` | 否 | `ColorSwatchSize \| undefined` |  |

## ColorSwatch (value)

```ts
({ label, hex, tone, size, }: { label: string; hex: string; tone: "dark" | "light"; size?: ColorSwatchSize; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `hex` | 是 | `string` |  |
| `tone` | 是 | `"light" \| "dark"` |  |
| `size` | 否 | `ColorSwatchSize \| undefined` |  |

## ColorSwatchSize (type)

```ts
export type ColorSwatchSize = "sm" | "md" | "lg";
```

## TypefaceBlock (value)

```ts
({ name, sample, }: { name: string; sample?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `name` | 是 | `string` |  |
| `sample` | 否 | `string \| undefined` |  |

## TypographySizeRow (value)

```ts
({ label, text, sizeClass, }: { label: string; text: string; sizeClass: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `text` | 是 | `string` |  |
| `sizeClass` | 是 | `string` |  |

## TypographyWeightSample (value)

```ts
({ text, weight, sizeClass, }: { text: string; weight: FontWeight; sizeClass: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `text` | 是 | `string` |  |
| `weight` | 是 | `FontWeight` |  |
| `sizeClass` | 是 | `string` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->
