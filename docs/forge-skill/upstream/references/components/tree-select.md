# tree-select

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/tree-select.tsx`；core **0.11.4**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TreeSelect (value)

```ts
(props: TreeSelectProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `nodes` | 是 | `TreeNode[]` |  |
| `label` | 否 | `string \| undefined` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `searchable` | 否 | `boolean \| undefined` |  |
| `defaultExpandedIds` | 否 | `string[] \| undefined` |  |
| `clearable` | 否 | `boolean \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `errorMessage` | 否 | `string \| undefined` |  |
| `name` | 否 | `string \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `shape` | 否 | `FloatingFieldShape \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `width` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `multiple` | 否 | `boolean \| undefined` |  |
| `value` | 否 | `string \| string[] \| null \| undefined` |  |
| `defaultValue` | 否 | `string \| string[] \| null \| undefined` |  |
| `onChange` | 否 | `((id: string \| null) => void) \| ((ids: string[]) => void) \| undefined` |  |

## TreeSelectProps (type)

```ts
export type TreeSelectProps = TreeSelectBase & (
  | { multiple?: false; value?: string | null; defaultValue?: string | null; onChange?: (id: string | null) => void }
  /** Multiple: checking a parent selects its whole branch; reported ids include fully checked parents. */
  | { multiple: true; value?: string[]; defaultValue?: string[]; onChange?: (ids: string[]) => void }
);
```
