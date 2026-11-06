# agent-task-rows

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-task-rows.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentTask (type)

```ts
export type AgentTask = {
  id: string;
  title: string;
  status: AgentTaskStatus;
  meta?: string;
  children?: AgentTaskChild[];
};
```

## AgentTaskChild (type)

```ts
export type AgentTaskChild = {
  label: string;
  value?: string;
  status?: AgentTaskStatus;
};
```

## AgentTaskRows (value)

```ts
({ tasks, locale, variant, statusLabels, className, }: { tasks: AgentTask[]; locale?: "zh" | "en"; variant?: "list" | "capsules"; statusLabels?: Partial<Record<AgentTaskStatus, string>>; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tasks` | 是 | `AgentTask[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `variant` | 否 | `"list" \| "capsules" \| undefined` |  |
| `statusLabels` | 否 | `Partial<Record<AgentTaskStatus, string>> \| undefined` | Translations for task states in both layouts. Missing entries use the selected locale. |
| `className` | 否 | `string \| undefined` |  |

## AgentTaskStatus (type)

```ts
export type AgentTaskStatus = "running" | "failed" | "completed";
```
