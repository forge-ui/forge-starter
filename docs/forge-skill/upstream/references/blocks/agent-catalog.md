# 应用智能体目录

分类：AI 与智能体。左侧目录树，按发布状态与类型筛选、排序和搜索的应用智能体卡片，分页浏览，并可从模板库一键创建高级工作流智能体。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ButtonGroup、ConfirmationDialog、IconButton、Modal、PageTitleToolbar、PlusIcon、SelectOption、StatusBadge、TextField。

## 最小可用示例

```tsx
import { AgentCatalog } from "@/components/blocks/agent-catalog";

export default function Example() {
  return (<AgentCatalog folders={[{ id: "default", name: "根目录" }, { id: "service", name: "客服中心" }]} />);
}
```

## AgentCatalog Props

| Prop | 必填 | Type |
|---|---|---|
| agents | 否 | `AppAgent[] \| undefined` |
| folders | 否 | `AgentFolder[] \| undefined` |
| templates | 否 | `AgentTemplate[] \| undefined` |
| className | 否 | `string \| undefined` |
