# balance-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/balance-card.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BalanceCard (value)

```ts
({ title, balance, trend, trendDirection, subtitle, theme, balanceHidden, cardNumber, cardIcon, onTransfer, onRequest, density, width, className, }: { title?: string; balance: string; trend?: string; trendDirection?: TrendDirection; subtitle?: string; theme?: BalanceCardTheme; balanceHidden?: boolean; cardNumber?: string; cardIcon?: string; onTransfer?: () => void; onRequest?: () => void; density?: "default" | "compact"; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `balance` | 是 | `string` |  |
| `trend` | 否 | `string \| undefined` |  |
| `trendDirection` | 否 | `TrendDirection \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `theme` | 否 | `BalanceCardTheme \| undefined` |  |
| `balanceHidden` | 否 | `boolean \| undefined` |  |
| `cardNumber` | 否 | `string \| undefined` |  |
| `cardIcon` | 否 | `string \| undefined` |  |
| `onTransfer` | 否 | `(() => void) \| undefined` |  |
| `onRequest` | 否 | `(() => void) \| undefined` |  |
| `density` | 否 | `"default" \| "compact" \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 账户 / 钱包主卡 → `BalanceCard`
- 支付卡展示（借记 / 信用） → `DebitCard` / `CreditCard`
- 纯金额指标 → `StatCard`（`labelVariant="value"`）
