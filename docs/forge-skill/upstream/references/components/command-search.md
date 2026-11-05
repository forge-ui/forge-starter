# command-search

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/command-search.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CommandSearch (value)

```ts
({ items, placeholder, emptyLabel, query: controlledQuery, onQueryChange, onSelect, groupLabel, locale, color, motion, autoFocus, className, }: { items: CommandSearchItem[]; placeholder?: string; emptyLabel?: string; query?: string; onQueryChange?: (query: string) => void; onSelect?: (item: CommandSearchItem) => void; groupLabel?: string; locale?: "zh" | "en"; color?: AccentColor; motion?: MotionPreference; autoFocus?: boolean; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `CommandSearchItem[]` |  |
| `placeholder` | 否 | `string \| undefined` |  |
| `emptyLabel` | 否 | `string \| undefined` |  |
| `query` | 否 | `string \| undefined` |  |
| `onQueryChange` | 否 | `((query: string) => void) \| undefined` |  |
| `onSelect` | 否 | `((item: CommandSearchItem) => void) \| undefined` |  |
| `groupLabel` | 否 | `string \| undefined` | Heading for items without an explicit group. |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `autoFocus` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## CommandSearchItem (type)

```ts
export type CommandSearchItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  keywords?: string[];
  /** Optional leading icon, typically from the Solar icon collection. */
  icon?: ReactNode;
  /** Display only; the consumer owns shortcut registration. */
  shortcut?: string;
};
```
