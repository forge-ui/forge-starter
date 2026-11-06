# context-cards

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/context-cards.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ContextCards (value)

```ts
({ chunks, locale, total, allChunksLabel, charactersLabel, className, }: { chunks: ContextChunk[]; locale?: "zh" | "en"; total?: number; allChunksLabel?: string; charactersLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `chunks` | 是 | `ContextChunk[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `total` | 否 | `number \| undefined` |  |
| `allChunksLabel` | 否 | `string \| undefined` |  |
| `charactersLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ContextChunk (type)

```ts
export type ContextChunk = {
  id: string;
  title: string;
  body: string;
  sourceLabel?: string;
  sourceKind?: string;
  charCount?: number;
};
```
