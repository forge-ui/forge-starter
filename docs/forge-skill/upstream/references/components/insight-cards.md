# insight-cards

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/insight-cards.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## InsightCard (type)

```ts
export type InsightCard = {
  id: string;
  title: string;
  body: string;
  prompt?: string;
  chart?: InsightChart;
};
```

## InsightCards (value)

```ts
({ cards, locale, index: controlledIndex, onIndexChange, onAsk, previousInsightLabel, nextInsightLabel, className, }: { cards: InsightCard[]; locale?: "zh" | "en"; index?: number; onIndexChange?: (index: number) => void; onAsk?: (prompt: string, card: InsightCard) => void; previousInsightLabel?: string; nextInsightLabel?: string; className?: string; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `cards` | 是 | `InsightCard[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `index` | 否 | `number \| undefined` |  |
| `onIndexChange` | 否 | `((index: number) => void) \| undefined` |  |
| `onAsk` | 否 | `((prompt: string, card: InsightCard) => void) \| undefined` |  |
| `previousInsightLabel` | 否 | `string \| undefined` |  |
| `nextInsightLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## InsightChart (type)

```ts
export type InsightChart =
  | { kind: "spark"; series: InsightSeries[] }
  | { kind: "bars"; values: number[] }
  | { kind: "segments"; items: { label: string; pct: number; tone?: InsightTone }[] };
```

## InsightSeries (type)

```ts
export type InsightSeries = {
  name: string;
  values: number[];
  tone?: InsightTone;
};
```

## InsightTone (type)

```ts
export type InsightTone = "violet" | "green" | "yellow" | "blue";
```
