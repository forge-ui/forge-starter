# 客户详情

分类：详情页。客户画像卡、消费指标、最近购买、消费走势、订单与评价分页签。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、IconButton、Panel、ReviewItem、SmoothLineChart、StatCard、StatusBadge、TabBar、cn。

## 最小可用示例

```tsx
import { CustomerProfile } from "@/components/blocks/customer-profile";

export default function Example() {
  return (<CustomerProfile onMessage={() => {}} />);
}
```

## CustomerProfile Props

| Prop | 必填 | Type |
|---|---|---|
| customer | 否 | `CustomerProfileData \| undefined` |
| onCall | 否 | `(() => void) \| undefined` |
| onMessage | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
