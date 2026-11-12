# 自主智能体

分类：AI 与智能体。系统预置与我的自主智能体卡片，标明运行时、确认策略与知识库要求；发起任务弹窗可选知识库、执行模式与人工确认，最近任务跟踪状态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、Checkbox、ConfirmationDialog、Grid、Modal、PageTitleToolbar、PlusIcon、RadioWithLabel、SelectOption、StatusBadge、SurfaceCard、TextArea、TextField。

## 最小可用示例

```tsx
import { AutonomousAgents } from "@/components/blocks/autonomous-agents";

export default function Example() {
  return (<AutonomousAgents knowledge={[{ id: "kb-after-sales", name: "售后服务手册", documents: 48 }]} />);
}
```

## AutonomousAgents Props

| Prop | 必填 | Type |
|---|---|---|
| agents | 否 | `AutonomousAgent[] \| undefined` |
| tasks | 否 | `AutonomousTask[] \| undefined` |
| knowledge | 否 | `KnowledgeBase[] \| undefined` |
| className | 否 | `string \| undefined` |
