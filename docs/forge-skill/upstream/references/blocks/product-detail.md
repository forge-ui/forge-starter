# 商品详情

分类：详情页。商品图集、价格与规格选择、描述参数，以及订单和评价分页签。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Panel、StatusBadge、TabBar、cn。

## 最小可用示例

```tsx
import { ProductDetail } from "@/components/blocks/product-detail";

export default function Example() {
  return (<ProductDetail onEdit={() => {}} />);
}
```

## ProductDetail Props

| Prop | 必填 | Type |
|---|---|---|
| product | 否 | `ProductDetailData \| undefined` |
| onEdit | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
