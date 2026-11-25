# tree

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/tree.tsx`；core **0.11.6**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Tree (value)

```ts
({ nodes, ariaLabel, expandedIds, defaultExpandedIds, onExpandedChange, selectedId, onSelect, checkable, checkedIds, defaultCheckedIds, onCheckedChange, motion, className }: TreeProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `nodes` | 是 | `TreeNode[]` |  |
| `ariaLabel` | 是 | `string` | Accessible name, e.g. "组织架构". |
| `expandedIds` | 否 | `string[] \| undefined` |  |
| `defaultExpandedIds` | 否 | `string[] \| undefined` |  |
| `onExpandedChange` | 否 | `((ids: string[]) => void) \| undefined` |  |
| `selectedId` | 否 | `string \| null \| undefined` | Single selection (click a row). |
| `onSelect` | 否 | `((id: string, node: TreeNode) => void) \| undefined` |  |
| `checkable` | 否 | `boolean \| undefined` | Adds checkboxes. Checking a parent checks every enabled descendant; parents show a partial state. |
| `checkedIds` | 否 | `string[] \| undefined` |  |
| `defaultCheckedIds` | 否 | `string[] \| undefined` |  |
| `onCheckedChange` | 否 | `((ids: string[]) => void) \| undefined` | Receives checked leaf and parent ids. |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TreeNode (type)

```ts
export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Extra text on the right, e.g. a count. */
  meta?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}
```

## TreeProps (type)

```ts
export interface TreeProps {
  nodes: TreeNode[];
  /** Accessible name, e.g. "组织架构". */
  ariaLabel: string;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Single selection (click a row). */
  selectedId?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  /** Adds checkboxes. Checking a parent checks every enabled descendant; parents show a partial state. */
  checkable?: boolean;
  checkedIds?: string[];
  defaultCheckedIds?: string[];
  /** Receives checked leaf and parent ids. */
  onCheckedChange?: (ids: string[]) => void;
  motion?: MotionPreference;
  className?: string;
}
```
