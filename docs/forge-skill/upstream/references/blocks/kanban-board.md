# 项目看板

分类：协作与项目。项目详情页：按状态分栏的任务看板，可拖拽、勾选完成、展开子任务和快速添加；右侧项目属性、描述与资源，点任务卡片打开带动态、评论和属性的任务详情。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Breadcrumbs、Button、IconButton、KebabMenu、PageTitleToolbar、PlusIcon、ProgressBar、TextField。

## 最小可用示例

```tsx
import { KanbanBoard } from "@/components/blocks/kanban-board";

export default function Example() {
  return (<KanbanBoard />);
}
```

## KanbanBoard Props

| Prop | 必填 | Type |
|---|---|---|
| project | 否 | `BoardProject \| undefined` |
| lanes | 否 | `BoardLane[] \| undefined` |
| items | 否 | `WorkItem[] \| undefined` |
| className | 否 | `string \| undefined` |
