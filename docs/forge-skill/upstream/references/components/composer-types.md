# composer-types

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/composer-types.ts`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ComposerModel (type)

```ts
export type ComposerModel = { id: string; label: string };
```

## ComposerReply (type)

```ts
export type ComposerReply = { id: string; name: string; content: string };
```

## ComposerStatus (type)

```ts
export type ComposerStatus = "idle" | "running" | "stopping";
```

## ComposerVoiceState (type)

```ts
export type ComposerVoiceState = "idle" | "recording" | "processing";
```
