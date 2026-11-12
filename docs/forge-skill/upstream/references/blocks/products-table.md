# 商品列表

分类：数据列表。按状态筛选、搜索、批量勾选与分页的商品管理表，含编辑与删除确认。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CellImageText、CellMuted、CellText、CellTextSubtitle、ConfirmationDialog、DataTable、IconButton、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { ProductsTable } from "@/components/blocks/products-table";

export default function Example() {
  return (<ProductsTable onAdd={() => {}} onEdit={product => console.log(product.id)} />);
}
```

## ProductsTable Props

| Prop | 必填 | Type |
|---|---|---|
| products | 否 | `ProductRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onEdit | 否 | `((product: ProductRecord) => void) \| undefined` |
| onDelete | 否 | `((product: ProductRecord) => void) \| undefined` |
| onExport | 否 | `((products: ProductRecord[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |
