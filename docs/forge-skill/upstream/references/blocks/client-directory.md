# 客户名录

分类：数据列表。可在表格与卡片视图间切换的客户名录，显示公司、联系方式与合作项目数。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Button、ButtonGroup、CellImageText、CellMuted、CellText、DataTable、IconButton、Panel、PlusIcon、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { ClientDirectory } from "@/components/blocks/client-directory";

export default function Example() {
  return (<ClientDirectory onOpen={client => console.log(client.company)} />);
}
```

## ClientDirectory Props

| Prop | 必填 | Type |
|---|---|---|
| clients | 否 | `ClientRecord[] \| undefined` |
| onAdd | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((client: ClientRecord) => void) \| undefined` |
| className | 否 | `string \| undefined` |
