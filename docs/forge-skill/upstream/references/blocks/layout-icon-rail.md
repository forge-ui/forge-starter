# 图标栏布局

分类：页面结构。侧栏默认收起为图标条，把宽度留给表格与筛选；顶栏左侧用汉堡按钮展开菜单，头像在右侧。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：AppLayout、Breadcrumbs、Button、DataTable、PageTitleToolbar、PlusIcon、StatusBadge、Toolbar、ToolbarSearchInput、ToolbarSelectDropdown。

## 最小可用示例

```tsx
import { LayoutIconRail } from "@/components/blocks/layout-icon-rail";

export default function Example() {
  return (<LayoutIconRail><p>页面内容</p></LayoutIconRail>);
}
```

## LayoutIconRail Props

| Prop | 必填 | Type |
|---|---|---|
| menuItems | 否 | `AppLayoutMenuItem[] \| undefined` |
| children | 否 | `ReactNode` |
