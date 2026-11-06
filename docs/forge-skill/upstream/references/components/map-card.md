# map-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/map-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MapCard (value)

```ts
({ title, subtitle, color, variant, regions, highlights, onMenuClick, width, className, }: { title?: string; subtitle?: string; color?: AccentColor; variant?: MapVariant; regions?: MapRegion[]; highlights?: MapContinent[]; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `variant` | 否 | `MapVariant \| undefined` |  |
| `regions` | 否 | `MapRegion[] \| undefined` |  |
| `highlights` | 否 | `MapContinent[] \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## MapContinent (type)

```ts
export type MapContinent =
  | "north-america"
  | "south-america"
  | "europe"
  | "africa"
  | "asia"
  | "oceania";
```

## MapRegion (type)

```ts
export interface MapRegion {
  name: string;
  /** Square flag image URL (44×44) */
  flag: string;
  /** e.g. "340 Sales" */
  salesLabel: string;
  /** e.g. "$17,678" */
  value: string;
}
```

## MapVariant (type)

```ts
export type MapVariant = "sm" | "md" | "lg";
```

## 选型

- 全球业务 dashboard → `MapCard variant="md"` + 区域 top 5
- 全屏地图背景 → `variant="lg"`
- 只看主要数据不要地图 → 直接用 `DataTable` + 国旗列
