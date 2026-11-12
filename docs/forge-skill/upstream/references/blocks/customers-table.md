# 客户列表

分类：数据列表。带搜索、在线状态、联系方式与新增客户弹窗的客户管理表。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Button、CellImageText、CellMuted、CellText、DataTable、IconButton、Modal、PlusIcon、StatusBadge、TextField、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { CustomersTable } from "@/components/blocks/customers-table";

export default function Example() {
  return (<CustomersTable onCreate={customer => console.log(customer.name)} />);
}
```

## CustomersTable Props

| Prop | 必填 | Type |
|---|---|---|
| customers | 否 | `CustomerRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onCreate | 否 | `((customer: NewCustomer) => void) \| undefined` |
| onExport | 否 | `((customers: CustomerRecord[]) => void) \| undefined` |
| onContact | 否 | `((customer: CustomerRecord, channel: "email" \| "phone") => void) \| undefined` |
| className | 否 | `string \| undefined` |
