# 客户经营摘要

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：Panel、DescriptionItem、LineChartStatCard、SurfaceCard。

## 最小可用示例

```tsx
import { CrmMetricCard } from "@/components/blocks/crm-summary";

export default function Example() {
  return (<CrmMetricCard title="客户数" date="本月" value="120" trend="10%" note="较上月" footer="已更新" />);
}
```

## CrmSurface Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| subtitle | 否 | `string \| undefined` |
| action | 否 | `ReactNode` |
| children | 是 | `ReactNode` |
| className | 否 | `string \| undefined` |

## CrmStat Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| value | 是 | `string` |
| tone | 否 | `"purple" \| "blue" \| "green" \| undefined` |
| bars | 是 | `number[]` |

## DetailLine Props

| Prop | 必填 | Type |
|---|---|---|
| label | 是 | `string` |
| value | 是 | `string` |

## CrmMetricCard Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| date | 是 | `string` |
| value | 是 | `string` |
| trend | 是 | `string` |
| trendDirection | 否 | `"up" \| "down" \| undefined` |
| note | 是 | `string` |
| icon | 否 | `ReactNode` |
| iconClassName | 否 | `string \| undefined` |
| footer | 是 | `ReactNode` |
