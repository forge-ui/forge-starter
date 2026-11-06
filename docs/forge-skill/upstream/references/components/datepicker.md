# datepicker

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/datepicker.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Datepicker (value)

```ts
({ value, rangeStart, rangeEnd, locale, placeholder, confirmSelection, rangeLabels, inline, minDate, maxDate, state, shape, color, mode, label, onChange, onRangeChange, className, }: { value?: Date; locale?: "zh" | "en"; confirmSelection?: boolean; rangeLabels?: [string, string]; inline?: boolean; minDate?: Date; maxDate?: Date; rangeStart?: Date; rangeEnd?: Date; placeholder?: string; state?: DatepickerState; shape?: DatepickerShape; color?: DatepickerColor; mode?: DatepickerMode; label?: string; onChange?: (date: Date) => void; onRangeChange?: (start: Date, end: Date | null) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `Date \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `confirmSelection` | 否 | `boolean \| undefined` | Keep the range in a draft until the user applies it. |
| `rangeLabels` | 否 | `[string, string] \| undefined` | Optional separate start/end triggers. |
| `inline` | 否 | `boolean \| undefined` |  |
| `minDate` | 否 | `Date \| undefined` |  |
| `maxDate` | 否 | `Date \| undefined` |  |
| `rangeStart` | 否 | `Date \| undefined` |  |
| `rangeEnd` | 否 | `Date \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `state` | 否 | `DatepickerState \| undefined` |  |
| `shape` | 否 | `DatepickerShape \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `mode` | 否 | `DatepickerMode \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((date: Date) => void) \| undefined` |  |
| `onRangeChange` | 否 | `((start: Date, end: Date \| null) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## DatepickerColor (type)

```ts
export type DatepickerColor = FormAccentColor;
```

## DatepickerMode (type)

```ts
export type DatepickerMode = "single" | "range";
```

## DatepickerShape (type)

```ts
export type DatepickerShape = "rounded" | "pill";
```

## DatepickerState (type)

```ts
export type DatepickerState = "idle" | "focus" | "filled" | "disabled" | "error";
```
