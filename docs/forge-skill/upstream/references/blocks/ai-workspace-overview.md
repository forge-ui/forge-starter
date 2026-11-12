# 智能体工作台

分类：AI 与智能体。工作台首页：应用智能体、知识库、工具与模型的资源汇总，按时间范围与智能体筛选的监控统计、趋势图和 TOP5 排行榜。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ButtonGroup、KebabMenu、LineChartStatCard、ListGroup、PageTitleToolbar、PlusIcon、ProgressStatCard、SelectOption、SmoothLineChart。

## 最小可用示例

```tsx
import { AiWorkspaceOverview } from "@/components/blocks/ai-workspace-overview";

export default function Example() {
  return (<AiWorkspaceOverview />);
}
```

## AiWorkspaceOverview Props

| Prop | 必填 | Type |
|---|---|---|
| aggregation | 否 | `WorkspaceAggregation \| undefined` |
| agents | 否 | `WorkspaceAgentOption[] \| undefined` |
| tokenRank | 否 | `RankItem[] \| undefined` |
| chatRank | 否 | `RankItem[] \| undefined` |
| userRank | 否 | `RankItem[] \| undefined` |
| className | 否 | `string \| undefined` |
