# icon-trigger

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/icon-trigger.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## IconTrigger (value)

```ts
({ icon, accent, state: stateProp, surface, badge, tooltip, tooltipPosition, onClick, ariaLabel, className, motion, panel, panelPlacement, initialFocus, panelAlign, }: { icon: ReactNode; accent?: IconTriggerAccent; state?: IconTriggerState; surface?: IconTriggerSurface; badge?: number; tooltip?: string; tooltipPosition?: TooltipPosition; onClick?: () => void; ariaLabel?: string; className?: string; motion?: MotionPreference; panel?: IconTriggerPanel; panelPlacement?: IconTriggerPanelPlacement; initialFocus?: "first" | "selected" | false; panelAlign?: "center" | "start" | "end"; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `icon` | 是 | `ReactNode` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `state` | 否 | `IconTriggerState \| undefined` |  |
| `surface` | 否 | `IconTriggerSurface \| undefined` |  |
| `badge` | 否 | `number \| undefined` |  |
| `tooltip` | 否 | `string \| undefined` |  |
| `tooltipPosition` | 否 | `TooltipPosition \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in popover). |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `panel` | 否 | `IconTriggerPanel` | Optional panel. `ReactNode` or `(close) => ReactNode` so inner elements can close it. |
| `panelPlacement` | 否 | `IconTriggerPanelPlacement \| undefined` |  |
| `initialFocus` | 否 | `false \| "first" \| "selected" \| undefined` |  |
| `panelAlign` | 否 | `"center" \| "start" \| "end" \| undefined` |  |

## IconTriggerAccent (type)

```ts
export type IconTriggerAccent = AccentColor;
```

## IconTriggerState (type)

```ts
export type IconTriggerState = "idle" | "hover" | "open";
```

## IconTriggerSurface (type)

```ts
export type IconTriggerSurface = "default" | "onColoredBg";
```

## 选型

- topbar 功能 icon → `IconTrigger` + `tooltip` + `badge`
- 带下拉的 icon 触发器 → `panel` prop
- 纯操作按钮（无 popover） → `IconButton`
