# cited-answer

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/cited-answer.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Citation (value)

```ts
({ source, active, onActiveChange, locale }: CitationProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `source` | 是 | `CitationSource` |  |
| `active` | 否 | `boolean \| undefined` |  |
| `onActiveChange` | 否 | `((active: boolean) => void) \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |

## CitationProps (type)

```ts
export type CitationProps = {
  source: CitationSource;
  active?: boolean;
  onActiveChange?: (active: boolean) => void;
  locale?: AgentLocale;
};
```

## CitationSource (type)

```ts
export type CitationSource = {
  /** The number used in the text: "[2]" refers to id 2. */
  id: number;
  title: string;
  href?: string;
  /** e.g. "docs.example.com" or "订单中心". */
  domain?: string;
  /** The passage the claim rests on, shown in the preview. */
  quote?: string;
};
```

## CitedAnswer (value)

```ts
({ text, sources, hideSourceList, defaultSourcesOpen, sourcesLabel, locale, motion, size, className }: CitedAnswerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `text` | 是 | `string` | Plain text with citation markers like "[1]" or "[1][3]"; blank lines separate paragraphs. |
| `sources` | 是 | `CitationSource[]` |  |
| `hideSourceList` | 否 | `boolean \| undefined` | Hide the source list under the answer. |
| `defaultSourcesOpen` | 否 | `boolean \| undefined` | Whether the source list starts open. |
| `sourcesLabel` | 否 | `string \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CitedAnswerProps (type)

```ts
export type CitedAnswerProps = {
  /** Plain text with citation markers like "[1]" or "[1][3]"; blank lines separate paragraphs. */
  text: string;
  sources: CitationSource[];
  /** Hide the source list under the answer. */
  hideSourceList?: boolean;
  /** Whether the source list starts open. */
  defaultSourcesOpen?: boolean;
  sourcesLabel?: string;
  locale?: AgentLocale;
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};
```

## 选型

- 每个结论要能回到资料（角标预览原文、高亮对应句子）→ `CitedAnswer`

不要用：
- 流式 Markdown 正文 → `StreamingAnswer` / `AgentParts`
- 只列来源不标句子 → StreamingAnswer 的 sources
