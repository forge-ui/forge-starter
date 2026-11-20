# agent-conversation

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-conversation.tsx`；core **0.10.1**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentMessage (value)

```ts
({ role, children, name, avatar, time, actions, className }: AgentMessageProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `role` | 是 | `AgentMessageRole` |  |
| `children` | 是 | `ReactNode` |  |
| `name` | 否 | `string \| undefined` |  |
| `avatar` | 否 | `ReactNode` |  |
| `time` | 否 | `string \| undefined` |  |
| `actions` | 否 | `ReactNode` | Rendered under assistant content, usually MessageActions. |
| `className` | 否 | `string \| undefined` |  |

## AgentMessageProps (type)

```ts
export type AgentMessageProps = {
  role: AgentMessageRole;
  children: ReactNode;
  name?: string;
  avatar?: ReactNode;
  time?: string;
  /** Rendered under assistant content, usually MessageActions. */
  actions?: ReactNode;
  className?: string;
};
```

## AgentMessageRole (type)

```ts
export type AgentMessageRole = "user" | "assistant";
```

## ArtifactCard (value)

```ts
({ title, kind, meta, status, onOpen, onDownload, locale, labels, className }: ArtifactCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `kind` | 否 | `ArtifactKind \| undefined` |  |
| `meta` | 否 | `string \| undefined` | Short line under the title, e.g. "Markdown · 2.4 KB". |
| `status` | 否 | `ArtifactStatus \| undefined` |  |
| `onOpen` | 否 | `(() => void) \| undefined` |  |
| `onDownload` | 否 | `(() => void) \| undefined` |  |
| `locale` | 否 | `Locale \| undefined` |  |
| `labels` | 否 | `Partial<Record<"error" \| "open" \| "generating" \| "download", string>> \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ArtifactCardProps (type)

```ts
export type ArtifactCardProps = {
  title: string;
  kind?: ArtifactKind;
  /** Short line under the title, e.g. "Markdown · 2.4 KB". */
  meta?: string;
  status?: ArtifactStatus;
  onOpen?: () => void;
  onDownload?: () => void;
  locale?: Locale;
  labels?: Partial<Record<"open" | "download" | "generating" | "error", string>>;
  className?: string;
};
```

## ArtifactKind (type)

```ts
export type ArtifactKind = "document" | "code" | "table" | "image" | "file";
```

## ArtifactStatus (type)

```ts
export type ArtifactStatus = "generating" | "ready" | "error";
```

## Conversation (value)

```ts
({ children, followKey, locale, latestLabel, motion, className }: ConversationProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `followKey` | 否 | `unknown` | Change this when new content arrives (message count, streamed length…) to keep following the latest reply. |
| `locale` | 否 | `Locale \| undefined` |  |
| `latestLabel` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ConversationProps (type)

```ts
export type ConversationProps = {
  children: ReactNode;
  /** Change this when new content arrives (message count, streamed length…) to keep following the latest reply. */
  followKey?: unknown;
  locale?: Locale;
  latestLabel?: string;
  motion?: MotionPreference;
  className?: string;
};
```

## MessageActions (value)

```ts
({ copyText, onRetry, onFeedback, feedback: controlled, versions, onEdit, feedbackReasons, onFeedbackReason, locale, labels, className }: MessageActionsProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `copyText` | 否 | `string \| undefined` | Text copied by the copy action; omit to hide copy. |
| `onRetry` | 否 | `(() => void) \| undefined` |  |
| `onFeedback` | 否 | `((value: MessageFeedback) => void) \| undefined` |  |
| `feedback` | 否 | `MessageFeedback \| undefined` |  |
| `versions` | 否 | `{ current: number; total: number; onChange: (index: number) => void; } \| undefined` | Regenerated replies: shows "2/3" with previous and next. `current` is 0-based. |
| `onEdit` | 否 | `(() => void) \| undefined` | Edit and resend; usually on the user's message. |
| `feedbackReasons` | 否 | `string[] \| undefined` | Offered after a thumbs down, e.g. ["没回答问题", "数据不对", "太长"]. |
| `onFeedbackReason` | 否 | `((reason: string) => void) \| undefined` |  |
| `locale` | 否 | `Locale \| undefined` |  |
| `labels` | 否 | `Partial<Record<"next" \| "previous" \| "copy" \| "up" \| "down" \| "copied" \| "retry" \| "edit", string>> \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## MessageActionsProps (type)

```ts
export type MessageActionsProps = {
  /** Text copied by the copy action; omit to hide copy. */
  copyText?: string;
  onRetry?: () => void;
  onFeedback?: (value: MessageFeedback) => void;
  feedback?: MessageFeedback;
  /** Regenerated replies: shows "2/3" with previous and next. `current` is 0-based. */
  versions?: { current: number; total: number; onChange: (index: number) => void };
  /** Edit and resend; usually on the user's message. */
  onEdit?: () => void;
  /** Offered after a thumbs down, e.g. ["没回答问题", "数据不对", "太长"]. */
  feedbackReasons?: string[];
  onFeedbackReason?: (reason: string) => void;
  locale?: Locale;
  labels?: Partial<Record<"copy" | "copied" | "retry" | "up" | "down" | "edit" | "previous" | "next", string>>;
  className?: string;
};
```

## MessageFeedback (type)

```ts
export type MessageFeedback = "up" | "down" | null;
```

## PromptSuggestions (value)

```ts
({ suggestions, onSelect, label, size, className }: PromptSuggestionsProps) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `suggestions` | 是 | `string[]` |  |
| `onSelect` | 是 | `(text: string, index: number) => void` |  |
| `label` | 否 | `string \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## PromptSuggestionsProps (type)

```ts
export type PromptSuggestionsProps = {
  suggestions: string[];
  onSelect: (text: string, index: number) => void;
  label?: string;
  size?: "md" | "sm";
  className?: string;
};
```

## 选型

- 消息滚动区（跟随最新、回到最新）→ `Conversation`；一轮消息 → `AgentMessage`；回复下的操作 → `MessageActions`；推荐提问 → `PromptSuggestions`；生成的文件 → `ArtifactCard`

不要用：
- 人和人的聊天 → `ChatBubble`
