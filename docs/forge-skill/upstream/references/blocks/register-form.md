# 注册

分类：认证。左图右表单的注册页，含第三方注册、邮箱与密码校验、协议勾选和成功反馈。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Checkbox、TextField、cn。

## 最小可用示例

```tsx
import { RegisterForm } from "@/components/blocks/register-form";

export default function Example() {
  return (<RegisterForm onSubmit={value => console.log(value.email)} onLogin={() => {}} />);
}
```

## RegisterForm Props

| Prop | 必填 | Type |
|---|---|---|
| productName | 否 | `string \| undefined` |
| image | 否 | `string \| undefined` |
| providers | 否 | `{ id: string; label: string; icon: string; }[] \| undefined` |
| onSubmit | 否 | `((value: RegisterValue) => void) \| undefined` |
| onProvider | 否 | `((providerId: string) => void) \| undefined` |
| onLogin | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
