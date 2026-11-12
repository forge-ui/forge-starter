# 企业卡管理

分类：财务。企业卡列表与选中卡的额度、使用进度、临时冻结和最近消费。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CreditCard、Panel、PlusIcon、ProgressBar、StatusBadge、cn。

## 最小可用示例

```tsx
import { CardsManagement } from "@/components/blocks/cards-management";

export default function Example() {
  return (<CardsManagement onFreezeChange={(cardId, frozen) => console.log(cardId, frozen)} />);
}
```

## CardsManagement Props

| Prop | 必填 | Type |
|---|---|---|
| cards | 否 | `ManagedCard[] \| undefined` |
| onAddCard | 否 | `(() => void) \| undefined` |
| onFreezeChange | 否 | `((cardId: string, frozen: boolean) => void) \| undefined` |
| className | 否 | `string \| undefined` |
