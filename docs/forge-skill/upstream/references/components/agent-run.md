# agent-run

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-run.tsx`；core **0.9.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentPlan (value)

```ts
({ title, description, steps, mode, onChange, onApprove, onCancel, onRetryFrom, approveLabel, locale, motion, size, className }: AgentPlanProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `ReactNode` |  |
| `description` | 否 | `ReactNode` |  |
| `steps` | 是 | `PlanStep[]` |  |
| `mode` | 否 | `"done" \| "running" \| "review" \| undefined` | review: the user can edit before it runs; running/done: progress only. |
| `onChange` | 否 | `((steps: PlanStep[]) => void) \| undefined` | Edits in review mode: rename, reorder, remove and add steps. Without it the plan is read-only. |
| `onApprove` | 否 | `(() => void) \| undefined` |  |
| `onCancel` | 否 | `(() => void) \| undefined` |  |
| `onRetryFrom` | 否 | `((stepId: string) => void) \| undefined` | Re-run from a failed step. |
| `approveLabel` | 否 | `string \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentPlanProps (type)

```ts
export type AgentPlanProps = {
  title?: ReactNode;
  description?: ReactNode;
  steps: PlanStep[];
  /** review: the user can edit before it runs; running/done: progress only. */
  mode?: "review" | "running" | "done";
  /** Edits in review mode: rename, reorder, remove and add steps. Without it the plan is read-only. */
  onChange?: (steps: PlanStep[]) => void;
  onApprove?: () => void;
  onCancel?: () => void;
  /** Re-run from a failed step. */
  onRetryFrom?: (stepId: string) => void;
  approveLabel?: string;
  locale?: AgentLocale;
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};
```

## AgentStepStatus (type)

```ts
export type AgentStepStatus = "pending" | "running" | "waiting" | "done" | "failed" | "skipped";
```

## AgentTrail (value)

```ts
({ title, steps, collapseAfter, locale, size, className }: AgentTrailProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `ReactNode` |  |
| `steps` | 是 | `TrailStep[]` |  |
| `collapseAfter` | 否 | `number \| undefined` | Folds finished steps into one line when there are more than this. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentTrailProps (type)

```ts
export type AgentTrailProps = {
  title: ReactNode;
  steps: TrailStep[];
  /** Folds finished steps into one line when there are more than this. */
  collapseAfter?: number;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## PlanStep (type)

```ts
export type PlanStep = {
  id: string;
  title: string;
  detail?: string;
  status?: AgentStepStatus;
  startedAt?: number | Date;
  duration?: number;
};
```

## ProgressStep (type)

```ts
export type ProgressStep = { id: string; title: string; status: "running" | "waiting-user" | "waiting-external" | "completed" | "cancelled" | "failed"; meta?: string };
```

## RunProgress (value)

```ts
({ steps, locale }: { steps: ProgressStep[]; locale?: AgentLocale; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `steps` | 是 | `ProgressStep[]` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |

## TrailStep (type)

```ts
export type TrailStep = {
  id: string;
  title: string;
  status: AgentStepStatus;
  /** What it is doing right now, shown under a running step. */
  activity?: string;
  startedAt?: number | Date;
  duration?: number;
  substeps?: TrailSubstep[];
  /** Content for a waiting step, usually an Approval or Question. */
  waiting?: ReactNode;
  error?: string;
};
```

## TrailSubstep (type)

```ts
export type TrailSubstep = { id: string; title: string; status: AgentStepStatus; duration?: number };
```

## 选型

- 执行前给用户改计划 → `AgentPlan`
- 执行中看步骤、子步骤和等待确认 → `AgentTrail`
- Forge Agent 运行时的步骤 → `RunProgress`

不要用：
- 单次工具调用 → `ToolCall`
