# 任务详情

分类：详情页。任务基本信息、成员与附件，配合进度、描述、可勾选的检查清单和最近动态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、AvatarGroup、Button、Checkbox、IconButton、Panel、PlusIcon、ProgressBar、StatusBadge、TextField、cn。

## 最小可用示例

```tsx
import { TaskDetail } from "@/components/blocks/task-detail";

export default function Example() {
  return (<TaskDetail onChecklistChange={items => console.log(items.length)} />);
}
```

## TaskDetail Props

| Prop | 必填 | Type |
|---|---|---|
| task | 否 | `TaskDetailData \| undefined` |
| onChecklistChange | 否 | `((items: TaskChecklistItem[]) => void) \| undefined` |
| className | 否 | `string \| undefined` |
