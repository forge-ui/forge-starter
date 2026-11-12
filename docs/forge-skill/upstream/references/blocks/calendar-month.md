# 月历日程

分类：协作与项目。月视图日历标注团队日程，侧栏列出近期安排，点击查看时间、地点与参会人。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Button、FullCalendar、Modal、SurfaceCard、cn。

## 最小可用示例

```tsx
import { CalendarMonth } from "@/components/blocks/calendar-month";

export default function Example() {
  return (<CalendarMonth onCreate={() => {}} />);
}
```

## CalendarMonth Props

| Prop | 必填 | Type |
|---|---|---|
| events | 否 | `ScheduleEvent[] \| undefined` |
| year | 否 | `number \| undefined` |
| month | 否 | `number \| undefined` |
| day | 否 | `number \| undefined` |
| onCreate | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
