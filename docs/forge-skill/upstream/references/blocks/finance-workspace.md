# 财务工作区

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Panel、DescriptionItem、SurfaceCard、ToolbarKebabButton。

## 最小可用示例

```tsx
import { FinanceSurface } from "@/components/blocks/finance-workspace";

export default function Example() {
  return (<FinanceSurface title="财务摘要">本月收入：12000 元</FinanceSurface>);
}
```

## FinanceSurface Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| eyebrow | 否 | `string \| undefined` |
| action | 否 | `ReactNode` |
| children | 是 | `ReactNode` |
| className | 否 | `string \| undefined` |

## FieldLine Props

| Prop | 必填 | Type |
|---|---|---|
| label | 是 | `string` |
| value | 是 | `string` |

## VisualCard Props

| Prop | 必填 | Type |
|---|---|---|
| theme | 是 | `"purple" \| "blue" \| "yellow" \| "dark"` |
| name | 是 | `string` |
| type | 是 | `string` |
| last4 | 是 | `string` |
| balance | 是 | `string` |

## FinanceMetricCard Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| value | 是 | `string` |
| trend | 是 | `string` |
| note | 是 | `string` |
| chartColor | 否 | `"blue" \| "green" \| "red" \| undefined` |

## WalletProgressLine Props

| Prop | 必填 | Type |
|---|---|---|
| value | 是 | `number` |
| color | 是 | `"purple" \| "blue" \| "green" \| "red" \| "yellow" \| "cyan"` |

## FinanceGoalCell Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| subtitle | 否 | `string \| undefined` |
| color | 是 | `"purple" \| "blue" \| "green" \| "red" \| "yellow" \| "cyan"` |

## FinanceTransactionCell Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| subtitle | 是 | `string` |
| color | 是 | `"purple" \| "blue" \| "green" \| "red" \| "yellow" \| "cyan"` |

## FinanceExpenseGauge Props

| Prop | 必填 | Type |
|---|---|---|


## FinanceBudgetPanel Props

| Prop | 必填 | Type |
|---|---|---|

