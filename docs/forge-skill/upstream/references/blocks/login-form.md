# 登录

分类：认证。邮箱密码与手机验证码两种登录方式，带记住登录、错误提示与企业单点登录入口。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、Checkbox、OtpInput、TextField、cn。

## 最小可用示例

```tsx
import { LoginForm } from "@/components/blocks/login-form";

export default function Example() {
  return (<LoginForm onLogin={payload => console.log(payload.account)} />);
}
```

## LoginForm Props

| Prop | 必填 | Type |
|---|---|---|
| productName | 否 | `string \| undefined` |
| image | 否 | `string \| undefined` |
| onLogin | 否 | `((payload: { method: "password" \| "code"; account: string; secret: string; remember: boolean; }) => Promise<void> \| void) \| undefined` |
| onSso | 否 | `((provider: string) => void) \| undefined` |
| onForgot | 否 | `(() => void) \| undefined` |
| onRegister | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
