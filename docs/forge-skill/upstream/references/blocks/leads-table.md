# 销售线索

分类：数据列表。线索总数、成交与流失指标卡，配合状态筛选、搜索与线索表格。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、AvatarGroup、Button、ButtonGroup、CellImageText、CellMuted、CellText、DataTable、IconButton、Panel、PlusIcon、SmoothLineChart、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { LeadsTable } from "@/components/blocks/leads-table";

export default function Example() {
  return (<LeadsTable onOpen={lead => console.log(lead.id)} />);
}
```

## LeadsTable Props

| Prop | 必填 | Type |
|---|---|---|
| leads | 否 | `LeadRecord[] \| undefined` |
| pageSize | 否 | `number \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onExport | 否 | `((leads: LeadRecord[]) => void) \| undefined` |
| onOpen | 否 | `((lead: LeadRecord) => void) \| undefined` |
| className | 否 | `string \| undefined` |
