# agent-flowchart

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-flowchart.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentFlowchart (value)

```ts
({ locale, title, nodes, edges, selectedId: controlledId, onSelect, kindLabels, selectedLabel, nextLabel, className, }: { title?: string; locale?: "zh" | "en"; nodes: AgentFlowNode[]; edges?: AgentFlowEdge[]; selectedId?: string; onSelect?: (id: string) => void; kindLabels?: Partial<Record<AgentFlowNode["kind"], string>>; selectedLabel?: string; nextLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `nodes` | 是 | `AgentFlowNode[]` |  |
| `edges` | 否 | `AgentFlowEdge[] \| undefined` |  |
| `selectedId` | 否 | `string \| undefined` |  |
| `onSelect` | 否 | `((id: string) => void) \| undefined` |  |
| `kindLabels` | 否 | `Partial<Record<AgentFlowKind, string>> \| undefined` |  |
| `selectedLabel` | 否 | `string \| undefined` |  |
| `nextLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentFlowEdge (type)

```ts
export type AgentFlowEdge = {
  from: string;
  to: string;
  label?: string;
};
```

## AgentFlowKind (type)

```ts
export type AgentFlowKind = "trigger" | "action" | "condition";
```

## AgentFlowNode (type)

```ts
export type AgentFlowNode = {
  id: string;
  kind: AgentFlowKind;
  title: string;
  body?: string;
  x?: number;
  y?: number;
};
```
