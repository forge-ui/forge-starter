# add-member

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/add-member.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AddMember (value)

```ts
({ members, accent, selectedIds, defaultSelectedIds, onSelectionChange, onAdd, clearOnAdd, open, defaultOpen, onOpenChange, rows, search, disabled, labels, motion: motionPreference, className }: AddMemberProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `members` | 是 | `AddMemberItem[]` |  |
| `accent` | 否 | `AccentColor \| undefined` | Optional Forge theme; omitted preserves the original panel colors. |
| `selectedIds` | 否 | `string[] \| undefined` |  |
| `defaultSelectedIds` | 否 | `string[] \| undefined` |  |
| `onSelectionChange` | 否 | `((ids: string[]) => void) \| undefined` |  |
| `onAdd` | 否 | `((ids: string[]) => void \| Promise<void>) \| undefined` | Resolving confirms success. Reject to retain the selection for retry. |
| `clearOnAdd` | 否 | `boolean \| undefined` |  |
| `open` | 否 | `boolean \| undefined` |  |
| `defaultOpen` | 否 | `boolean \| undefined` |  |
| `onOpenChange` | 否 | `((open: boolean) => void) \| undefined` |  |
| `rows` | 否 | `number \| undefined` |  |
| `search` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `labels` | 否 | `Partial<AddMemberLabels> \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AddMemberItem (type)

```ts
export type AddMemberItem = { id: string; name: string; role?: string; avatar?: string; status?: "online" | "idle" | "dnd" | "offline"; disabled?: boolean };
```

## AddMemberLabels (type)

```ts
export type AddMemberLabels = {
  title: string; search: string; empty: string; add: string; adding: string; added: string; error: string;
  select: string; remove: string; selected: string; viewAll: string; previous: string; next: string;
};
```

## AddMemberProps (type)

```ts
export type AddMemberProps = {
  members: AddMemberItem[];
  /** Optional Forge theme; omitted preserves the original panel colors. */
  accent?: AccentColor;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Resolving confirms success. Reject to retain the selection for retry. */
  onAdd?: (ids: string[]) => void | Promise<void>;
  clearOnAdd?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  rows?: number;
  search?: boolean;
  disabled?: boolean;
  labels?: Partial<AddMemberLabels>;
  motion?: MotionPreference;
  className?: string;
};
```
