# checklist

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/checklist.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Checklist (value)

```ts
({ tasks, locale, defaultTasks, size, color, onTasksChange, className, motion, }: { tasks?: ChecklistTask[]; locale?: "zh" | "en"; defaultTasks?: ChecklistTask[]; size?: ChecklistSize; color?: ChecklistColor; onTasksChange?: (tasks: ChecklistTask[]) => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tasks` | 否 | `ChecklistTask[] \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `defaultTasks` | 否 | `ChecklistTask[] \| undefined` |  |
| `size` | 否 | `ChecklistSize \| undefined` |  |
| `color` | 否 | `ChecklistColor \| undefined` |  |
| `onTasksChange` | 否 | `((tasks: ChecklistTask[]) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ChecklistColor (type)

```ts
export type ChecklistColor = Exclude<CheckboxColor, "orange">;
```

## ChecklistItem (value)

```ts
({ label, checked, defaultChecked, size, color, onCheckedChange, onSettled, onReverted, className, motion, }: { label: string; checked?: boolean; defaultChecked?: boolean; size?: ChecklistSize; color?: ChecklistColor; onCheckedChange?: (checked: boolean) => void; onSettled?: () => void; onReverted?: () => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `checked` | 否 | `boolean \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` |  |
| `size` | 否 | `ChecklistSize \| undefined` |  |
| `color` | 否 | `ChecklistColor \| undefined` |  |
| `onCheckedChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `onSettled` | 否 | `(() => void) \| undefined` |  |
| `onReverted` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ChecklistSize (type)

```ts
export type ChecklistSize = "sm" | "md";
```

## ChecklistTask (type)

```ts
export type ChecklistTask = {
  id: string;
  label: string;
  done?: boolean;
};
```
