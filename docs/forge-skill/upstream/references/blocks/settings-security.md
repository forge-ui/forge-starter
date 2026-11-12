# 安全设置

分类：设置。密码与强度提示、两步验证、单点登录、登录设备管理与 API 密钥。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Modal、StatusBadge、TextField、Toggle、cn。

## 最小可用示例

```tsx
import { SettingsSecurity } from "@/components/blocks/settings-security";

export default function Example() {
  return (<SettingsSecurity />);
}
```

## SettingsSecurity Props

| Prop | 必填 | Type |
|---|---|---|
| sessions | 否 | `LoginSession[] \| undefined` |
| apiKeys | 否 | `ApiKey[] \| undefined` |
| className | 否 | `string \| undefined` |
