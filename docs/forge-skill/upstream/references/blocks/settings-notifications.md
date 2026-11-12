# 通知设置

分类：设置。按事件和渠道（站内、邮件、飞书）开关通知，配置邮件摘要与夜间免打扰。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、SelectOption、Toggle、cn。

## 最小可用示例

```tsx
import { SettingsNotifications } from "@/components/blocks/settings-notifications";

export default function Example() {
  return (<SettingsNotifications onSave={(rules, digest) => console.log(rules.length, digest)} />);
}
```

## SettingsNotifications Props

| Prop | 必填 | Type |
|---|---|---|
| rules | 否 | `NotificationRule[] \| undefined` |
| onSave | 否 | `((rules: NotificationRule[], digest: string) => void) \| undefined` |
| className | 否 | `string \| undefined` |
