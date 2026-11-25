# approval

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/approval.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Approval (value)

```ts
({ title, description, requester, risk, fields, preview, scopes, state, result, onApprove, onDeny, askDenyReason, expiresIn, onExpire, approveLabel, denyLabel, locale, size, className }: ApprovalProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `ReactNode` | What will happen, e.g. "把张三的角色改为管理员". |
| `description` | 否 | `ReactNode` | Why the agent wants it, or what else it affects. |
| `requester` | 否 | `ReactNode` | Who asks, e.g. the agent's name. |
| `risk` | 否 | `ApprovalRisk \| undefined` |  |
| `fields` | 否 | `ApprovalField[] \| undefined` | Field changes, shown as before → after. |
| `preview` | 否 | `ReactNode` | Any preview: a diff, a draft, a record. |
| `scopes` | 否 | `ApprovalScope[] \| undefined` | Offer standing permission, e.g. ["once", "session", "always"]. Without it there is one approve button and `onApprove` receives "once". |
| `state` | 否 | `ApprovalState \| undefined` |  |
| `result` | 否 | `ReactNode` | Shown once approved, e.g. the saved record from the receipt. |
| `onApprove` | 否 | `((scope: ApprovalScope) => void) \| undefined` |  |
| `onDeny` | 否 | `((reason?: string) => void) \| undefined` |  |
| `askDenyReason` | 否 | `boolean \| undefined` | Lets the user say why when denying; the reason goes back to the agent. |
| `expiresIn` | 否 | `number \| undefined` | Seconds until the request lapses; pauses while the pointer is on the card. |
| `onExpire` | 否 | `(() => void) \| undefined` |  |
| `approveLabel` | 否 | `string \| undefined` |  |
| `denyLabel` | 否 | `string \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ApprovalField (type)

```ts
export type ApprovalField = { label: string; before?: string; after: string };
```

## ApprovalProps (type)

```ts
export type ApprovalProps = {
  /** What will happen, e.g. "把张三的角色改为管理员". */
  title: ReactNode;
  /** Why the agent wants it, or what else it affects. */
  description?: ReactNode;
  /** Who asks, e.g. the agent's name. */
  requester?: ReactNode;
  risk?: ApprovalRisk;
  /** Field changes, shown as before → after. */
  fields?: ApprovalField[];
  /** Any preview: a diff, a draft, a record. */
  preview?: ReactNode;
  /**
   * Offer standing permission, e.g. ["once", "session", "always"]. Without it there is one approve
   * button and `onApprove` receives "once".
   */
  scopes?: ApprovalScope[];
  state?: ApprovalState;
  /** Shown once approved, e.g. the saved record from the receipt. */
  result?: ReactNode;
  onApprove?: (scope: ApprovalScope) => void;
  onDeny?: (reason?: string) => void;
  /** Lets the user say why when denying; the reason goes back to the agent. */
  askDenyReason?: boolean;
  /** Seconds until the request lapses; pauses while the pointer is on the card. */
  expiresIn?: number;
  onExpire?: () => void;
  approveLabel?: string;
  denyLabel?: string;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## ApprovalRisk (type)

```ts
export type ApprovalRisk = "low" | "medium" | "high";
```

## ApprovalScope (type)

```ts
export type ApprovalScope = "once" | "session" | "always";
```

## ApprovalState (type)

```ts
export type ApprovalState = "pending" | "working" | "approved" | "denied" | "expired";
```

## ConfirmCard (value)

```ts
({ title, fields, body, confirmLabel, cancelLabel, state, result, onConfirm, onCancel, locale }: ConfirmCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `fields` | 否 | `ApprovalField[] \| undefined` |  |
| `body` | 否 | `string \| undefined` |  |
| `confirmLabel` | 否 | `string \| undefined` |  |
| `cancelLabel` | 否 | `string \| undefined` |  |
| `state` | 否 | `"done" \| "cancelled" \| "pending" \| "working" \| undefined` |  |
| `result` | 否 | `string \| undefined` | Shown once done, e.g. the saved record from the receipt. |
| `onConfirm` | 否 | `(() => void) \| undefined` |  |
| `onCancel` | 否 | `(() => void) \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |

## ConfirmCardProps (type)

```ts
export type ConfirmCardProps = {
  title: string;
  fields?: ConfirmField[];
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  state?: "pending" | "working" | "done" | "cancelled";
  /** Shown once done, e.g. the saved record from the receipt. */
  result?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  locale?: AgentLocale;
};
```

## ConfirmField (type)

```ts
export type ConfirmField = ApprovalField;
```

## 选型

- 写操作、付款、删除前请用户确认（风险、前后对比、允许范围、拒绝原因）→ `Approval`
- Forge Agent 运行时的提案确认 → `ConfirmCard`

不要用：
- 只读查询 → 不需要确认
- 工具调用自带的确认 → `ToolCall` 的 awaiting-approval 状态（AgentParts 会自动渲染）
