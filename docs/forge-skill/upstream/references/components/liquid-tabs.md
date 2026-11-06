# liquid-tabs

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/liquid-tabs.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## LiquidTabs (value)

```ts
({ tabs, value, defaultValue, onValueChange, onSelect, visibleCount, rows, corner, label, moreLabel, emptyLabel, disabled, motion: motionPreference, className }: LiquidTabsProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tabs` | 是 | `LiquidTabsTab[]` |  |
| `value` | 否 | `string \| undefined` |  |
| `defaultValue` | 否 | `string \| undefined` |  |
| `onValueChange` | 否 | `((id: string) => void) \| undefined` |  |
| `onSelect` | 否 | `((item: LiquidTabsItem, tabId: string) => void) \| undefined` |  |
| `visibleCount` | 否 | `number \| undefined` |  |
| `rows` | 否 | `number \| undefined` |  |
| `corner` | 否 | `number \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `moreLabel` | 否 | `string \| undefined` |  |
| `emptyLabel` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## LiquidTabsItem (type)

```ts
export type LiquidTabsItem = { id: string; title: string; subtitle?: string; time?: string; icon?: ReactNode; disabled?: boolean };
```

## LiquidTabsProps (type)

```ts
export type LiquidTabsProps = {
  tabs: LiquidTabsTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  onSelect?: (item: LiquidTabsItem, tabId: string) => void;
  visibleCount?: number;
  rows?: number;
  corner?: number;
  label?: string;
  moreLabel?: string;
  emptyLabel?: string;
  disabled?: boolean;
  motion?: MotionPreference;
  className?: string;
};
```

## LiquidTabsTab (type)

```ts
export type LiquidTabsTab = { id: string; label: string; items: LiquidTabsItem[]; disabled?: boolean };
```
