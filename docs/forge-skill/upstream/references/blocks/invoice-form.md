# 单卡表单

分类：表单。一张卡片从上到下填完：客户与日期两列排开，收费明细在表格里直接编辑，合计紧跟在明细下方，付款说明和操作按钮收在卡片底部。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、IconButton、PageTitleToolbar、PlusIcon、SelectOption、TextArea、TextField。

## 最小可用示例

```tsx
import { InvoiceForm } from "@/components/blocks/invoice-form";

export default function Example() {
  return (<InvoiceForm onSend={(value, total) => console.log(value.invoiceId, total)} />);
}
```

## InvoiceForm Props

| Prop | 必填 | Type |
|---|---|---|
| value | 否 | `InvoiceFormValue \| undefined` |
| onSave | 否 | `((value: InvoiceFormValue) => void) \| undefined` |
| onSend | 否 | `((value: InvoiceFormValue, total: number) => void) \| undefined` |
| onCancel | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
