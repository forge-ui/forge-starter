# composer-parts

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/composer-parts.tsx`；core **0.11.3**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AttachmentItem (type)

```ts
export type AttachmentItem = {
  id: string;
  /** File name; its extension picks the file-type icon. */
  name: string;
  /** Bytes. */
  size?: number;
  kind?: AttachmentKind;
  /** Thumbnail for images. */
  previewUrl?: string;
  /** Upload progress from 0 to 100; omit when done. */
  progress?: number;
  error?: string;
};
```

## AttachmentKind (type)

```ts
export type AttachmentKind = "image" | "document" | "sheet" | "file";
```

## AttachmentList (value)

```ts
({ items, onRemove, onRetry, onOpen, locale, className }: AttachmentListProps) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `AttachmentItem[]` |  |
| `onRemove` | 否 | `((id: string) => void) \| undefined` |  |
| `onRetry` | 否 | `((id: string) => void) \| undefined` |  |
| `onOpen` | 否 | `((id: string) => void) \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AttachmentListProps (type)

```ts
export type AttachmentListProps = {
  items: AttachmentItem[];
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  onOpen?: (id: string) => void;
  locale?: AgentLocale;
  className?: string;
};
```

## PromptQueue (value)

```ts
({ items, onRemove, onEdit, onSendNow, onMove, locale, motion, className }: PromptQueueProps) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `QueuedPrompt[]` |  |
| `onRemove` | 否 | `((id: string) => void) \| undefined` |  |
| `onEdit` | 否 | `((id: string, text: string) => void) \| undefined` |  |
| `onSendNow` | 否 | `((id: string) => void) \| undefined` | Sends this one next, ahead of the rest. |
| `onMove` | 否 | `((id: string, direction: -1 \| 1) => void) \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## PromptQueueProps (type)

```ts
export type PromptQueueProps = {
  items: QueuedPrompt[];
  onRemove?: (id: string) => void;
  onEdit?: (id: string, text: string) => void;
  /** Sends this one next, ahead of the rest. */
  onSendNow?: (id: string) => void;
  onMove?: (id: string, direction: -1 | 1) => void;
  locale?: AgentLocale;
  motion?: MotionPreference;
  className?: string;
};
```

## QueuedPrompt (type)

```ts
export type QueuedPrompt = { id: string; text: string; attachments?: number };
```

## RunControls (value)

```ts
({ status, activity, startedAt, duration, error, onStop, onResume, onRetry, onDismiss, onSteer, locale, motion, className }: RunControlsProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `status` | 是 | `RunStatus` |  |
| `activity` | 否 | `string \| undefined` | What the agent is doing now, e.g. "正在核对 3 张发票". |
| `startedAt` | 否 | `number \| Date \| undefined` |  |
| `duration` | 否 | `number \| undefined` |  |
| `error` | 否 | `string \| undefined` | Shown when failed. |
| `onStop` | 否 | `(() => void) \| undefined` |  |
| `onResume` | 否 | `(() => void) \| undefined` | Continue a stopped run from where it stopped. |
| `onRetry` | 否 | `(() => void) \| undefined` |  |
| `onDismiss` | 否 | `(() => void) \| undefined` |  |
| `onSteer` | 否 | `((note: string) => void) \| undefined` | Steer while it works: the note is picked up at the agent's next step. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## RunControlsProps (type)

```ts
export type RunControlsProps = {
  status: RunStatus;
  /** What the agent is doing now, e.g. "正在核对 3 张发票". */
  activity?: string;
  startedAt?: number | Date;
  duration?: number;
  /** Shown when failed. */
  error?: string;
  onStop?: () => void;
  /** Continue a stopped run from where it stopped. */
  onResume?: () => void;
  onRetry?: () => void;
  onDismiss?: () => void;
  /** Steer while it works: the note is picked up at the agent's next step. */
  onSteer?: (note: string) => void;
  locale?: AgentLocale;
  motion?: MotionPreference;
  className?: string;
};
```

## RunStatus (type)

```ts
export type RunStatus = "running" | "stopping" | "stopped" | "failed" | "done";
```

## 选型

- 运行中停止/继续/重试/插一句 → `RunControls`
- 回答没结束时写的消息 → `PromptQueue`
- 消息附件 → `AttachmentList`

不要用：
- 文件上传表单 → `FileUpload`
