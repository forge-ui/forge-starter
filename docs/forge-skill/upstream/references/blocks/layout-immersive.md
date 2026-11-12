# 沉浸式布局

分类：页面结构。去掉页头，侧栏收成图标条，内容区整块留给对话、画布或编辑器这类需要满屏的工作区。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、ChatBubble、ChatInputBar。

## 最小可用示例

```tsx
import { LayoutImmersive } from "@/components/blocks/layout-immersive";

export default function Example() {
  return (<LayoutImmersive><p>页面内容</p></LayoutImmersive>);
}
```

## LayoutImmersive Props

| Prop | 必填 | Type |
|---|---|---|
| menuItems | 否 | `AppLayoutMenuItem[] \| undefined` |
| children | 否 | `ReactNode` |
