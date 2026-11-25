# feedback

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/feedback.tsx`；core **0.11.3**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Alert (value)

```ts
({ tone, title, children, icon, action, closable, onClose, closeLabel, banner, className }: AlertProps) => JSX.Element | null
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tone` | 否 | `AlertTone \| undefined` |  |
| `title` | 否 | `ReactNode` |  |
| `children` | 否 | `ReactNode` |  |
| `icon` | 否 | `ReactNode` | Replaces the tone icon; pass `null` to hide it. |
| `action` | 否 | `ReactNode` | Buttons or links shown on the right (or below on narrow screens). |
| `closable` | 否 | `boolean \| undefined` | Shows a close button. The alert hides itself unless `onClose` is controlled by the host. |
| `onClose` | 否 | `(() => void) \| undefined` |  |
| `closeLabel` | 否 | `string \| undefined` |  |
| `banner` | 否 | `boolean \| undefined` | Full-width strip without rounding, for the top of a page or card. |
| `className` | 否 | `string \| undefined` |  |

## AlertProps (type)

```ts
export interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Replaces the tone icon; pass `null` to hide it. */
  icon?: ReactNode | null;
  /** Buttons or links shown on the right (or below on narrow screens). */
  action?: ReactNode;
  /** Shows a close button. The alert hides itself unless `onClose` is controlled by the host. */
  closable?: boolean;
  onClose?: () => void;
  closeLabel?: string;
  /** Full-width strip without rounding, for the top of a page or card. */
  banner?: boolean;
  className?: string;
}
```

## AlertTone (type)

```ts
export type AlertTone = "info" | "success" | "warning" | "error";
```

## EmptyState (value)

```ts
({ title, description, icon, action, size, className }: EmptyStateProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `ReactNode` |  |
| `description` | 否 | `ReactNode` |  |
| `icon` | 否 | `ReactNode` |  |
| `action` | 否 | `ReactNode` | Primary next step, e.g. a "新建" button. |
| `size` | 否 | `"default" \| "compact" \| undefined` | `compact` for inside tables and cards. |
| `className` | 否 | `string \| undefined` |  |

## EmptyStateProps (type)

```ts
export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Primary next step, e.g. a "新建" button. */
  action?: ReactNode;
  /** `compact` for inside tables and cards. */
  size?: "compact" | "default";
  className?: string;
}
```

## LoadingOverlay (value)

```ts
({ loading, label, children, className }: { loading: boolean; label?: string; children: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `loading` | 是 | `boolean` |  |
| `label` | 否 | `string \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## Result (value)

```ts
({ status, title, description, actions, children, className }: ResultProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `status` | 是 | `ResultStatus` |  |
| `title` | 是 | `ReactNode` |  |
| `description` | 否 | `ReactNode` |  |
| `actions` | 否 | `ReactNode` | Buttons, e.g. "返回列表" and "查看详情". |
| `children` | 否 | `ReactNode` | Extra detail below the actions, such as an error list. |
| `className` | 否 | `string \| undefined` |  |

## ResultProps (type)

```ts
export interface ResultProps {
  status: ResultStatus;
  title: ReactNode;
  description?: ReactNode;
  /** Buttons, e.g. "返回列表" and "查看详情". */
  actions?: ReactNode;
  /** Extra detail below the actions, such as an error list. */
  children?: ReactNode;
  className?: string;
}
```

## ResultStatus (type)

```ts
export type ResultStatus = "success" | "error" | "warning" | "info" | "403" | "404";
```

## Skeleton (value)

```ts
({ shape, lines, width, height, className }: SkeletonProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `shape` | 否 | `"text" \| "circle" \| "rect" \| undefined` | `text` lines, a `circle` (avatar) or a `rect` block. |
| `lines` | 否 | `number \| undefined` | Number of text lines; the last one is shorter. |
| `width` | 否 | `string \| number \| undefined` |  |
| `height` | 否 | `string \| number \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## SkeletonProps (type)

```ts
export interface SkeletonProps {
  /** `text` lines, a `circle` (avatar) or a `rect` block. */
  shape?: "text" | "circle" | "rect";
  /** Number of text lines; the last one is shorter. */
  lines?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
}
```

## Spinner (value)

```ts
({ size, label, className }: { size?: SpinnerSize; label?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `size` | 否 | `SpinnerSize \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## SpinnerSize (type)

```ts
export type SpinnerSize = "sm" | "md" | "lg";
```
