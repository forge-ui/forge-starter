# 项目详情分区

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Panel。

## 最小可用示例

```tsx
import { ProjectSection } from "@/components/blocks/project-section";

export default function Example() {
  return (<ProjectSection title="项目进度">已完成 6 / 10 项</ProjectSection>);
}
```

## ProjectSection Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| action | 否 | `ReactNode` |
| children | 是 | `ReactNode` |
| className | 否 | `string \| undefined` |
