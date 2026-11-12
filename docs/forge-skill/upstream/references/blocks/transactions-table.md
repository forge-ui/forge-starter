# 交易流水

分类：财务。支出构成圆环、月度预算进度，配合按收支方向筛选与搜索的交易明细表。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：ButtonGroup、CellTextSubtitle、DataTable、DonutChart、IconButton、Modal、Panel、ProgressBar、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { TransactionsTable } from "@/components/blocks/transactions-table";

export default function Example() {
  return (<TransactionsTable budget={80000} />);
}
```

## TransactionsTable Props

| Prop | 必填 | Type |
|---|---|---|
| transactions | 否 | `TransactionRecord[] \| undefined` |
| categories | 否 | `ExpenseCategory[] \| undefined` |
| budget | 否 | `number \| undefined` |
| className | 否 | `string \| undefined` |
