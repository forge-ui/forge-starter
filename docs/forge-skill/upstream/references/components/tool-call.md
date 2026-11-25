# tool-call

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/tool-call.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ToolCall (value)

```ts
({ name, title, summary, status, args, result, error, startedAt, duration, icon, details, onRetry, approvalReason, onApprove, onDeny, defaultOpen, openOnError, variant, locale, motion, size, className }: ToolCallProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `name` | 是 | `string` | Tool name as the model calls it, e.g. "search_orders". |
| `title` | 否 | `ReactNode` | Human label shown instead of the name, e.g. "查询订单". |
| `summary` | 否 | `ReactNode` | Short summary after the label, e.g. the main argument or "12 条结果". |
| `status` | 是 | `ToolCallStatus` |  |
| `args` | 否 | `unknown` |  |
| `result` | 否 | `unknown` |  |
| `error` | 否 | `string \| undefined` |  |
| `startedAt` | 否 | `number \| Date \| undefined` | Start time, for the live timer while running. |
| `duration` | 否 | `number \| undefined` | Final duration in milliseconds. |
| `icon` | 否 | `ReactNode` | Replaces the check once the call has finished, e.g. the tool's logo. |
| `details` | 否 | `ReactNode` | Custom body shown when the row opens, instead of the argument and result blocks. |
| `onRetry` | 否 | `(() => void) \| undefined` | Shown on errors. |
| `approvalReason` | 否 | `ReactNode` | Why the agent wants to run this; shown while awaiting approval. |
| `onApprove` | 否 | `(() => void) \| undefined` |  |
| `onDeny` | 否 | `(() => void) \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `openOnError` | 否 | `boolean \| undefined` | Open by itself when the call fails, so the error shows. |
| `variant` | 否 | `"row" \| "card" \| undefined` | row: one line, as listed inside a ToolCallGroup; card: on its own with an outline. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolCallGroup (value)

```ts
({ children, label, count, status, statusLabel, defaultOpen, locale, motion, className }: ToolCallGroupProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `label` | 否 | `ReactNode` | e.g. "调用了 3 次工具"; defaults from `count`. |
| `count` | 否 | `number \| undefined` |  |
| `status` | 否 | `"idle" \| "success" \| "error" \| "running" \| "cancelled" \| undefined` |  |
| `statusLabel` | 否 | `ReactNode` | Replaces the status word after the label, e.g. "执行失败". |
| `defaultOpen` | 否 | `boolean \| undefined` | Uncontrolled default; the group opens itself unless everything succeeded. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolCallGroupProps (type)

```ts
export type ToolCallGroupProps = {
  children: ReactNode;
  /** e.g. "调用了 3 次工具"; defaults from `count`. */
  label?: ReactNode;
  count?: number;
  status?: "idle" | "running" | "success" | "error" | "cancelled";
  /** Replaces the status word after the label, e.g. "执行失败". */
  statusLabel?: ReactNode;
  /** Uncontrolled default; the group opens itself unless everything succeeded. */
  defaultOpen?: boolean;
  locale?: AgentLocale;
  motion?: MotionPreference;
  className?: string;
};
```

## ToolCallProps (type)

```ts
export type ToolCallProps = {
  /** Tool name as the model calls it, e.g. "search_orders". */
  name: string;
  /** Human label shown instead of the name, e.g. "查询订单". */
  title?: ReactNode;
  /** Short summary after the label, e.g. the main argument or "12 条结果". */
  summary?: ReactNode;
  status: ToolCallStatus;
  args?: unknown;
  result?: unknown;
  error?: string;
  /** Start time, for the live timer while running. */
  startedAt?: number | Date;
  /** Final duration in milliseconds. */
  duration?: number;
  /** Replaces the check once the call has finished, e.g. the tool's logo. */
  icon?: ReactNode;
  /** Custom body shown when the row opens, instead of the argument and result blocks. */
  details?: ReactNode;
  /** Shown on errors. */
  onRetry?: () => void;
  /** Why the agent wants to run this; shown while awaiting approval. */
  approvalReason?: ReactNode;
  onApprove?: () => void;
  onDeny?: () => void;
  defaultOpen?: boolean;
  /** Open by itself when the call fails, so the error shows. */
  openOnError?: boolean;
  /** row: one line, as listed inside a ToolCallGroup; card: on its own with an outline. */
  variant?: "card" | "row";
  locale?: AgentLocale;
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};
```

## ToolCallStatus (type)

```ts
export type ToolCallStatus = "pending" | "running" | "awaiting-approval" | "success" | "error" | "denied";
```

## 选型

- 一次工具调用（状态、计时、参数、结果、重试、就地确认）→ `ToolCall`
- 一轮里的多次调用折成一行 → `ToolCallGroup`

不要用：
- 面向最终用户、不关心参数时 → 只给一行 `ThinkingIndicator` 状态
- 只是思考 → `Reasoning`
