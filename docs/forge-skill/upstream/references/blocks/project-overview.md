# 项目概览

分类：看板首屏。汇总项目进度、团队成员、里程碑与近期活动，掌握交付全貌。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、AvatarGroup、Panel、ProgressBar、StatusBadge、cn。

## 最小可用示例

```tsx
import { ProjectOverview } from "@/components/blocks/project-overview";

export default function Example() {
  return (<ProjectOverview title="客户工作台升级" progress={75} progressLabel="已完成 18 / 24 项任务" />);
}
```

## ProjectOverview Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| description | 否 | `string \| undefined` |
| progress | 否 | `number \| undefined` |
| progressLabel | 否 | `string \| undefined` |
| deadline | 否 | `string \| undefined` |
| members | 否 | `ProjectMember[] \| undefined` |
| milestones | 否 | `ProjectMilestone[] \| undefined` |
| activities | 否 | `ProjectActivity[] \| undefined` |
| className | 否 | `string \| undefined` |
