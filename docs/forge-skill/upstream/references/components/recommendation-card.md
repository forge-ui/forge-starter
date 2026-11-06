# recommendation-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/recommendation-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## RecommendationCard (value)

```ts
({ title, locale, body, confidence, confidenceLabel, alternatives, acceptLabel, onAccept, onSelectAlternative, confidenceLabels, alternativesLabel, className, }: { title: string; locale?: "zh" | "en"; body: string; confidence?: RecommendationConfidence; confidenceLabel?: string; alternatives?: RecommendationOption[]; acceptLabel?: string; onAccept?: () => void; onSelectAlternative?: (id: string) => void; confidenceLabels?: Partial<Record<RecommendationConfidence, string>>; alternativesLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `body` | 是 | `string` |  |
| `confidence` | 否 | `RecommendationConfidence \| undefined` |  |
| `confidenceLabel` | 否 | `string \| undefined` |  |
| `alternatives` | 否 | `RecommendationOption[] \| undefined` |  |
| `acceptLabel` | 否 | `string \| undefined` |  |
| `onAccept` | 否 | `(() => void) \| undefined` |  |
| `onSelectAlternative` | 否 | `((id: string) => void) \| undefined` |  |
| `confidenceLabels` | 否 | `Partial<Record<RecommendationConfidence, string>> \| undefined` |  |
| `alternativesLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## RecommendationConfidence (type)

```ts
export type RecommendationConfidence = "high" | "review" | "none";
```

## RecommendationOption (type)

```ts
export type RecommendationOption = {
  id: string;
  label: string;
  hint?: string;
  confidence?: RecommendationConfidence;
};
```
