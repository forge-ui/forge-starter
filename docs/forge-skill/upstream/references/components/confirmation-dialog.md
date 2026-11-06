# confirmation-dialog

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/confirmation-dialog.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ConfirmationDialog (value)

```ts
({ title, description, confirmLabel, cancelLabel, color, icon, layout, onConfirm, onCancel, className, open, onOpenChange, motion, }: { title: string; description: string; confirmLabel?: string; cancelLabel?: string; color: ConfirmationDialogColor; icon?: ReactNode; layout?: ConfirmationDialogLayout; onConfirm?: () => void; onCancel?: () => void; className?: string; open?: boolean; onOpenChange?: (open: boolean) => void; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `description` | 是 | `string` |  |
| `confirmLabel` | 否 | `string \| undefined` |  |
| `cancelLabel` | 否 | `string \| undefined` |  |
| `color` | 是 | `"purple" \| "blue" \| "green" \| "yellow" \| "red"` |  |
| `icon` | 否 | `ReactNode` |  |
| `layout` | 否 | `ConfirmationDialogLayout \| undefined` |  |
| `onConfirm` | 否 | `(() => void) \| undefined` |  |
| `onCancel` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `open` | 否 | `boolean \| undefined` | Omit open for the existing inline card. |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ConfirmationDialogColor (type)

```ts
export type ConfirmationDialogColor = keyof typeof confirmBgColors;
```

## ConfirmationDialogLayout (type)

```ts
export type ConfirmationDialogLayout = "spread" | "right";
```

## 选型

| 场景 | color |
|---|---|
| 删除 / 移除 / 登出 | `red` |
| 发布 / 提交成功确认 | `green` |
| 谨慎操作警告 | `yellow` |
| 普通业务确认 | `blue` / `blue` |
