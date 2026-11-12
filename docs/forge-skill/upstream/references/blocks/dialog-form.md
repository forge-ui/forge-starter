# 弹窗表单

分类：表单。列表页里的新建与编辑：树形部门列表，点新增、修改或新增下级弹出两列表单，带必填校验，确定后回写列表。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ConfirmationDialog、DataTable、Modal、PageTitleToolbar、PlusIcon、RadioWithLabel、SelectOption、StatusBadge、TextField、Toolbar、ToolbarSearchInput。

## 最小可用示例

```tsx
import { DialogForm } from "@/components/blocks/dialog-form";

export default function Example() {
  return (<DialogForm />);
}
```

## DialogForm Props

| Prop | 必填 | Type |
|---|---|---|
| departments | 否 | `Department[] \| undefined` |
| className | 否 | `string \| undefined` |
