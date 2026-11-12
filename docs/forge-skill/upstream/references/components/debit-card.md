# debit-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/debit-card.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## DebitCard (value)

```ts
({ locale, balanceLabel, balance, cardNumber, expiry, theme, variant, width, className, }: { balance?: string; locale?: "zh" | "en"; balanceLabel?: string; cardNumber?: string; expiry?: string; theme?: FinancialTheme; variant?: FinancialVariant; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `balance` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `balanceLabel` | 否 | `string \| undefined` |  |
| `cardNumber` | 否 | `string \| undefined` |  |
| `expiry` | 否 | `string \| undefined` |  |
| `theme` | 否 | `FinancialTheme \| undefined` |  |
| `variant` | 否 | `FinancialVariant \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 物理实体卡展示（支付页 / 钱包卡片列表） → `DebitCard` / `CreditCard`
- 账户余额 + 操作按钮 → `BalanceCard`
- 纯数字指标 → `StatCard`
