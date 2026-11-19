# question

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/question.tsx`；core **0.9.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ChoiceAnswer (type)

```ts
export type ChoiceAnswer = { optionId: string } | { optionIds: string[] } | { text: string };
```

## ChoiceCard (value)

```ts
({ title, options, multiple, allowText, disabled, answered, onAnswer, onCancel, locale }: ChoiceCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `options` | 是 | `ChoiceOption[]` |  |
| `multiple` | 否 | `boolean \| undefined` |  |
| `allowText` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `answered` | 否 | `ReactNode` | What was chosen once answered; the card then shows it instead of the controls. |
| `onAnswer` | 是 | `(answer: ChoiceAnswer) => void` |  |
| `onCancel` | 否 | `(() => void) \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |

## ChoiceCardProps (type)

```ts
export type ChoiceCardProps = {
  title: string;
  options: ChoiceOption[];
  multiple?: boolean;
  allowText?: boolean;
  disabled?: boolean;
  /** What was chosen once answered; the card then shows it instead of the controls. */
  answered?: ReactNode;
  onAnswer: (answer: ChoiceAnswer) => void;
  onCancel?: () => void;
  locale?: AgentLocale;
};
```

## ChoiceOption (type)

```ts
export type ChoiceOption = { id: string; label: string; description?: string };
```

## Question (value)

```ts
({ questions, onSubmit, onCancel, skippable, answers: answered, confirm, disabled, submitLabel, labels, locale, size, className }: QuestionProps) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `questions` | 是 | `QuestionItem[]` |  |
| `onSubmit` | 是 | `(answers: Record<string, QuestionAnswer>) => void` | Called once with every answer; skipped questions are left out. |
| `onCancel` | 否 | `(() => void) \| undefined` | Adds a cancel button that drops the whole question. |
| `skippable` | 否 | `boolean \| undefined` | Adds a skip button per question; the last skip submits what was answered. |
| `answers` | 否 | `Record<string, QuestionAnswer> \| undefined` | Once answered, pass the answers back: the card shows what was chosen. Without it the card shows a short "答案已提交" status after submitting. |
| `confirm` | 否 | `boolean \| undefined` | A single single-choice question submits on click, and a single choice moves to the next question, unless this is set; then every step waits for Continue. |
| `disabled` | 否 | `boolean \| undefined` |  |
| `submitLabel` | 否 | `string \| undefined` |  |
| `labels` | 否 | `Partial<Record<"submit" \| "next" \| "previous" \| "sent" \| "skip" \| "skipSubmit" \| "continue" \| "cancel" \| "skipped", string>> \| undefined` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## QuestionAnswer (type)

```ts
export type QuestionAnswer = { optionIds: string[]; text?: string };
```

## QuestionItem (type)

```ts
export type QuestionItem = {
  id: string;
  title: string;
  description?: string;
  options: QuestionOption[];
  multiple?: boolean;
  /** Adds a free-text field. Defaults to on when there are no options. */
  allowText?: boolean;
  textPlaceholder?: string;
};
```

## QuestionLabels (type)

```ts
export type QuestionLabels = Partial<Record<"skip" | "skipSubmit" | "continue" | "submit" | "cancel" | "previous" | "next" | "sent" | "skipped", string>>;
```

## QuestionOption (type)

```ts
export type QuestionOption = {
  id: string;
  label: string;
  description?: string;
  /** Marks the option the agent would pick. */
  recommended?: boolean;
};
```

## QuestionProps (type)

```ts
export type QuestionProps = {
  questions: QuestionItem[];
  /** Called once with every answer; skipped questions are left out. */
  onSubmit: (answers: Record<string, QuestionAnswer>) => void;
  /** Adds a cancel button that drops the whole question. */
  onCancel?: () => void;
  /** Adds a skip button per question; the last skip submits what was answered. */
  skippable?: boolean;
  /**
   * Once answered, pass the answers back: the card shows what was chosen. Without it the card shows
   * a short "答案已提交" status after submitting.
   */
  answers?: Record<string, QuestionAnswer>;
  /**
   * A single single-choice question submits on click, and a single choice moves to the next question,
   * unless this is set; then every step waits for Continue.
   */
  confirm?: boolean;
  disabled?: boolean;
  submitLabel?: string;
  labels?: QuestionLabels;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## 选型

- 缺信息、要用户在明确选项里挑 → `Question`（单题点选即提交，多题逐题、可跳过）
- Forge Agent 运行时的候选选择 → `ChoiceCard`

不要用：
- 开放问题 → 直接用文字问
- 改数据前确认 → `Approval`
