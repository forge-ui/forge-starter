# folder-float

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/folder-float.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FolderFloat (value)

```ts
({ label, items, trigger, color, onSelect, className }: FolderFloatProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 是 | `string` |  |
| `items` | 是 | `{ id: string; label: string; }[]` |  |
| `trigger` | 否 | `"hover" \| "click" \| undefined` |  |
| `color` | 否 | `"blue" \| "green" \| "violet" \| undefined` |  |
| `onSelect` | 否 | `((id: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FolderFloatProps (type)

```ts
export type FolderFloatProps = {
  label: string;
  items: { id: string; label: string }[];
  trigger?: "hover" | "click";
  color?: "violet" | "blue" | "green";
  onSelect?: (id: string) => void;
  className?: string;
};
```
