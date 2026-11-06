# toolbar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/toolbar.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PageTitleToolbar (value)

```ts
(props: PageTitleToolbarProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `"overview" \| "collection" \| "detail" \| "action" \| undefined` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `askAi` | 否 | `AskAiProps \| undefined` | Optional Ask AI action, with the same configuration as PageHeader. |
| `title` | 是 | `string` |  |

## PageTitleToolbarAction (type)

```ts
export interface PageTitleToolbarAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  form?: string;
  ariaLabel?: string;
  testId?: string;
}
```

## PageTitleToolbarDateAction (type)

```ts
export interface PageTitleToolbarDateAction {
  label?: string;
  onClick?: () => void;
  enablePopover?: boolean;
}
```

## PageTitleToolbarMenuAction (type)

```ts
export interface PageTitleToolbarMenuAction {
  onClick?: () => void;
  ariaLabel?: string;
}
```

## PageTitleToolbarPresetProps (type)

```ts
export type PageTitleToolbarPresetProps =
  | PageTitleToolbarOverviewProps
  | PageTitleToolbarCollectionProps
  | PageTitleToolbarDetailProps
  | PageTitleToolbarActionProps;
```

## PageTitleToolbarProps (type)

```ts
export type PageTitleToolbarProps = PageTitleToolbarPresetProps | PageTitleToolbarLegacyProps;
```

## PageTitleToolbarVariant (type)

```ts
export type PageTitleToolbarVariant = "overview" | "collection" | "detail" | "action";
```

## Toolbar (value)

```ts
({ left, right, className, selection, locale, motion, }: ToolbarProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `left` | 否 | `ReactNode` |  |
| `right` | 否 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |
| `selection` | 否 | `ToolbarSelectionOptions \| undefined` | Replaces the normal toolbar while count is greater than zero. Keep this configuration present and set count to zero to exit without remounting normal inputs. |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ToolbarActions (value)

```ts
({ children, className, }: { children: ReactNode; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolbarColor (type)

```ts
export type ToolbarColor = "purple" | "blue" | "black";
```

## ToolbarDatepicker (value)

```ts
({ label, onClick, enablePopover, accentBg, className, }: { label?: string; onClick?: () => void; enablePopover?: boolean; accentBg?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 否 | `string \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in calendar). |
| `enablePopover` | 否 | `boolean \| undefined` | Opt-in to built-in calendar popup on click (only when `onClick` is not set). |
| `accentBg` | 否 | `string \| undefined` | Accent bg class for today's highlight in built-in calendar. |
| `className` | 否 | `string \| undefined` |  |

## ToolbarFavoriteButton (value)

```ts
({ onClick, className, }: { onClick?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `onClick` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolbarFilterButton (value)

```ts
({ label, onClick, panel, className, }: { label?: string; onClick?: () => void; panel?: ToolbarFilterPanel; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `label` | 否 | `string \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in popover). |
| `panel` | 否 | `ToolbarFilterPanel` | Optional panel. `ReactNode` or `(close) => ReactNode` so inner Apply/Cancel can close it. |
| `className` | 否 | `string \| undefined` |  |

## ToolbarKebabButton (value)

```ts
({ onClick, ariaLabel, className, }: { onClick?: () => void; ariaLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `onClick` | 否 | `(() => void) \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolbarPillTab (type)

```ts
export interface ToolbarPillTab {
  label: string;
  active?: boolean;
}
```

## ToolbarPillTabs (value)

```ts
({ tabs, color, onChange, className, motion, }: { tabs: ToolbarPillTab[]; color?: ToolbarColor; onChange?: (index: number) => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `tabs` | 是 | `ToolbarPillTab[]` |  |
| `color` | 否 | `ToolbarColor \| undefined` |  |
| `onChange` | 否 | `((index: number) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ToolbarProps (type)

```ts
export type ToolbarProps = {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
  /** Replaces the normal toolbar while count is greater than zero. Keep this configuration present and set count to zero to exit without remounting normal inputs. */
  selection?: ToolbarSelectionOptions;
  locale?: "zh" | "en";
  motion?: MotionPreference;
};
```

## ToolbarSearchInput (value)

```ts
({ placeholder, value, defaultValue, onChange, onSubmit, ariaLabel, className, }: { placeholder?: string; value?: string; defaultValue?: string; onChange?: (value: string) => void; onSubmit?: (value: string) => void; ariaLabel?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `placeholder` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| undefined` |  |
| `defaultValue` | 否 | `string \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `onSubmit` | 否 | `((value: string) => void) \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ToolbarSelectDropdown (value)

```ts
({ placeholder, value, fixedWidth, onClick, options, onChange, className, motion, }: { placeholder?: string; value?: string; fixedWidth?: boolean; onClick?: () => void; options?: ToolbarSelectOption[]; onChange?: (value: string) => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `placeholder` | 否 | `string \| undefined` |  |
| `value` | 否 | `string \| undefined` |  |
| `fixedWidth` | 否 | `boolean \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` | External click handler. If set, takes over (no built-in dropdown). |
| `options` | 否 | `ToolbarSelectOption[] \| undefined` | Data-driven options. When set (and `onClick` not set), clicking pops the list. |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## ToolbarSelectionOptions (type)

```ts
export type ToolbarSelectionOptions = {
  /** Selected item count, controlled by the consumer. Non-finite and negative values become zero. */
  count: number;
  onClear: () => void;
  actions: ReactNode;
  label?: string;
  clearLabel?: string;
};
```

## ToolbarShowSelect (value)

```ts
({ value, onClick, options, onChange, className, }: { value?: string; onClick?: () => void; options?: ToolbarSelectOption[]; onChange?: (value: string) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `string \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |
| `options` | 否 | `ToolbarSelectOption[] \| undefined` |  |
| `onChange` | 否 | `((value: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## 选型

| 场景 | 组合 |
|---|---|
| 列表页顶部搜索 + 筛选 + 新建 | `ToolbarSearchInput` + `ToolbarSelectDropdown` + `ToolbarFilterButton` + `ToolbarActions` |
| 按 tab 切数据视图 | `ToolbarPillTabs` + 右侧操作 |
| 带大 title 的工具栏 | `PageTitleToolbar` |
| 多操作汇聚（分享 / 导出 / 更多） | `ToolbarActions` + `ToolbarKebabButton` |
