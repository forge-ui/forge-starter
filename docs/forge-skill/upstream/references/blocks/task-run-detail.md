# 任务执行详情

分类：AI 与智能体。自主智能体任务详情：状态与来源、概要和知识库授权、带时间的执行过程，以及按类型分组、可预览下载复制的结果产物。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、ConfirmationDialog、Modal、PageTitleToolbar、StatusBadge。

## 最小可用示例

```tsx
import { TaskRunDetail } from "@/components/blocks/task-run-detail";

export default function Example() {
  return (<TaskRunDetail />);
}
```

## TaskRunDetail Props

| Prop | 必填 | Type |
|---|---|---|
| task | 否 | `TaskRunDetailData \| undefined` |
| className | 否 | `string \| undefined` |
