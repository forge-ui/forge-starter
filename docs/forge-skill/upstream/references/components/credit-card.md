# credit-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/credit-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CreditCard (value)

```ts
({ locale, cardNumberLabel, holderNameLabel, cardNumber, holderName, expiry, theme, variant, width, className, }: { locale?: "zh" | "en"; cardNumberLabel?: string; holderNameLabel?: string; cardNumber?: string; holderName?: string; expiry?: string; theme?: FinancialTheme; variant?: FinancialVariant; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `cardNumberLabel` | 否 | `string \| undefined` |  |
| `holderNameLabel` | 否 | `string \| undefined` |  |
| `cardNumber` | 否 | `string \| undefined` |  |
| `holderName` | 否 | `string \| undefined` |  |
| `expiry` | 否 | `string \| undefined` |  |
| `theme` | 否 | `FinancialTheme \| undefined` |  |
| `variant` | 否 | `FinancialVariant \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 信用卡管理页 → `CreditCard`
- 借记卡（需要余额显示） → `DebitCard`
- 账户余额卡片（带操作） → `BalanceCard`
