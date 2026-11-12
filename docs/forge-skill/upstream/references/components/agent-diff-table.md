# agent-diff-table

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-diff-table.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentDiffChange (type)

```ts
export type AgentDiffChange = "keep" | "remove" | "add";
```

## AgentDiffColumn (type)

```ts
export type AgentDiffColumn = {
  key: string;
  label: string;
};
```

## AgentDiffRow (type)

```ts
export type AgentDiffRow = {
  id: string;
  cells: Record<string, string>;
  change: AgentDiffChange;
};
```

## AgentDiffTable (value)

```ts
({ title, locale, columns, rows, applyLabel, appliedLabel, onApply, toggleHint, formatApplyLabel, formatAppliedLabel, className, }: { title: string; locale?: "zh" | "en"; columns: AgentDiffColumn[]; rows: AgentDiffRow[]; applyLabel?: string; appliedLabel?: string; onApply?: (includedIds: string[]) => void; toggleHint?: string; formatApplyLabel?: (count: number) => string; formatAppliedLabel?: (count: number) => string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `columns` | 是 | `AgentDiffColumn[]` |  |
| `rows` | 是 | `AgentDiffRow[]` |  |
| `applyLabel` | 否 | `string \| undefined` |  |
| `appliedLabel` | 否 | `string \| undefined` |  |
| `onApply` | 否 | `((includedIds: string[]) => void) \| undefined` |  |
| `toggleHint` | 否 | `string \| undefined` |  |
| `formatApplyLabel` | 否 | `((count: number) => string) \| undefined` | Format the complete button text, including count and pluralization. |
| `formatAppliedLabel` | 否 | `((count: number) => string) \| undefined` | Format the complete completion text, including count. |
| `className` | 否 | `string \| undefined` |  |
