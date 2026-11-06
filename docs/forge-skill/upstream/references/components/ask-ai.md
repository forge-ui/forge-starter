# ask-ai

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/ask-ai.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AskAi (value)

```ts
({ color, label, suggestions, placeholder, onSend, disabled, className, header, brand, session, messages: messagesSlot, composer, fullscreen, defaultFullscreen, onFullscreenChange, showFullscreenTrigger, sessions, currentSessionId, onNewSession, onSelectSession, searchQuery, onSearchQueryChange, hasConversation, landingTitle, landingDescription, headerLayout, panelMode, onDockedChange, railLabel, }: AskAiProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `color` | 否 | `AccentColor \| undefined` | Overrides the surrounding accent. Omit to follow the nearest data-accent, or the kit default. |
| `label` | 否 | `string \| undefined` |  |
| `suggestions` | 否 | `string[] \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `onSend` | 是 | `(message: string, request: AskAiRequest) => string \| AskAiResponse \| Promise<string \| AskAiResponse>` | Return plain text or text with business links. At most two safe links are shown. |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `header` | 否 | `ReactNode` | Replace the entire drawer header (brand, session, tools). |
| `brand` | 否 | `ReactNode` | Replace the Ask mark + title in the drawer header and fullscreen rail. |
| `session` | 否 | `ReactNode` | Replace session chrome (drawer header extras / fullscreen history). |
| `messages` | 否 | `ReactNode` | Replace the conversation / empty-state body. Fullscreen: content-only, natural height; no h-full, flex-1 or vertical overflow container. Core owns [data-ask-ai-fs-scroll], follow and jump-to-latest. Use currentSessionId to reset follow when switching external transcripts. |
| `composer` | 否 | `ReactNode` | Replace the default composer (textarea + 发送). Fullscreen: content-only, no outer bottom padding/margin or fixed positioning. Core owns the bottom gap (16px or safe-area, whichever is larger). Consumers sharing slots with the drawer should branch on fullscreen state. |
| `fullscreen` | 否 | `boolean \| undefined` | Controlled fullscreen layer. Independent of the drawer — not a stretched dialog. |
| `defaultFullscreen` | 否 | `boolean \| undefined` | Uncontrolled initial fullscreen when `fullscreen` is omitted. |
| `onFullscreenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `showFullscreenTrigger` | 否 | `boolean \| undefined` | Drawer header control that opens the fullscreen layer. Default true. |
| `sessions` | 否 | `AskAiSessionItem[] \| undefined` | Session list for the default fullscreen rail. Displayed as given; core does not filter. |
| `currentSessionId` | 否 | `string \| undefined` |  |
| `onNewSession` | 否 | `(() => void) \| undefined` |  |
| `onSelectSession` | 否 | `((id: string) => void) \| undefined` |  |
| `searchQuery` | 否 | `string \| undefined` |  |
| `onSearchQueryChange` | 否 | `((query: string) => void) \| undefined` |  |
| `hasConversation` | 否 | `boolean \| undefined` | Force fullscreen landing vs chat layout. Defaults to the built-in conversation length (or chat layout when `messages` is passed). |
| `landingTitle` | 否 | `string \| undefined` |  |
| `landingDescription` | 否 | `string \| undefined` | Supporting copy below the empty-state heading. |
| `headerLayout` | 否 | `"brand" \| "session" \| undefined` | Opt-in session-first panel header with a dedicated new-chat action. |
| `panelMode` | 否 | `"modal" \| "responsive" \| undefined` | Non-modal side panel at >=1440px; falls back to the modal drawer below that. |
| `onDockedChange` | 否 | `((docked: boolean) => void) \| undefined` | Reserve 460px in the host layout while true. Released on close/fullscreen/unmount. |
| `railLabel` | 否 | `string \| undefined` | Fullscreen rail title when `brand` is omitted. |

## AskAiProps (type)

```ts
export interface AskAiProps {
  /** Overrides the surrounding accent. Omit to follow the nearest data-accent, or the kit default. */
  color?: AccentColor;
  label?: string;
  suggestions?: string[];
  placeholder?: string;
  /** Return plain text or text with business links. At most two safe links are shown. */
  onSend: (message: string, request: AskAiRequest) => string | AskAiResponse | Promise<string | AskAiResponse>;
  disabled?: boolean;
  className?: string;
  /** Replace the entire drawer header (brand, session, tools). */
  header?: ReactNode;
  /** Replace the Ask mark + title in the drawer header and fullscreen rail. */
  brand?: ReactNode;
  /** Replace session chrome (drawer header extras / fullscreen history). */
  session?: ReactNode;
  /** Replace the conversation / empty-state body.
   * Fullscreen: content-only, natural height; no h-full, flex-1 or vertical
   * overflow container. Core owns [data-ask-ai-fs-scroll], follow and jump-to-latest.
   * Use currentSessionId to reset follow when switching external transcripts.
   */
  messages?: ReactNode;
  /**
   * Replace the default composer (textarea + 发送).
   * Fullscreen: content-only, no outer bottom padding/margin or fixed positioning.
   * Core owns the bottom gap (16px or safe-area, whichever is larger).
   * Consumers sharing slots with the drawer should branch on fullscreen state.
   */
  composer?: ReactNode;
  /** Controlled fullscreen layer. Independent of the drawer — not a stretched dialog. */
  fullscreen?: boolean;
  /** Uncontrolled initial fullscreen when `fullscreen` is omitted. */
  defaultFullscreen?: boolean;
  onFullscreenChange?: (open: boolean) => void;
  /** Drawer header control that opens the fullscreen layer. Default true. */
  showFullscreenTrigger?: boolean;
  /** Session list for the default fullscreen rail. Displayed as given; core does not filter. */
  sessions?: AskAiSessionItem[];
  currentSessionId?: string;
  onNewSession?: () => void;
  onSelectSession?: (id: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  /**
   * Force fullscreen landing vs chat layout.
   * Defaults to the built-in conversation length (or chat layout when `messages` is passed).
   */
  hasConversation?: boolean;
  landingTitle?: string;
  /** Supporting copy below the empty-state heading. */
  landingDescription?: string;
  /** Opt-in session-first panel header with a dedicated new-chat action. */
  headerLayout?: "brand" | "session";
  /** Non-modal side panel at >=1440px; falls back to the modal drawer below that. */
  panelMode?: "modal" | "responsive";
  /** Reserve 460px in the host layout while true. Released on close/fullscreen/unmount. */
  onDockedChange?: (docked: boolean) => void;
  /** Fullscreen rail title when `brand` is omitted. */
  railLabel?: string;
}
```
