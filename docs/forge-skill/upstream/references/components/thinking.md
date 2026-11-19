# thinking

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/thinking.tsx`；core **0.9.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Reasoning (value)

```ts
({ status, text, steps, startedAt, duration, label, doneLabel, open: controlledOpen, onOpenChange, locale, motion, size, className }: ReasoningProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `status` | 是 | `ReasoningStatus` |  |
| `text` | 否 | `string \| undefined` | Free reasoning text from the model (AI SDK reasoning parts). |
| `steps` | 否 | `ReasoningStep[] \| undefined` | Structured steps; shown above `text` when both are given. |
| `startedAt` | 否 | `number \| Date \| undefined` | Start of the thinking, for the live timer. |
| `duration` | 否 | `number \| undefined` | Final duration in milliseconds, shown once done. |
| `label` | 否 | `ReactNode` | Header while thinking. |
| `doneLabel` | 否 | `ReactNode` | Header once done; defaults to "思考了 4.2 秒". |
| `open` | 否 | `boolean \| undefined` | Controlled open state. Uncontrolled, it is open while thinking and folds when done. |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ReasoningProps (type)

```ts
export type ReasoningProps = {
  status: ReasoningStatus;
  /** Free reasoning text from the model (AI SDK reasoning parts). */
  text?: string;
  /** Structured steps; shown above `text` when both are given. */
  steps?: ReasoningStep[];
  /** Start of the thinking, for the live timer. */
  startedAt?: number | Date;
  /** Final duration in milliseconds, shown once done. */
  duration?: number;
  /** Header while thinking. */
  label?: ReactNode;
  /** Header once done; defaults to "思考了 4.2 秒". */
  doneLabel?: ReactNode;
  /** Controlled open state. Uncontrolled, it is open while thinking and folds when done. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  locale?: AgentLocale;
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};
```

## ReasoningSource (type)

```ts
export type ReasoningSource = { title: string; href?: string; domain?: string };
```

## ReasoningStatus (type)

```ts
export type ReasoningStatus = "thinking" | "done" | "stopped" | "error";
```

## ReasoningStep (type)

```ts
export type ReasoningStep = {
  id: string;
  label: ReactNode;
  detail?: ReactNode;
  status?: "running" | "done" | "error";
  /** Pages or records this step read, shown as small chips. */
  sources?: ReasoningSource[];
};
```

## ThinkingIndicator (value)

```ts
({ label, phases, phaseDuration, startedAt, locale, size, className }: ThinkingIndicatorProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 否 | `string \| undefined` | Fixed label; ignored when `phases` is given. |
| `phases` | 否 | `string[] \| undefined` | Labels shown in turn while waiting, e.g. ["读取页面", "查询订单", "整理回答"]; stays on the last one. |
| `phaseDuration` | 否 | `number \| undefined` | Milliseconds per phase. |
| `startedAt` | 否 | `number \| Date \| undefined` | Shows a live timer from this moment. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ThinkingIndicatorProps (type)

```ts
export type ThinkingIndicatorProps = {
  /** Fixed label; ignored when `phases` is given. */
  label?: string;
  /** Labels shown in turn while waiting, e.g. ["读取页面", "查询订单", "整理回答"]; stays on the last one. */
  phases?: string[];
  /** Milliseconds per phase. */
  phaseDuration?: number;
  /** Shows a live timer from this moment. */
  startedAt?: number | Date;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## 选型

- 真实模型的思考过程、等待首字 → `Reasoning`（宿主给 status、时长、步骤）
- 首字之前的一行等待 → `ThinkingIndicator`

不要用：
- 静态演示页里自己播放的思考动画 → `ThinkingTrace`
- 工具调用 → `ToolCall`，不要塞进 Reasoning 的步骤
