# 侧栏头像布局

分类：页面结构。头像、通知与语言收进侧栏底部，菜单按工作区、智能体、平台分组；顶部只保留页头的标题、面包屑与操作。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、ProgressBar、StatusBadge、SurfaceCard。

## 最小可用示例

```tsx
import { LayoutSidebarProfile } from "@/components/blocks/layout-sidebar-profile";

export default function Example() {
  return (<LayoutSidebarProfile><p>页面内容</p></LayoutSidebarProfile>);
}
```

## LayoutSidebarProfile Props

| Prop | 必填 | Type |
|---|---|---|
| menuSections | 否 | `AppLayoutMenuSection[] \| undefined` |
| children | 否 | `ReactNode` |
