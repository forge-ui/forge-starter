# agent-parts

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-parts.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentMessagePart (type)

```ts
export type AgentMessagePart =
  | { type: "text"; text: string; state?: "streaming" | "done" }
  | { type: "reasoning"; text: string; state?: "streaming" | "done" }
  | AgentToolPart
  | { type: "source-url"; sourceId: string; url: string; title?: string }
  | { type: "source-document"; sourceId: string; title: string; filename?: string }
  | { type: "file"; mediaType: string; url: string; filename?: string }
  | { type: "step-start" }
  | { type: string; [key: string]: unknown };
```

## AgentParts (value)

```ts
({ parts, status, renderTool, onOpenFile, locale, className }: AgentPartsProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `parts` | 是 | `AgentMessagePart[]` |  |
| `status` | 否 | `"error" \| "streaming" \| "ready" \| "submitted" \| undefined` | `useChat` status; "streaming" keeps the last text part animating. |
| `renderTool` | 否 | `Record<string, (part: AgentToolPart) => ReactNode> \| undefined` | Generative UI: render a tool result with your own component, keyed by tool name. Return null to fall back. |
| `onOpenFile` | 否 | `((part: { url: string; filename?: string; mediaType: string; }) => void) \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentPartsProps (type)

```ts
export type AgentPartsProps = {
  parts: AgentMessagePart[];
  /** `useChat` status; "streaming" keeps the last text part animating. */
  status?: "submitted" | "streaming" | "ready" | "error";
  /** Generative UI: render a tool result with your own component, keyed by tool name. Return null to fall back. */
  renderTool?: Record<string, (part: AgentToolPart) => ReactNode>;
  onOpenFile?: (part: { url: string; filename?: string; mediaType: string }) => void;
  locale?: "zh" | "en";
  className?: string;
};
```

## AgentToolPart (type)

```ts
export type AgentToolPart = {
  type: `tool-${string}` | "dynamic-tool";
  toolCallId: string;
  toolName?: string;
  state: AgentToolState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};
```

## AgentToolState (type)

```ts
export type AgentToolState = "input-streaming" | "input-available" | "output-available" | "output-error";
```
