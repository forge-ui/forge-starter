# selection-control

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/selection-control.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## CheckboxWithLabel (value)

```ts
({ checked, motion, onChange, label, color, checkboxPosition, icon, avatar, dotColor, disabled, className, }: { checked?: boolean; motion?: MotionPreference; onChange?: (checked: boolean) => void; label: string; color?: ControlColor; checkboxPosition?: "left" | "right"; icon?: ReactNode; avatar?: string; dotColor?: string; disabled?: boolean; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `label` | 是 | `string` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `checkboxPosition` | 否 | `"left" \| "right" \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |
| `avatar` | 否 | `string \| undefined` |  |
| `dotColor` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ControlColor (type)

```ts
export type ControlColor = FormAccentColor;
```

## RadioButton (value)

```ts
({ checked, onChange, color, disabled, ariaLabel, }: { checked?: boolean; onChange?: (checked: boolean) => void; color?: ControlColor; disabled?: boolean; ariaLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |

## RadioWithLabel (value)

```ts
({ checked, onChange, label, color, radioPosition, dotColor, disabled, className, tabIndex, }: { checked?: boolean; onChange?: (checked: boolean) => void; label: string; color?: ControlColor; radioPosition?: "left" | "right"; dotColor?: string; disabled?: boolean; className?: string; tabIndex?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `label` | 是 | `string` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `radioPosition` | 否 | `"left" \| "right" \| undefined` |  |
| `dotColor` | 否 | `string \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `tabIndex` | 否 | `number \| undefined` |  |

## Toggle (value)

```ts
({ checked, defaultChecked, motion, onChange, color, disabled, size, ariaLabel, draggable, thumbIcon, }: ToggleProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checked` | 否 | `boolean \| undefined` |  |
| `defaultChecked` | 否 | `boolean \| undefined` | Initial value when checked is not supplied. |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `onChange` | 否 | `((checked: boolean) => void) \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `disabled` | 否 | `boolean \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `draggable` | 否 | `boolean \| undefined` | Allow dragging the thumb; clicking and keyboard activation remain available. |
| `thumbIcon` | 否 | `ReactNode` |  |

## ToggleProps (type)

```ts
export type ToggleProps = {
  checked?: boolean;
  /** Initial value when checked is not supplied. */
  defaultChecked?: boolean;
  motion?: MotionPreference;
  onChange?: (checked: boolean) => void;
  color?: ControlColor;
  disabled?: boolean;
  size?: "sm" | "md";
  ariaLabel?: string;
  /** Allow dragging the thumb; clicking and keyboard activation remain available. */
  draggable?: boolean;
  thumbIcon?: ReactNode;
};
```
