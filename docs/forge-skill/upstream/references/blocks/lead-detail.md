# 线索详情

分类：详情页。线索名片与基础信息，按类型筛选的跟进动态，以及添加跟进记录弹窗。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Modal、Panel、PlusIcon、SelectOption、StatusBadge、TabBar、TextArea、cn。

## 最小可用示例

```tsx
import { LeadDetail } from "@/components/blocks/lead-detail";

export default function Example() {
  return (<LeadDetail onAddActivity={activity => console.log(activity.kind)} />);
}
```

## LeadDetail Props

| Prop | 必填 | Type |
|---|---|---|
| lead | 否 | `LeadDetailData \| undefined` |
| onAddActivity | 否 | `((activity: LeadActivity) => void) \| undefined` |
| className | 否 | `string \| undefined` |
