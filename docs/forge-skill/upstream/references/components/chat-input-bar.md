# chat-input-bar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/chat-input-bar.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChatInputBar (value)

```ts
({ locale, motion: motionPreference, replyTo, onCancelReply, attachments, hasAttachments, voiceState, voiceLevel, onVoiceStart, onVoiceEnd, onVoiceCancel, quickActions, quickActionsLabel, defaultQuickActionsOpen, hasMessages, removeQuickActionLabel, onQuickActionChange, placeholder, value: controlledValue, onChange, onSend, className, multiline, rows, toggles, sendLabel, showAttachment, onAttach, attachLabel, sendOnEnter, disabled, status, onStop, stopLabel, stoppingLabel, models, model, onModelChange, modelMenuLabel, sendDisabled, inputLabel, clearOnSend, density, sources, selectedSources: controlledSources, defaultSelectedSources, onSourcesChange, removeSourceLabel, sourcesLabel, commands, commandsLabel, emptyCommandsLabel, connectedLabel, onDictate, dictateLabel, toolsMenuLabel, permissions, permission, onPermissionChange, permissionMenuLabel, color, emptySourcesLabel, }: { locale?: "zh" | "en"; motion?: MotionPreference; replyTo?: ComposerReply; onCancelReply?: () => void; attachments?: ReactNode; hasAttachments?: boolean; voiceState?: ComposerVoiceState; voiceLevel?: number; onVoiceStart?: () => void; onVoiceEnd?: () => void; onVoiceCancel?: () => void; quickActions?: ChatInputBarQuickAction[]; quickActionsLabel?: string; hasMessages?: boolean; defaultQuickActionsOpen?: boolean; removeQuickActionLabel?: string; onQuickActionChange?: (action: ChatInputBarQuickAction | null) => void; commands?: ComposerCommand[]; commandsLabel?: string; emptyCommandsLabel?: string; connectedLabel?: string; onDictate?: () => void; dictateLabel?: string; toolsMenuLabel?: string; permissions?: ComposerModel[]; permission?: string; onPermissionChange?: (id: string) => void; permissionMenuLabel?: string; color?: AccentColor; status?: ComposerStatus; onStop?: () => void; stopLabel?: string; stoppingLabel?: string; models?: ComposerModel[]; model?: string; onModelChange?: (id: string) => void; modelMenuLabel?: string; placeholder?: string; value?: string; onChange?: (value: string) => void; onSend?: (message: string, action?: ChatInputBarQuickAction, context?: ChatInputBarSendContext) => void; className?: string; multiline?: boolean; rows?: number; toggles?: ChatInputBarToggle[]; sendLabel?: string; showAttachment?: boolean; onAttach?: () => void; attachLabel?: string; sendOnEnter?: boolean; disabled?: boolean; sendDisabled?: boolean; inputLabel?: string; clearOnSend?: boolean; density?: "default" | "compact"; sources?: ComposerSource[]; selectedSources?: ComposerSource[]; defaultSelectedSources?: ComposerSource[]; onSourcesChange?: (sources: ComposerSource[]) => void; removeSourceLabel?: string; sourcesLabel?: string; emptySourcesLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `replyTo` | 否 | `ComposerReply \| undefined` |  |
| `onCancelReply` | 否 | `(() => void) \| undefined` |  |
| `attachments` | 否 | `ReactNode` | Controlled attachment queue, rendered inside the composer surface. |
| `hasAttachments` | 否 | `boolean \| undefined` | Whether the host has sendable attachments. Combine with sendDisabled while uploading. |
| `voiceState` | 否 | `ComposerVoiceState \| undefined` | Recording/transcription remains owned by the host; no microphone access is requested. |
| `voiceLevel` | 否 | `number \| undefined` |  |
| `onVoiceStart` | 否 | `(() => void) \| undefined` |  |
| `onVoiceEnd` | 否 | `(() => void) \| undefined` |  |
| `onVoiceCancel` | 否 | `(() => void) \| undefined` |  |
| `quickActions` | 否 | `ChatInputBarQuickAction[] \| undefined` | Optional animated action cards, opened from the plus menu. |
| `quickActionsLabel` | 否 | `string \| undefined` |  |
| `hasMessages` | 否 | `boolean \| undefined` | Whether the conversation already contains messages. Omit to infer after the first send. |
| `defaultQuickActionsOpen` | 否 | `boolean \| undefined` | Automatically show configured cards in an empty conversation. |
| `removeQuickActionLabel` | 否 | `string \| undefined` |  |
| `onQuickActionChange` | 否 | `((action: ChatInputBarQuickAction \| null) => void) \| undefined` |  |
| `commands` | 否 | `ComposerCommand[] \| undefined` |  |
| `commandsLabel` | 否 | `string \| undefined` |  |
| `emptyCommandsLabel` | 否 | `string \| undefined` |  |
| `connectedLabel` | 否 | `string \| undefined` |  |
| `onDictate` | 否 | `(() => void) \| undefined` |  |
| `dictateLabel` | 否 | `string \| undefined` |  |
| `toolsMenuLabel` | 否 | `string \| undefined` |  |
| `permissions` | 否 | `ComposerModel[] \| undefined` | Permission choices are owned and enforced by the caller. |
| `permission` | 否 | `string \| undefined` |  |
| `onPermissionChange` | 否 | `((id: string) => void) \| undefined` |  |
| `permissionMenuLabel` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `status` | 否 | `ComposerStatus \| undefined` |  |
| `onStop` | 否 | `(() => void) \| undefined` | Request cancellation; caller confirms stopping, then idle. |
| `stopLabel` | 否 | `string \| undefined` |  |
| `stoppingLabel` | 否 | `string \| undefined` |  |
| `models` | 否 | `ComposerModel[] \| undefined` |  |
| `model` | 否 | `string \| undefined` |  |
| `onModelChange` | 否 | `((id: string) => void) \| undefined` |  |
| `modelMenuLabel` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| undefined` | Controlled value. Pass with onChange to manage external state. |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onSend` | 否 | `((message: string, action?: ChatInputBarQuickAction, context?: ChatInputBarSendContext) => void) \| undefined` | message may be empty for attachment-only sends when hasAttachments is true. |
| `className` | 否 | `string \| undefined` |  |
| `multiline` | 否 | `boolean \| undefined` | Render a textarea instead of a single-line input |
| `rows` | 否 | `number \| undefined` | Textarea row count (multiline only) |
| `toggles` | 否 | `ChatInputBarToggle[] \| undefined` | Footer toggle chips (e.g. Deep think, Web search). Attachment and context actions remain in the plus menu. |
| `sendLabel` | 否 | `string \| undefined` | When given, send button renders as a labeled pill (label + arrow). Otherwise circular icon-only. |
| `showAttachment` | 否 | `boolean \| undefined` | Whether to include attachments in the plus menu. Defaults to true. |
| `onAttach` | 否 | `(() => void) \| undefined` |  |
| `attachLabel` | 否 | `string \| undefined` |  |
| `sendOnEnter` | 否 | `boolean \| undefined` | Multiline Enter sends when enabled; Shift+Enter inserts a newline. |
| `disabled` | 否 | `boolean \| undefined` | Disable editing and tool selection; active generation remains stoppable. |
| `sendDisabled` | 否 | `boolean \| undefined` | Disable sending while keeping the draft editable. |
| `inputLabel` | 否 | `string \| undefined` |  |
| `clearOnSend` | 否 | `boolean \| undefined` | Controlled async callers can clear only after success. |
| `density` | 否 | `"default" \| "compact" \| undefined` |  |
| `sources` | 否 | `ComposerSource[] \| undefined` | Mention suggestions displayed above the composer, inserted at the caret. |
| `selectedSources` | 否 | `ComposerSource[] \| undefined` |  |
| `defaultSelectedSources` | 否 | `ComposerSource[] \| undefined` |  |
| `onSourcesChange` | 否 | `((sources: ComposerSource[]) => void) \| undefined` |  |
| `removeSourceLabel` | 否 | `string \| undefined` |  |
| `sourcesLabel` | 否 | `string \| undefined` |  |
| `emptySourcesLabel` | 否 | `string \| undefined` |  |

## ChatInputBarQuickAction (type)

```ts
export type ChatInputBarQuickAction = {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Built-in animated illustration and card treatment. */
  kind?: "image" | "note" | "event" | "voice" | "docs";
  /** Hint shown while this operation is selected; never inserted into the draft. */
  placeholder?: string;
  onClick?: () => void;
};
```

## ChatInputBarSendContext (type)

```ts
export type ChatInputBarSendContext = { sources: ComposerSource[]; replyTo?: ComposerReply };
```

## ChatInputBarToggle (type)

```ts
export type ChatInputBarToggle = {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
};
```

## ComposerCommand (type)

```ts
export type ComposerCommand = { id: string; label: string; description?: string };
```

## ComposerSource (type)

```ts
export type ComposerSource = {
  id: string; label: string; description?: string; connected?: boolean;
  /** Typed objects render as removable context chips; untyped sources retain text insertion. */
  kind?: "agent" | "skill" | "tool";
  icon?: ReactNode;
  /** Agent avatar shown beside its name in the picker and selected chip. */
  avatarSrc?: string;
  placeholder?: string;
};
```

## 选型

- 聊天页底部 → `ChatInputBar`
- 评论输入 → 用 `TextArea` + 自定义 Submit
- 搜索输入 → `ToolbarSearchInput`
