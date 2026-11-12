# approval-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/approval-card.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ApprovalCard (value)

```ts
({ questions, locale, skipLabel, skipSubmitLabel, continueLabel, sendLabel, sentLabel, onSubmitted, previousQuestionLabel, nextQuestionLabel, className, }: { questions: ApprovalQuestion[]; locale?: "zh" | "en"; skipLabel?: string; skipSubmitLabel?: string; continueLabel?: string; sendLabel?: string; sentLabel?: string; onSubmitted?: (answers: Record<string, string[]>) => void; previousQuestionLabel?: string; nextQuestionLabel?: string; className?: string; }) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `questions` | 是 | `ApprovalQuestion[]` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `skipLabel` | 否 | `string \| undefined` |  |
| `skipSubmitLabel` | 否 | `string \| undefined` |  |
| `continueLabel` | 否 | `string \| undefined` |  |
| `sendLabel` | 否 | `string \| undefined` |  |
| `sentLabel` | 否 | `string \| undefined` |  |
| `onSubmitted` | 否 | `((answers: Record<string, string[]>) => void) \| undefined` |  |
| `previousQuestionLabel` | 否 | `string \| undefined` |  |
| `nextQuestionLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ApprovalQuestion (type)

```ts
export type ApprovalQuestion = {
  id: string;
  prompt: string;
  type?: "radio" | "check";
  options: { id: string; label: string }[];
};
```
