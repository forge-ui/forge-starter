# 服务配置表单

分类：表单。设置类表单：顶部按登录、支付、邮件、存储分标签，每个服务一张卡片，开关启用后展开字段与回调地址，卡片底部单独测试连接与保存。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、PageTitleToolbar、StatusBadge、TabBar、TextField、Toggle。

## 最小可用示例

```tsx
import { ProviderSettingsForm } from "@/components/blocks/provider-settings-form";

export default function Example() {
  return (<ProviderSettingsForm />);
}
```

## ProviderSettingsForm Props

| Prop | 必填 | Type |
|---|---|---|
| groups | 否 | `ProviderGroup[] \| undefined` |
| className | 否 | `string \| undefined` |
