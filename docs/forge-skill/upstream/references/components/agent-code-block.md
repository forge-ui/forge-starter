# agent-code-block

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-code-block.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentCodeBlock (value)

```ts
({ filename, lines, diff, view: controlledView, onViewChange, locale, codeLabel, diffLabel, copyLabel, copiedLabel, foldRanges, collapsedRangeIds, defaultCollapsedRangeIds, onCollapsedRangeIdsChange, className, }: { filename: string; lines?: string[]; diff?: AgentCodeDiffRow[]; view?: "code" | "diff"; onViewChange?: (view: "code" | "diff") => void; locale?: "zh" | "en"; codeLabel?: string; diffLabel?: string; copyLabel?: string; copiedLabel?: string; foldRanges?: AgentCodeFoldRange[]; collapsedRangeIds?: string[]; defaultCollapsedRangeIds?: string[]; onCollapsedRangeIdsChange?: (ids: string[]) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `filename` | 是 | `string` |  |
| `lines` | 否 | `string[] \| undefined` |  |
| `diff` | 否 | `AgentCodeDiffRow[] \| undefined` |  |
| `view` | 否 | `"code" \| "diff" \| undefined` |  |
| `onViewChange` | 否 | `((view: "code" \| "diff") => void) \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `codeLabel` | 否 | `string \| undefined` |  |
| `diffLabel` | 否 | `string \| undefined` |  |
| `copyLabel` | 否 | `string \| undefined` |  |
| `copiedLabel` | 否 | `string \| undefined` |  |
| `foldRanges` | 否 | `AgentCodeFoldRange[] \| undefined` |  |
| `collapsedRangeIds` | 否 | `string[] \| undefined` |  |
| `defaultCollapsedRangeIds` | 否 | `string[] \| undefined` |  |
| `onCollapsedRangeIdsChange` | 否 | `((ids: string[]) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentCodeDiffRow (type)

```ts
export type AgentCodeDiffRow = {
  old: number | null;
  cur: number | null;
  type: AgentCodeDiffType;
  pieces: AgentCodePiece[];
};
```

## AgentCodeDiffType (type)

```ts
export type AgentCodeDiffType = "ctx" | "add" | "del";
```

## AgentCodeFoldRange (type)

```ts
export type AgentCodeFoldRange = {
  id: string;
  /** One-based header line; it stays visible while folded. */
  startLine: number;
  /** Last hidden line, inclusive. Ranges may nest but must not cross. */
  endLine: number;
  label?: string;
};
```

## AgentCodePiece (type)

```ts
export type AgentCodePiece = {
  text: string;
  change?: "add" | "del";
};
```
