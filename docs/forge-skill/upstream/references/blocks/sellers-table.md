# 商家列表

分类：数据列表。展示店铺评分、营收与待结算金额的入驻商家管理表。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、CellImageText、CellRating、CellText、DataTable、IconButton、Modal、PlusIcon、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { SellersTable } from "@/components/blocks/sellers-table";

export default function Example() {
  return (<SellersTable onMessage={(seller, channel) => console.log(seller.store, channel)} />);
}
```

## SellersTable Props

| Prop | 必填 | Type |
|---|---|---|
| sellers | 否 | `SellerRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onExport | 否 | `((sellers: SellerRecord[]) => void) \| undefined` |
| onMessage | 否 | `((seller: SellerRecord, channel: "email" \| "chat") => void) \| undefined` |
| className | 否 | `string \| undefined` |
