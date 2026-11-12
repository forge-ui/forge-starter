# ask-ai-types

自动生成；请勿编辑 API 部分。来源：`core/src/internal/ask-ai-types.ts`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AskAiLink (type)

```ts
export interface AskAiLink {
  label: string;
  href: string;
}
```

## AskAiMessage (type)

```ts
export interface AskAiMessage {
  role: "user" | "assistant";
  content: string;
  links?: AskAiLink[];
}
```

## AskAiRequest (type)

```ts
export interface AskAiRequest {
  messages: AskAiMessage[];
  signal: AbortSignal;
}
```

## AskAiResponse (type)

```ts
export interface AskAiResponse {
  text: string;
  links?: AskAiLink[];
}
```

## AskAiSessionItem (type)

```ts
export interface AskAiSessionItem {
  id: string;
  title: string;
}
```
