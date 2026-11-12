# filter-trigger

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/filter-trigger.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FilterTrigger (value)

```ts
({ label, color, count, open: openProp, onClick, panel, }: { label?: string; color?: AccentColor; count?: number; open?: boolean; onClick?: () => void; panel?: FilterTriggerPanel; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `count` | 否 | `number \| undefined` |  |
| `open` | 否 | `boolean \| undefined` | Controlled open state. If set, internal state is ignored. |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in popover). |
| `panel` | 否 | `FilterTriggerPanel` | Optional panel content. `ReactNode` or `(close) => ReactNode` so inner Apply/Cancel can close it. |

## 选型建议

<!-- 待补：什么场景用这个 -->
