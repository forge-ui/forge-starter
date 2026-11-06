# streaming-answer

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/streaming-answer.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## StreamingAnswer (value)

```ts
({ text, locale, streaming, status, format, animation, duration, motion, sources, sourcesLabel, followUps, followUpsLabel, onFollowUp, onDone, className, }: StreamingAnswerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `text` | 是 | `string` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `streaming` | 否 | `boolean \| undefined` | Replay a complete string. For a live response, use status instead. |
| `status` | 否 | `StreamingAnswerStatus \| undefined` | Transport state. Complete drains the display buffer; stopped freezes it. |
| `format` | 否 | `"plain" \| "markdown" \| undefined` | Plain preserves literal text and whitespace; Markdown is opt-in. |
| `animation` | 否 | `"fade" \| "blur" \| undefined` |  |
| `duration` | 否 | `number \| undefined` | Fade duration in milliseconds; zero shows incoming content immediately. |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `sources` | 否 | `StreamingSource[] \| undefined` |  |
| `sourcesLabel` | 否 | `string \| undefined` |  |
| `followUps` | 否 | `string[] \| undefined` |  |
| `followUpsLabel` | 否 | `string \| undefined` |  |
| `onFollowUp` | 否 | `((text: string, index: number) => void) \| undefined` |  |
| `onDone` | 否 | `(() => void) \| undefined` | Called once per completed answer after its final fade, never on stop. |
| `className` | 否 | `string \| undefined` |  |

## StreamingAnswerProps (type)

```ts
export type StreamingAnswerProps = {
  text: string;
  locale?: "zh" | "en";
  /** Replay a complete string. For a live response, use status instead. */
  streaming?: boolean;
  /** Transport state. Complete drains the display buffer; stopped freezes it. */
  status?: StreamingAnswerStatus;
  /** Plain preserves literal text and whitespace; Markdown is opt-in. */
  format?: "plain" | "markdown";
  animation?: "fade" | "blur";
  /** Fade duration in milliseconds; zero shows incoming content immediately. */
  duration?: number;
  motion?: MotionPreference;
  sources?: StreamingSource[];
  sourcesLabel?: string;
  followUps?: string[];
  followUpsLabel?: string;
  onFollowUp?: (text: string, index: number) => void;
  /** Called once per completed answer after its final fade, never on stop. */
  onDone?: () => void;
  className?: string;
};
```

## StreamingAnswerStatus (type)

```ts
export type StreamingAnswerStatus = "streaming" | "complete" | "stopped";
```

## StreamingSource (type)

```ts
export type StreamingSource = {
  name: string;
  domain?: string;
  href?: string;
};
```
