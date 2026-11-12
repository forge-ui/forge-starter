# 工作流编辑器

分类：AI 与智能体。高级工作流智能体的编排页：点阵画布上可拖动、展开收起、直接编辑表单的节点与分支连线，带撤销重做、添加组件、一键美化、问题检查、调试运行与发布。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、CellText、StatusBadge、TabBar。

## 最小可用示例

```tsx
import { WorkflowBuilder } from "@/components/blocks/workflow-builder";

export default function Example() {
  return (<WorkflowBuilder />);
}
```

## WorkflowBuilder Props

| Prop | 必填 | Type |
|---|---|---|
| nodes | 否 | `WorkflowNode[] \| undefined` |
| edges | 否 | `WorkflowEdge[] \| undefined` |
| className | 否 | `string \| undefined` |
