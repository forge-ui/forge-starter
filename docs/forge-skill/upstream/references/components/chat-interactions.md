# chat-interactions

自动生成；请勿编辑 API 部分。来源：`core/src/internal/chat-interactions.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChatReaction (type)

```ts
export type ChatReaction = { id: string; label: string; content: ReactNode; count: number; selected?: boolean };
```

## ChatReactionOption (type)

```ts
export type ChatReactionOption = Pick<ChatReaction, "id" | "label" | "content">;
```
