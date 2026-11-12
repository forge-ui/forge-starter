# 订单列表

分类：数据列表。包含搜索、状态筛选、导出与分页的订单列表，适用于交易管理页面。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Button、DataTable、IconButton、Modal、Pagination、Panel、StatusBadge、Toolbar、ToolbarSearchInput、ToolbarSelectDropdown、cn。

## 最小可用示例

```tsx
import { OrdersTableSection } from "@/components/blocks/orders-table-section";

export default function Example() {
  return (<OrdersTableSection title="订单列表" pageSize={6} />);
}
```

## OrdersTableSection Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| description | 否 | `string \| undefined` |
| orders | 否 | `OrderRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onViewOrder | 否 | `((order: OrderRecord) => void) \| undefined` |
| onExport | 否 | `((orders: OrderRecord[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |
