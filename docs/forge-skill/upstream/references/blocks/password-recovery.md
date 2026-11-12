# 找回密码

分类：认证。邮箱验证、验证码与新密码三步找回流程，带进度提示与校验。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、OtpInput、TextField、cn。

## 最小可用示例

```tsx
import { PasswordRecovery } from "@/components/blocks/password-recovery";

export default function Example() {
  return (<PasswordRecovery onReset={payload => console.log(payload.email)} onBack={() => {}} />);
}
```

## PasswordRecovery Props

| Prop | 必填 | Type |
|---|---|---|
| image | 否 | `string \| undefined` |
| defaultEmail | 否 | `string \| undefined` |
| onSendCode | 否 | `((email: string) => void) \| undefined` |
| onReset | 否 | `((payload: { email: string; code: string; password: string; }) => void) \| undefined` |
| onBack | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
