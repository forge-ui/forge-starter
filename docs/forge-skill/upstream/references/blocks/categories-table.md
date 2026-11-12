# 商品分类

分类：数据列表。维护商品分类的名称、说明、销量与库存，支持新增、编辑与删除。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CellImageText、CellMuted、CellText、ConfirmationDialog、DataTable、IconButton、Modal、PlusIcon、TextArea、TextField、cn。

## 最小可用示例

```tsx
import { CategoriesTable } from "@/components/blocks/categories-table";

export default function Example() {
  return (<CategoriesTable onSave={(category, id) => console.log(id ?? "new", category.name)} />);
}
```

## CategoriesTable Props

| Prop | 必填 | Type |
|---|---|---|
| categories | 否 | `CategoryRecord[] \| undefined` |
| onSave | 否 | `((category: CategoryDraft, id?: string) => void) \| undefined` |
| onDelete | 否 | `((category: CategoryRecord) => void) \| undefined` |
| className | 否 | `string \| undefined` |
