# select-option

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/select-option.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SelectOption (value)

```ts
(props: SelectOptionProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `options` | 是 | `SelectOptionItem[]` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `errorMessage` | 否 | `string \| undefined` |  |
| `state` | 否 | `SelectOptionState \| undefined` |  |
| `shape` | 否 | `SelectOptionShape \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `type` | 否 | `"image" \| "single" \| "multiple" \| "general" \| undefined` |  |
| `bgVariant` | 否 | `SelectOptionBgVariant \| undefined` |  |
| `width` | 否 | `string \| undefined` | Trigger width. Defaults: single=200px, multiple=248px. Accepts any CSS width (e.g. "320px", "100%"). |
| `className` | 否 | `string \| undefined` |  |
| `headerAction` | 否 | `ReactNode` |  |
| `value` | 否 | `string \| string[] \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| ((value: string[]) => void) \| undefined` |  |

## SelectOptionBgVariant (type)

```ts
export type SelectOptionBgVariant = "white" | "grey";
```

## SelectOptionColor (type)

```ts
export type SelectOptionColor = FormAccentColor;
```

## SelectOptionItem (type)

```ts
export interface SelectOptionItem {
  value: string;
  label: string;
  image?: string;
  /** 图标建议使用 Solar；image 类型传入 image 时优先显示图片。 */
  icon?: ReactNode;
  /** 菜单项与单选触发器中的辅助说明。 */
  description?: string;
}
```

## SelectOptionProps (type)

```ts
export type SelectOptionProps = SingleProps | MultipleProps;
```

## SelectOptionShape (type)

```ts
export type SelectOptionShape = "rounded" | "pill";
```

## SelectOptionState (type)

```ts
export type SelectOptionState = "idle" | "focus" | "disabled" | "error";
```

## SelectOptionType (type)

```ts
export type SelectOptionType = "general" | "single" | "multiple" | "image";
```
