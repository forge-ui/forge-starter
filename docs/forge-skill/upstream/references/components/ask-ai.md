# ask-ai

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/ask-ai.tsx`；core **0.10.1**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AskAi (value)

```ts
({ color, label, suggestions, placeholder, onSend, disabled, className, messages: messagesSlot, composer, sessions, currentSessionId, onNewSession, onSelectSession, landingTitle, landingDescription, }: AskAiProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `color` | 否 | `AccentColor \| undefined` | Overrides the surrounding accent. Omit to follow the nearest data-accent, or the kit default. |
| `label` | 否 | `string \| undefined` | Entry button text and panel title. |
| `suggestions` | 否 | `string[] \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `onSend` | 是 | `(message: string, request: AskAiRequest) => string \| AskAiResponse \| Promise<string \| AskAiResponse>` | Return plain text or text with business links. At most two safe links are shown. |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `messages` | 否 | `ReactNode` | Replace the built-in conversation, e.g. with AgentParts driven by your own runtime. |
| `composer` | 否 | `ReactNode` | Replace the built-in composer. |
| `sessions` | 否 | `AskAiSessionItem[] \| undefined` | Earlier conversations, listed under the history button. Displayed as given. |
| `currentSessionId` | 否 | `string \| undefined` |  |
| `onNewSession` | 否 | `(() => void) \| undefined` |  |
| `onSelectSession` | 否 | `((id: string) => void) \| undefined` |  |
| `landingTitle` | 否 | `string \| undefined` |  |
| `landingDescription` | 否 | `string \| undefined` | Supporting copy below the empty-state heading. |

## AskAiProps (type)

```ts
export interface AskAiProps {
  /** Overrides the surrounding accent. Omit to follow the nearest data-accent, or the kit default. */
  color?: AccentColor;
  /** Entry button text and panel title. */
  label?: string;
  suggestions?: string[];
  placeholder?: string;
  /** Return plain text or text with business links. At most two safe links are shown. */
  onSend: (message: string, request: AskAiRequest) => string | AskAiResponse | Promise<string | AskAiResponse>;
  disabled?: boolean;
  className?: string;
  /** Replace the built-in conversation, e.g. with AgentParts driven by your own runtime. */
  messages?: ReactNode;
  /** Replace the built-in composer. */
  composer?: ReactNode;
  /** Earlier conversations, listed under the history button. Displayed as given. */
  sessions?: AskAiSessionItem[];
  currentSessionId?: string;
  onNewSession?: () => void;
  onSelectSession?: (id: string) => void;
  landingTitle?: string;
  /** Supporting copy below the empty-state heading. */
  landingDescription?: string;
}
```

## 选型

- 已有页面继续用 → `AskAi`

不要用：
- 新功能 → `AgentPanel`
