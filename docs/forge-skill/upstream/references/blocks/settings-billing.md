# 账单与套餐

分类：设置。本期用量、付款方式、按月或按年对比的套餐卡片与历史账单下载。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CreditCard、Panel、ProgressBar、StatusBadge、cn。

## 最小可用示例

```tsx
import { SettingsBilling } from "@/components/blocks/settings-billing";

export default function Example() {
  return (<SettingsBilling onChangePlan={(plan, yearly) => console.log(plan, yearly)} />);
}
```

## SettingsBilling Props

| Prop | 必填 | Type |
|---|---|---|
| plans | 否 | `BillingPlan[] \| undefined` |
| currentPlan | 否 | `string \| undefined` |
| usage | 否 | `{ label: string; used: number; limit: number; unit: string; }[] \| undefined` |
| onChangePlan | 否 | `((planId: string, yearly: boolean) => void) \| undefined` |
| className | 否 | `string \| undefined` |
