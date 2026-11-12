# 地区分布卡

分类：图表与指标。结合地图与地区明细，查看客户或收入的地域分布。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：MapCard。

## 最小可用示例

```tsx
import { RegionDistribution } from "@/components/blocks/region-distribution";

export default function Example() {
  return (<RegionDistribution title="地区分布" highlights={["asia", "europe"]} regions={[{ name: "中国", countryCode: "CN", salesLabel: "340 笔", value: "¥17,678" }, { name: "英国", countryCode: "GB", salesLabel: "100 笔", value: "¥5,500" }]} />);
}
```

## RegionDistribution Props

| Prop | 必填 | Type |
|---|---|---|
| title | 否 | `string \| undefined` |
| className | 否 | `string \| undefined` |
| color | 否 | `import("@forge-ui-official/core").AccentColor \| undefined` |
| subtitle | 否 | `string \| undefined` |
| variant | 否 | `import("@forge-ui-official/core").MapVariant \| undefined` |
| highlights | 否 | `import("@forge-ui-official/core").MapContinent[] \| undefined` |
| onMenuClick | 否 | `(() => void) \| undefined` |
| width | 否 | `import("@forge-ui-official/core").CardWidth \| undefined` |
| regions | 否 | `(Omit<import("@forge-ui-official/core").MapRegion, "flag"> & { flag?: string; countryCode?: string; })[] \| undefined` |
