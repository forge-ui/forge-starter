# composer

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/composer.tsx`；core **0.10.1**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Composer (value)

```ts
({ children, onSend, value: controlled, onValueChange, status, onStop, disabled, placeholder, quickActions, hasMessages, keepOnSend, locale, className }: ComposerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `onSend` | 是 | `(text: string, quickAction?: ChatInputBarQuickAction) => void` | Called with the trimmed text and the quick action picked for it, if any. |
| `value` | 否 | `string \| undefined` | Controlled draft; omit to let the composer keep it. |
| `onValueChange` | 否 | `((value: string) => void) \| undefined` |  |
| `status` | 否 | `ComposerStatus \| undefined` | "running" turns send into stop. |
| `onStop` | 否 | `(() => void) \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `quickActions` | 否 | `ChatInputBarQuickAction[] \| undefined` | Cards that fan out above the input on an empty conversation, as in ChatInputBar. |
| `hasMessages` | 否 | `boolean \| undefined` | Folds the quick-action cards once the conversation has messages. |
| `keepOnSend` | 否 | `boolean \| undefined` | Keep the draft after sending, e.g. until the host confirms. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ComposerAction (value)

```ts
({ label, icon, onClick, toggleQuickActions, active, showLabel }: ComposerActionProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `icon` | 否 | `ReactNode` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |
| `toggleQuickActions` | 否 | `boolean \| undefined` | Toggles the quick-action cards instead of calling onClick. |
| `active` | 否 | `boolean \| undefined` |  |
| `showLabel` | 否 | `boolean \| undefined` | Shows the label next to the icon. |

## ComposerActionProps (type)

```ts
export type ComposerActionProps = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  /** Toggles the quick-action cards instead of calling onClick. */
  toggleQuickActions?: boolean;
  active?: boolean;
  /** Shows the label next to the icon. */
  showLabel?: boolean;
};
```

## ComposerHeader (value)

```ts
({ children, className }: { children: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## ComposerInput (value)

```ts
({ rows, maxRows, sendOnEnter, label, className }: ComposerInputProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `rows` | 否 | `number \| undefined` | Visible rows before the field grows. |
| `maxRows` | 否 | `number \| undefined` | Rows it grows to before scrolling. |
| `sendOnEnter` | 否 | `boolean \| undefined` | Enter sends and Shift+Enter breaks the line; off makes Enter a line break and ⌘/Ctrl+Enter sends. |
| `label` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ComposerInputProps (type)

```ts
export type ComposerInputProps = {
  /** Visible rows before the field grows. */
  rows?: number;
  /** Rows it grows to before scrolling. */
  maxRows?: number;
  /** Enter sends and Shift+Enter breaks the line; off makes Enter a line break and ⌘/Ctrl+Enter sends. */
  sendOnEnter?: boolean;
  label?: string;
  className?: string;
};
```

## ComposerModelMenu (value)

```ts
({ models, model, onModelChange, label }: ComposerModelMenuProps) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `models` | 是 | `ComposerModel[]` |  |
| `model` | 否 | `string \| undefined` |  |
| `onModelChange` | 否 | `((id: string) => void) \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |

## ComposerModelMenuProps (type)

```ts
export type ComposerModelMenuProps = {
  models: ComposerModel[];
  model?: string;
  onModelChange?: (id: string) => void;
  label?: string;
};
```

## ComposerProps (type)

```ts
export type ComposerProps = {
  children: ReactNode;
  /** Called with the trimmed text and the quick action picked for it, if any. */
  onSend: (text: string, quickAction?: ChatInputBarQuickAction) => void;
  /** Controlled draft; omit to let the composer keep it. */
  value?: string;
  onValueChange?: (value: string) => void;
  /** "running" turns send into stop. */
  status?: ComposerStatus;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  /** Cards that fan out above the input on an empty conversation, as in ChatInputBar. */
  quickActions?: ChatInputBarQuickAction[];
  /** Folds the quick-action cards once the conversation has messages. */
  hasMessages?: boolean;
  /** Keep the draft after sending, e.g. until the host confirms. */
  keepOnSend?: boolean;
  locale?: AgentLocale;
  className?: string;
};
```

## ComposerSend (value)

```ts
({ label, stopLabel, stoppingLabel }: { label?: string; stopLabel?: string; stoppingLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 否 | `string \| undefined` |  |
| `stopLabel` | 否 | `string \| undefined` |  |
| `stoppingLabel` | 否 | `string \| undefined` |  |

## ComposerToolbar (value)

```ts
({ children, className }: { children: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 要改输入框布局（工具栏位置、额外按钮、头部放附件和排队）→ `Composer` 及其部件

不要用：
- 默认布局就够 → `ChatInputBar`
