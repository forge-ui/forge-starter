# 设置页布局

分类：页面结构。设置类页面：左侧二级导航切换分类，右侧按主题分卡，说明在上、字段居中、每张卡底部单独保存。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、Avatar、Breadcrumbs、Button、PageTitleToolbar、SelectOption、TextArea、TextField、Toggle。

## 最小可用示例

```tsx
import { LayoutSettings } from "@/components/blocks/layout-settings";

export default function Example() {
  return (<LayoutSettings><p>页面内容</p></LayoutSettings>);
}
```

## LayoutSettings Props

| Prop | 必填 | Type |
|---|---|---|
| menuItems | 否 | `AppLayoutMenuItem[] \| undefined` |
| children | 否 | `ReactNode` |
