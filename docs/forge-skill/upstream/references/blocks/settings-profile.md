# 个人资料设置

分类：设置。头像上传、基本信息与地区语言，带校验和底部常驻的保存与撤销条。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、SelectOption、TextArea、TextField、cn。

## 最小可用示例

```tsx
import { SettingsProfile } from "@/components/blocks/settings-profile";

export default function Example() {
  return (<SettingsProfile onSave={value => console.log(value.name)} />);
}
```

## SettingsProfile Props

| Prop | 必填 | Type |
|---|---|---|
| value | 否 | `ProfileValue \| undefined` |
| avatar | 否 | `string \| undefined` |
| onSave | 否 | `((value: ProfileValue) => void) \| undefined` |
| className | 否 | `string \| undefined` |
