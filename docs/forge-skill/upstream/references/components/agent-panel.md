# agent-panel

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-panel.tsx`；core **0.9.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AGENT_PANEL_WIDTH (value)

```ts
400
```

## AgentPanel (value)

```ts
({ title, open, onOpenChange, launcher, launcherLabel, empty, followKey, children, onNewChat, sessions, currentSessionId, onSelectSession, onRenameSession, onDeleteSession, onPinSession, notice, composer }: AgentPanelProps) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `open` | 是 | `boolean` |  |
| `onOpenChange` | 是 | `(open: boolean) => void` |  |
| `launcher` | 否 | `boolean \| undefined` | The floating launcher; turn it off when the app opens the panel from its own button. |
| `launcherLabel` | 否 | `string \| undefined` |  |
| `empty` | 否 | `ReactNode` | Shown above the composer when there is nothing in the conversation yet. |
| `followKey` | 否 | `unknown` | Changes when content arrives, to keep following the latest reply. |
| `children` | 否 | `ReactNode` |  |
| `onNewChat` | 否 | `(() => void) \| undefined` |  |
| `sessions` | 否 | `ConversationItem[] \| undefined` | Earlier conversations, listed under the history button. |
| `currentSessionId` | 否 | `string \| undefined` |  |
| `onSelectSession` | 否 | `((id: string) => void) \| undefined` |  |
| `onRenameSession` | 否 | `((id: string, title: string) => void) \| undefined` |  |
| `onDeleteSession` | 否 | `((id: string) => void) \| undefined` |  |
| `onPinSession` | 否 | `((id: string, pinned: boolean) => void) \| undefined` |  |
| `notice` | 否 | `ReactNode` | Above the composer: errors, attachments, notices. |
| `composer` | 是 | `ReactNode \| { locale?: "zh" \| "en"; motion?: MotionPreference; replyTo?: ComposerReply; onCancelReply?: () => void; attachments?: ReactNode; hasAttachments?: boolean; voiceState?: ComposerVoiceState; voiceLevel?: number; onVoiceStart?: () => void; onVoiceEnd?: () => void; onVoiceCancel?: () => void; quickActions?: ChatInputBarQuickAction[]; quickActionsLabel?: string; hasMessages?: boolean; defaultQuickActionsOpen?: boolean; removeQuickActionLabel?: string; onQuickActionChange?: (action: ChatInputBarQuickAction \| null) => void; commands?: ComposerCommand[]; commandsLabel?: string; emptyCommandsLabel?: string; connectedLabel?: string; onDictate?: () => void; dictateLabel?: string; toolsMenuLabel?: string; permissions?: ComposerModel[]; permission?: string; onPermissionChange?: (id: string) => void; permissionMenuLabel?: string; color?: AccentColor; status?: ComposerStatus; onStop?: () => void; stopLabel?: string; stoppingLabel?: string; models?: ComposerModel[]; model?: string; onModelChange?: (id: string) => void; modelMenuLabel?: string; placeholder?: string; value?: string; onChange?: (value: string) => void; onSend?: (message: string, action?: ChatInputBarQuickAction, context?: ChatInputBarSendContext) => void; className?: string; multiline?: boolean; rows?: number; toggles?: ChatInputBarToggle[]; sendLabel?: string; showAttachment?: boolean; onAttach?: () => void; attachLabel?: string; sendOnEnter?: boolean; disabled?: boolean; sendDisabled?: boolean; inputLabel?: string; clearOnSend?: boolean; density?: "default" \| "compact"; sources?: ComposerSource[]; selectedSources?: ComposerSource[]; defaultSelectedSources?: ComposerSource[]; onSourcesChange?: (sources: ComposerSource[]) => void; removeSourceLabel?: string; sourcesLabel?: string; emptySourcesLabel?: string; }` | ChatInputBar props, or your own composer. Quick-action cards (`quickActions`) open on an empty chat and fold once it has messages. |

## AgentPanelProps (type)

```ts
export type AgentPanelProps = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The floating launcher; turn it off when the app opens the panel from its own button. */
  launcher?: boolean;
  launcherLabel?: string;
  /** Shown above the composer when there is nothing in the conversation yet. */
  empty?: ReactNode;
  /** Changes when content arrives, to keep following the latest reply. */
  followKey?: unknown;
  children?: ReactNode;
  onNewChat?: () => void;
  /** Earlier conversations, listed under the history button. */
  sessions?: AgentSession[];
  currentSessionId?: string;
  onSelectSession?: (id: string) => void;
  onRenameSession?: (id: string, title: string) => void;
  onDeleteSession?: (id: string) => void;
  onPinSession?: (id: string, pinned: boolean) => void;
  /** Above the composer: errors, attachments, notices. */
  notice?: ReactNode;
  /** ChatInputBar props, or your own composer. Quick-action cards (`quickActions`) open on an empty chat and fold once it has messages. */
  composer: ComponentProps<typeof ChatInputBar> | ReactNode;
};
```

## AgentSession (type)

```ts
export type AgentSession = ConversationItem;
```

## 选型

- 页面右侧的智能体面板（入口按钮、历史、新对话、消息区、输入框）→ `AgentPanel`；接模型运行时直接用 agent 包的 `ForgeAgent`

不要用：
- 旧的抽屉式助手 → `AskAi` 只为兼容保留
