# 商机列表

分类：数据列表。按回款状态汇总金额，列出商机、客户、付款方式与回款状态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CellImageText、CellText、ConfirmationDialog、DataTable、IconButton、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { DealsTable } from "@/components/blocks/deals-table";

export default function Example() {
  return (<DealsTable onOpen={deal => console.log(deal.title)} />);
}
```

## DealsTable Props

| Prop | 必填 | Type |
|---|---|---|
| deals | 否 | `DealRecord[] \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((deal: DealRecord) => void) \| undefined` |
| onEdit | 否 | `((deal: DealRecord) => void) \| undefined` |
| onExport | 否 | `((deals: DealRecord[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |
