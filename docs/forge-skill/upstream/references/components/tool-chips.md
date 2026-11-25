# tool-chips

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/tool-chips.tsx`；core **0.11.5**。
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
({ items, locale, motion, state, result, actions, size, defaultOpen, diffs, summary, className, }: { items: ToolChipItem[]; locale?: "zh" | "en"; motion?: MotionPreference; state?: "idle" | "running" | "success" | "error" | "cancelled"; result?: ReactNode; actions?: ReactNode; size?: "md" | "sm"; defaultOpen?: boolean; diffs?: ToolDiffChip[]; summary?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `ToolChipItem[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `state` | 否 | `"idle" \| "success" \| "error" \| "running" \| "cancelled" \| undefined` |  |
| `result` | 否 | `ReactNode` |  |
| `actions` | 否 | `ReactNode` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` | sm drops the card around the group and tightens rows, for side panels. |
| `defaultOpen` | 否 | `boolean \| undefined` | Whether the list starts expanded. A later change applies until the reader toggles it. |
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

> 已废弃：新代码用 `ToolCallGroup` + `ToolCall`；下个大版本删除。

## 选型

- 已有 ToolChipItem 数据、要显示思考/写入/运行混排和文件增删 → `ToolChips`（内部用 ToolCall 渲染）

不要用：
- 新接 AI SDK 工具调用 → `ToolCall` / `ToolCallGroup`，或直接 `AgentParts`
