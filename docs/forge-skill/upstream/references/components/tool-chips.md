# tool-chips

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/tool-chips.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ToolChipDetail (type)

```ts
export type ToolChipDetail = {
  text: string;
  tone?: "add" | "del" | "plain";
};
```

## ToolChipItem (type)

```ts
export type ToolChipItem = {
  id: string;
  kind: ToolChipKind;
  label: string;
  chip: string;
  mono?: boolean;
  detail?: ToolChipDetail[];
  status?: "pending" | "running" | "complete" | "error" | "cancelled";
};
```

## ToolChipKind (type)

```ts
export type ToolChipKind = "think" | "write" | "run" | "read" | "edit";
```

## ToolChips (value)

```ts
({ items, locale, motion, state, result, actions, diffs, summary, className, }: { items: ToolChipItem[]; locale?: "zh" | "en"; motion?: MotionPreference; state?: "idle" | "running" | "success" | "error" | "cancelled"; result?: ReactNode; actions?: ReactNode; diffs?: ToolDiffChip[]; summary?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `ToolChipItem[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `state` | 否 | `"idle" \| "success" \| "error" \| "running" \| "cancelled" \| undefined` |  |
| `result` | 否 | `ReactNode` |  |
| `actions` | 否 | `ReactNode` |  |
| `diffs` | 否 | `ToolDiffChip[] \| undefined` |  |
| `summary` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolDiffChip (type)

```ts
export type ToolDiffChip = {
  file: string;
  add: number;
  del?: number;
};
```
