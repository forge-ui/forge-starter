# 分步表单

分类：表单。流程较长的录入拆成选择商品、客户信息、配送支付、确认订单四步，每步只校验当前字段，可回到上一步修改，提交后展示结果页。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、PageTitleToolbar、RadioWithLabel、SelectOption、Stepper、TextArea、TextField。

## 最小可用示例

```tsx
import { OrderForm } from "@/components/blocks/order-form";

export default function Example() {
  return (<OrderForm onSubmit={draft => console.log(draft.customer)} />);
}
```

## OrderForm Props

| Prop | 必填 | Type |
|---|---|---|
| products | 否 | `OrderProduct[] \| undefined` |
| onSubmit | 否 | `((draft: OrderDraft) => void) \| undefined` |
| className | 否 | `string \| undefined` |
