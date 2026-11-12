# 成员详情

分类：详情页。成员档案卡、任务统计，以及参与项目、手头任务与动态分页签。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：DataTable、Panel、SmoothLineChart、StatusBadge、TabBar、cn。

## 最小可用示例

```tsx
import { MemberProfile } from "@/components/blocks/member-profile";

export default function Example() {
  return (<MemberProfile />);
}
```

## MemberProfile Props

| Prop | 必填 | Type |
|---|---|---|
| member | 否 | `MemberProfileData \| undefined` |
| className | 否 | `string \| undefined` |
