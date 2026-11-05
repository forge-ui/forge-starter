# highlight-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/highlight-card.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## HighlightCard (value)

```ts
({ title, theme, image, annotations, products, density, width, className, }: { title: string; theme?: HighlightCardTheme; image: string; annotations?: Annotation[]; products?: Product[]; density?: "default" | "compact"; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `theme` | 否 | `HighlightCardTheme \| undefined` |  |
| `image` | 是 | `string` |  |
| `annotations` | 否 | `Annotation[] \| undefined` |  |
| `products` | 否 | `Product[] \| undefined` |  |
| `density` | 否 | `"default" \| "compact" \| undefined` | Use compact inside dense dashboards while preserving the default showcase scale. |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 运营 / 营销展示 → `HighlightCard`（非数据型）
- 单纯指标 → 用 `StatCard` 家族
- 产品卡列表 → 用 `ProductRow`
