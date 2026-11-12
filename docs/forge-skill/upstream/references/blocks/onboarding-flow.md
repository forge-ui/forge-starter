# 引导流程

分类：认证。首次使用的四步引导：创建工作区、连接工具、邀请成员、从模板创建第一个智能体。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Checkbox、ProgressBar、SelectOption、TextField、Toggle、cn。

## 最小可用示例

```tsx
import { OnboardingFlow } from "@/components/blocks/onboarding-flow";

export default function Example() {
  return (<OnboardingFlow onFinish={value => console.log(value.workspace)} />);
}
```

## OnboardingFlow Props

| Prop | 必填 | Type |
|---|---|---|
| initialValue | 否 | `Partial<OnboardingValue> \| undefined` |
| onFinish | 否 | `((value: OnboardingValue) => void) \| undefined` |
| className | 否 | `string \| undefined` |
