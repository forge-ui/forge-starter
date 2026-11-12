# filter-panel

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/filter-panel.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FilterPanel (value)

```ts
({ title, color, children, onReset, onCancel, onApply, applyLabel, cancelLabel, resetLabel, className, }: { title?: string; color?: AccentColor; children: ReactNode; onReset?: () => void; onCancel?: () => void; onApply?: () => void; applyLabel?: string; cancelLabel?: string; resetLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `onReset` | 否 | `(() => void) \| undefined` |  |
| `onCancel` | 否 | `(() => void) \| undefined` |  |
| `onApply` | 否 | `(() => void) \| undefined` |  |
| `applyLabel` | 否 | `string \| undefined` |  |
| `cancelLabel` | 否 | `string \| undefined` |  |
| `resetLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型建议

<!-- 待补：什么场景用这个 -->
