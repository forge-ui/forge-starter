# currency-converter

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/currency-converter.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CurrencyConverter (value)

```ts
({ title, subtitle, color, fromValue, fromCurrency, fromPlaceholder, toValue, toCurrency, toPlaceholder, exchangeRateText, convertLabel, convertIcon, onMenuClick, onConvert, onFromChange, onToChange, onFromCurrencyChange, onToCurrencyChange, width, className, }: CurrencyConverterProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `CurrencyConverterColor \| undefined` |  |
| `fromValue` | 否 | `string \| undefined` |  |
| `fromCurrency` | 否 | `string \| undefined` |  |
| `fromPlaceholder` | 否 | `string \| undefined` |  |
| `toValue` | 否 | `string \| undefined` |  |
| `toCurrency` | 否 | `string \| undefined` |  |
| `toPlaceholder` | 否 | `string \| undefined` |  |
| `exchangeRateText` | 否 | `string \| undefined` |  |
| `convertLabel` | 否 | `string \| undefined` |  |
| `convertIcon` | 否 | `ReactNode` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `onConvert` | 否 | `(() => void) \| undefined` |  |
| `onFromChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onToChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onFromCurrencyChange` | 否 | `(() => void) \| undefined` |  |
| `onToCurrencyChange` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## CurrencyConverterColor (type)

```ts
export type CurrencyConverterColor = "purple" | "blue" | "dark";
```

## 选型建议

<!-- 待补：什么场景用这个 -->
