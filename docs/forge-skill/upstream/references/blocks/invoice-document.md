# 发票单据

分类：详情页。可打印的发票版式，含开票方、收货方、商品明细、税费合计与发送下载操作。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、HistoryItem、Label、Panel、ProgressBar、StatusBadge、cn。

## 最小可用示例

```tsx
import { InvoiceDocument } from "@/components/blocks/invoice-document";

export default function Example() {
  return (<InvoiceDocument onSend={invoice => console.log(invoice.id)} />);
}
```

## InvoiceDocument Props

| Prop | 必填 | Type |
|---|---|---|
| invoice | 否 | `InvoiceDocumentData \| undefined` |
| onSend | 否 | `((invoice: InvoiceDocumentData) => void) \| undefined` |
| onDownload | 否 | `((invoice: InvoiceDocumentData) => void) \| undefined` |
| onEdit | 否 | `((invoice: InvoiceDocumentData) => void) \| undefined` |
| className | 否 | `string \| undefined` |
