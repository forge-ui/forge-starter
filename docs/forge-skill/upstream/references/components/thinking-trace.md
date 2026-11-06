# thinking-trace

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/thinking-trace.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ThinkingRow (type)

```ts
export type ThinkingRow = {
  primary: string;
  secondary?: string;
  mono?: boolean;
  add?: number;
  del?: number;
  href?: string;
};
```

## ThinkingTrace (value)

```ts
({ variant, locale, motion, rows, activeLabel, doneLabel, query, settled, play, onSettled, className, }: { variant?: ThinkingVariant; locale?: "zh" | "en"; motion?: MotionPreference; rows?: ThinkingRow[]; activeLabel?: string; doneLabel?: string; query?: string; settled?: boolean; play?: boolean; onSettled?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `ThinkingVariant \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `rows` | 否 | `ThinkingRow[] \| undefined` |  |
| `activeLabel` | 否 | `string \| undefined` |  |
| `doneLabel` | 否 | `string \| undefined` |  |
| `query` | 否 | `string \| undefined` |  |
| `settled` | 否 | `boolean \| undefined` | Skip the reveal animation and show the finished trace. |
| `play` | 否 | `boolean \| undefined` | Auto-advance through rows. Turn off when the host drives visibility. |
| `onSettled` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ThinkingVariant (type)

```ts
export type ThinkingVariant = "steps" | "reasoning" | "search" | "coding";
```
