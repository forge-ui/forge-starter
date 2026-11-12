# 订单详情

分类：详情页。订单状态、商品明细、费用汇总、客户与收货信息，以及物流进度弹窗。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、HistoryItem、InfoRow、Label、Modal、Panel、SelectOption、StatusBadge、cn。

## 最小可用示例

```tsx
import { OrderDetail } from "@/components/blocks/order-detail";

export default function Example() {
  return (<OrderDetail onStatusChange={status => console.log(status)} />);
}
```

## OrderDetail Props

| Prop | 必填 | Type |
|---|---|---|
| order | 否 | `OrderDetailData \| undefined` |
| onStatusChange | 否 | `((status: OrderDetailStatus) => void) \| undefined` |
| onViewInvoice | 否 | `((invoiceId: string) => void) \| undefined` |
| className | 否 | `string \| undefined` |
