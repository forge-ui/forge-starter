# 发票列表

分类：数据列表。按付款状态筛选的发票表，显示付款方、金额、开票与到期日，并汇总待收金额。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CellImageText、CellMuted、CellText、DataTable、IconButton、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { InvoicesTable } from "@/components/blocks/invoices-table";

export default function Example() {
  return (<InvoicesTable onOpen={invoice => console.log(invoice.id)} />);
}
```

## InvoicesTable Props

| Prop | 必填 | Type |
|---|---|---|
| invoices | 否 | `InvoiceRecord[] \| undefined` |
| onCreate | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((invoice: InvoiceRecord) => void) \| undefined` |
| onDownload | 否 | `((invoice: InvoiceRecord) => void) \| undefined` |
| className | 否 | `string \| undefined` |
