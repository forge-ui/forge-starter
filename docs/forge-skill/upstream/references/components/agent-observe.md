# agent-observe

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-observe.tsx`；core **0.11.3**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentLanes (value)

```ts
({ lanes, blocks, now, onSelect, title, locale, size, className }: AgentLanesProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `lanes` | 是 | `{ id: string; name: string; icon?: ReactNode; }[]` |  |
| `blocks` | 是 | `LaneBlock[]` |  |
| `now` | 是 | `number` | Milliseconds since the start of the window. |
| `onSelect` | 否 | `((id: string) => void) \| undefined` |  |
| `title` | 否 | `ReactNode` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentLanesProps (type)

```ts
export type AgentLanesProps = {
  lanes: { id: string; name: string; icon?: ReactNode }[];
  blocks: LaneBlock[];
  /** Milliseconds since the start of the window. */
  now: number;
  onSelect?: (id: string) => void;
  title?: ReactNode;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## AgentTree (value)

```ts
({ root, selectedId, onSelect, currency, locale, className }: AgentTreeProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `root` | 是 | `TreeAgent` |  |
| `selectedId` | 否 | `string \| undefined` |  |
| `onSelect` | 否 | `((id: string) => void) \| undefined` |  |
| `currency` | 否 | `string \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentTreeProps (type)

```ts
export type AgentTreeProps = {
  root: TreeAgent;
  selectedId?: string;
  onSelect?: (id: string) => void;
  currency?: string;
  locale?: AgentLocale;
  className?: string;
};
```

## ContextSegment (type)

```ts
export type ContextSegment = {
  id: string;
  label: string;
  tokens: number;
  kind?: ContextSegmentKind;
  /** Files and memories can be taken out of the context. */
  removable?: boolean;
};
```

## ContextSegmentKind (type)

```ts
export type ContextSegmentKind = "system" | "tools" | "memory" | "files" | "chat" | "other";
```

## ContextUsage (value)

```ts
({ variant, locale, size, className, ...props }: ContextUsageProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `segments` | 是 | `ContextSegment[]` |  |
| `limit` | 是 | `number` | The model's context window in tokens. |
| `cost` | 否 | `number \| undefined` | Spend so far in this conversation. |
| `currency` | 否 | `string \| undefined` |  |
| `onRemove` | 否 | `((id: string) => void) \| undefined` |  |
| `onCompact` | 否 | `(() => void) \| undefined` | Summarise older turns to free room. |
| `variant` | 否 | `"inline" \| "card" \| undefined` | inline: a small ring for the composer toolbar that opens the breakdown. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ContextUsageProps (type)

```ts
export type ContextUsageProps = {
  segments: ContextSegment[];
  /** The model's context window in tokens. */
  limit: number;
  /** Spend so far in this conversation. */
  cost?: number;
  currency?: string;
  onRemove?: (id: string) => void;
  /** Summarise older turns to free room. */
  onCompact?: () => void;
  /** inline: a small ring for the composer toolbar that opens the breakdown. */
  variant?: "card" | "inline";
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## LaneBlock (type)

```ts
export type LaneBlock = {
  id: string;
  laneId: string;
  title: string;
  /** Milliseconds from the start of the window. */
  start: number;
  /** Omit while it is still running; it then grows to `now`. */
  end?: number;
  status: "running" | "waiting" | "done" | "failed";
};
```

## TraceSpan (type)

```ts
export type TraceSpan = {
  id: string;
  name: string;
  kind: "llm" | "tool" | "agent" | "other";
  /** Milliseconds from the start of the run. */
  start: number;
  /** Milliseconds; omit while running. */
  duration?: number;
  depth?: number;
  tokens?: number;
  cost?: number;
  status?: "ok" | "error" | "running";
};
```

## TraceWaterfall (value)

```ts
({ spans, now, selectedId, onSelect, title, currency, locale, size, className }: TraceWaterfallProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `spans` | 是 | `TraceSpan[]` |  |
| `now` | 否 | `number \| undefined` | Milliseconds since the start, for spans still running. |
| `selectedId` | 否 | `string \| undefined` |  |
| `onSelect` | 否 | `((id: string) => void) \| undefined` |  |
| `title` | 否 | `ReactNode` |  |
| `currency` | 否 | `string \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TraceWaterfallProps (type)

```ts
export type TraceWaterfallProps = {
  spans: TraceSpan[];
  /** Milliseconds since the start, for spans still running. */
  now?: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
  title?: ReactNode;
  currency?: string;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## TreeAgent (type)

```ts
export type TreeAgent = {
  id: string;
  name: string;
  role?: string;
  status: TreeAgentStatus;
  /** What it is doing right now. */
  activity?: string;
  cost?: number;
  duration?: number;
  children?: TreeAgent[];
};
```

## TreeAgentStatus (type)

```ts
export type TreeAgentStatus = "running" | "waiting" | "done" | "failed" | "idle";
```

## 选型

- 上下文占用和压缩 → `ContextUsage`
- 一次运行的耗时和花费 → `TraceWaterfall`
- 多智能体分工 → `AgentTree`；时间线 → `AgentLanes`

不要用：
- 业务指标 → `StatCard` / 图表
