# dashboard-charts

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/charts/dashboard-charts.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChartHeader (value)

```ts
({ title, subtitle, tabs, activeTab, defaultTab, onTabChange, action, }: { title: string; subtitle?: string; tabs?: string[]; activeTab?: string; defaultTab?: string; onTabChange?: (tab: string) => void; action?: ReactNode; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `tabs` | 否 | `string[] \| undefined` |  |
| `activeTab` | 否 | `string \| undefined` |  |
| `defaultTab` | 否 | `string \| undefined` |  |
| `onTabChange` | 否 | `((tab: string) => void) \| undefined` |  |
| `action` | 否 | `ReactNode` |  |

## ChartHeaderProps (type)

```ts
export type ChartHeaderProps = Parameters<typeof ChartHeader>[0];
```

## ChartMetricRow (value)

```ts
({ series }: { series: ChartMetricSeries[]; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `series` | 是 | `ChartMetricSeries[]` |  |

## ChartMetricRowProps (type)

```ts
export type ChartMetricRowProps = Parameters<typeof ChartMetricRow>[0];
```

## ChartMetricSeries (type)

```ts
export type ChartMetricSeries = {
  label: string;
  colorClass: string;
  value?: string;
  trend?: ChartTrend;
  trendValue?: string;
};
```

## ChartTrend (type)

```ts
export type ChartTrend = "up" | "down";
```

## DivergingBarChart (value)

```ts
({ data, upperColor, lowerColor, activeIndex, tooltipUpperValue, tooltipLowerValue, heightClass, upperLabel, lowerLabel, }: { upperLabel?: string; lowerLabel?: string; data: { label: string; upperValue: number; lowerValue: number; }[]; upperColor?: string; lowerColor?: string; activeIndex?: number; tooltipUpperValue?: string; tooltipLowerValue?: string; heightClass?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `upperLabel` | 否 | `string \| undefined` |  |
| `lowerLabel` | 否 | `string \| undefined` |  |
| `data` | 是 | `{ label: string; upperValue: number; lowerValue: number; }[]` |  |
| `upperColor` | 否 | `string \| undefined` |  |
| `lowerColor` | 否 | `string \| undefined` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `tooltipUpperValue` | 否 | `string \| undefined` |  |
| `tooltipLowerValue` | 否 | `string \| undefined` |  |
| `heightClass` | 否 | `string \| undefined` |  |

## DivergingBarChartProps (type)

```ts
export type DivergingBarChartProps = Parameters<typeof DivergingBarChart>[0];
```

## GroupedBarChart (value)

```ts
({ data, series, activeIndex, tooltipItems, yAxisLabels, heightClass, }: { data: GroupedBarPoint[]; series: ChartMetricSeries[]; activeIndex?: number; tooltipItems?: GroupedBarTooltipItem[]; yAxisLabels?: string[]; heightClass?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `data` | 是 | `GroupedBarPoint[]` |  |
| `series` | 是 | `ChartMetricSeries[]` |  |
| `activeIndex` | 否 | `number \| undefined` |  |
| `tooltipItems` | 否 | `GroupedBarTooltipItem[] \| undefined` |  |
| `yAxisLabels` | 否 | `string[] \| undefined` |  |
| `heightClass` | 否 | `string \| undefined` |  |

## GroupedBarChartProps (type)

```ts
export type GroupedBarChartProps = Parameters<typeof GroupedBarChart>[0];
```

## GroupedBarPoint (type)

```ts
export type GroupedBarPoint = {
  label: string;
  values: number[];
};
```

## GroupedBarTooltipItem (type)

```ts
export type GroupedBarTooltipItem = {
  label: string;
  value: string;
  colorClass: string;
  trend?: ChartTrend;
};
```

## 选型建议

ChartHeader 为可控/非可控页签标题；ChartMetricRow 为指标与趋势；GroupedBarChart 为多系列分组柱；DivergingBarChart 为上下柱。均保留模板样式，非交互图形编辑器。数据、颜色、轴与趋势文案由调用方提供；示例见 /cases/dashboard-kit。

导入自 `@forge-ui-official/core`；交互示例 `/cases/dashboard-kit`，Blocks 画廊 `/blocks`。源码实现不等于截图验收或 npm 已发布。
