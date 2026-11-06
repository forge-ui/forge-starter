# icon-selector

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/icon-selector.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ColorPicker (value)

```ts
({ colors, selectedIndex, onChange, className, }: { colors?: string[]; selectedIndex?: number; onChange?: (index: number) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `colors` | 否 | `string[] \| undefined` |  |
| `selectedIndex` | 否 | `number \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## IconPicker (value)

```ts
({ icons, labels, selectedIndex, onChange, color, className, }: { icons: ReactNode[]; labels?: string[]; selectedIndex?: number; onChange?: (index: number) => void; color?: IconSelectorColor; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icons` | 是 | `ReactNode[]` |  |
| `labels` | 否 | `string[] \| undefined` |  |
| `selectedIndex` | 否 | `number \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## IconSelector (value)

```ts
({ icons, selectedIndex, onChange, labels, label, color, searchPlaceholder, className, }: { icons: ReactNode[]; selectedIndex?: number; onChange?: (index: number) => void; labels?: string[]; label?: string; color?: IconSelectorColor; searchPlaceholder?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icons` | 是 | `ReactNode[]` |  |
| `selectedIndex` | 否 | `number \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `labels` | 否 | `string[] \| undefined` | Searchable accessible names aligned with `icons`. Without labels, search leaves all icons visible. |
| `label` | 否 | `string \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `searchPlaceholder` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## IconSelectorColor (type)

```ts
export type IconSelectorColor = FormAccentColor;
```
