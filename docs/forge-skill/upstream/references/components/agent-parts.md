# agent-parts

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-parts.tsx`；core **0.10.1**。
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
({ parts, status, renderTool, onOpenFile, onToolApproval, locale, size, className }: AgentPartsProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `parts` | 是 | `AgentMessagePart[]` |  |
| `status` | 否 | `"error" \| "streaming" \| "ready" \| "submitted" \| undefined` | `useChat` status; "streaming" keeps the last text part animating. |
| `renderTool` | 否 | `Record<string, (part: AgentToolPart) => ReactNode> \| undefined` | Generative UI: render a tool result with your own component, keyed by tool name. Return null to fall back. |
| `onOpenFile` | 否 | `((part: { url: string; filename?: string; mediaType: string; }) => void) \| undefined` |  |
| `onToolApproval` | 否 | `((response: AgentToolApprovalResponse) => void) \| undefined` | Answer a tool approval request; pass `addToolApprovalResponse` from `useChat`. Without it the request shows as waiting. |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` | sm suits side panels: 14px answer text, tool calls as a plain list that folds once they finish. |
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
  /** Answer a tool approval request; pass `addToolApprovalResponse` from `useChat`. Without it the request shows as waiting. */
  onToolApproval?: (response: AgentToolApprovalResponse) => void;
  locale?: "zh" | "en";
  /** sm suits side panels: 14px answer text, tool calls as a plain list that folds once they finish. */
  size?: "md" | "sm";
  className?: string;
};
```

## AgentToolApproval (type)

```ts
export type AgentToolApproval = { id: string; approved?: boolean; reason?: string; requestReason?: string; isAutomatic?: boolean };
```

## AgentToolApprovalResponse (type)

```ts
export type AgentToolApprovalResponse = { id: string; approved: boolean; reason?: string };
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
  approval?: AgentToolApproval;
};
```

## AgentToolState (type)

```ts
export type AgentToolState = "input-streaming" | "input-available" | "approval-requested" | "approval-responded" | "output-available" | "output-error" | "output-denied";
```

## 选型

- useChat 的 message.parts → `AgentParts`（思考、工具、确认、正文、来源、文件一次渲染）

不要用：
- 非 AI SDK 的自定义运行时 → 自己组合 Reasoning、ToolCall、StreamingAnswer
