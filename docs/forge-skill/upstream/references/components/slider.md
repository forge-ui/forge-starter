# slider

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/slider.tsx`；core **0.11.5**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Slider (value)

```ts
<Value extends SliderValue = number>(props: SliderProps<Value>) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `min` | 否 | `number \| undefined` |  |
| `max` | 否 | `number \| undefined` |  |
| `step` | 否 | `number \| undefined` |  |
| `format` | 否 | `Intl.NumberFormatOptions \| undefined` | Format for the value readout and screen readers, e.g. `{ style: "percent" }`. |
| `label` | 否 | `ReactNode` |  |
| `ariaLabel` | 否 | `string \| undefined` | Accessible name when there is no visible label. |
| `showValue` | 否 | `boolean \| undefined` | Show the formatted value next to the label. |
| `disabled` | 否 | `boolean \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `width` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `value` | 否 | `Value \| undefined` |  |
| `defaultValue` | 否 | `Value \| undefined` |  |
| `onChange` | 否 | `((value: Value) => void) \| undefined` |  |
| `onCommit` | 否 | `((value: Value) => void) \| undefined` | Fires once when the user releases the thumb. |

## SliderColor (type)

```ts
export type SliderColor = FormAccentColor;
```

## SliderProps (type)

```ts
export type SliderProps<Value extends SliderValue = number> = SliderBaseProps & {
  value?: Value;
  defaultValue?: Value;
  onChange?: (value: Value) => void;
  /** Fires once when the user releases the thumb. */
  onCommit?: (value: Value) => void;
};
```

## SliderValue (type)

```ts
export type SliderValue = number | [number, number];
```
