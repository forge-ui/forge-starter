# chat-bubble

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/chat-bubble.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChatBubble (value)

```ts
({ type, locale, motion, reactions, reactionOptions, onReaction, onReply, replyTo, delivery, variant, color, content, time, avatar, senderName, images, extraImageCount, fileName, fileSize, onFileDownload, voiceDuration, className, }: { type: "sent" | "received"; locale?: "zh" | "en"; motion?: MotionPreference; reactions?: ChatReaction[]; reactionOptions?: ChatReactionOption[]; onReaction?: (id: string) => void; onReply?: () => void; replyTo?: ComposerReply; delivery?: "queued" | "sending" | "sent" | "delivered" | "failed"; variant?: "text" | "voice" | "file" | "image"; color?: AccentColor; content?: string; time?: string; avatar?: string; senderName?: string; images?: string[]; extraImageCount?: number; fileName?: string; fileSize?: string; onFileDownload?: () => void; voiceDuration?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `type` | 是 | `"sent" \| "received"` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `reactions` | 否 | `ChatReaction[] \| undefined` |  |
| `reactionOptions` | 否 | `ChatReactionOption[] \| undefined` |  |
| `onReaction` | 否 | `((id: string) => void) \| undefined` |  |
| `onReply` | 否 | `(() => void) \| undefined` |  |
| `replyTo` | 否 | `ComposerReply \| undefined` |  |
| `delivery` | 否 | `"sent" \| "queued" \| "sending" \| "delivered" \| "failed" \| undefined` |  |
| `variant` | 否 | `"text" \| "voice" \| "file" \| "image" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `content` | 否 | `string \| undefined` |  |
| `time` | 否 | `string \| undefined` |  |
| `avatar` | 否 | `string \| undefined` |  |
| `senderName` | 否 | `string \| undefined` |  |
| `images` | 否 | `string[] \| undefined` |  |
| `extraImageCount` | 否 | `number \| undefined` |  |
| `fileName` | 否 | `string \| undefined` |  |
| `fileSize` | 否 | `string \| undefined` |  |
| `onFileDownload` | 否 | `(() => void) \| undefined` | Renders an actionable download button for received file messages. |
| `voiceDuration` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 消息列表 → `ChatBubble` 按 sent/received 方向自动对齐
- 输入框 → 搭配 `ChatInputBar`
- 联系人行 → `ContactItem`
