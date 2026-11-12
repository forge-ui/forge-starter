# 顶栏头像布局

分类：页面结构。侧栏展开并按业务分组，搜索在顶栏左侧，头像、通知与消息集中在顶栏右侧，页头带标题、面包屑和主操作。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、Breadcrumbs、Button、DataTable、PageTitleToolbar、StatCard、StatusBadge。

## 最小可用示例

```tsx
import { LayoutTopbarProfile } from "@/components/blocks/layout-topbar-profile";

export default function Example() {
  return (<LayoutTopbarProfile><p>页面内容</p></LayoutTopbarProfile>);
}
```

## LayoutTopbarProfile Props

| Prop | 必填 | Type |
|---|---|---|
| menuSections | 否 | `AppLayoutMenuSection[] \| undefined` |
| children | 否 | `ReactNode` |
