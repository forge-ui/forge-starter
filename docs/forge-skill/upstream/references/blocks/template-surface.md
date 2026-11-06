# 模板内容分区

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：SurfaceCard。

## 最小可用示例

```tsx
import { TemplateSurface } from "@/components/blocks/template-surface";

export default function Example() {
  return (<TemplateSurface title="经营摘要">本月经营数据</TemplateSurface>);
}
```

## TemplateSurface Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| subtitle | 否 | `string \| undefined` |
| action | 否 | `ReactNode` |
| children | 是 | `ReactNode` |
| className | 否 | `string \| undefined` |
