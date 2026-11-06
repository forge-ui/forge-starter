# sidebar-popovers

自动生成；请勿编辑 API 部分。来源：`core/src/components/layouts/sidebar-popovers.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AppSwitcherDropdown (value)

```ts
({ locale, appName, appIcon, appSubtitle, apps, onAppChange, }: { locale?: "zh" | "en"; appName: string; appIcon?: string; appSubtitle?: string; apps?: AppSwitcherItem[]; onAppChange?: (app: AppSwitcherItem) => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `appName` | 是 | `string` |  |
| `appIcon` | 否 | `string \| undefined` |  |
| `appSubtitle` | 否 | `string \| undefined` |  |
| `apps` | 否 | `AppSwitcherItem[] \| undefined` |  |
| `onAppChange` | 否 | `((app: AppSwitcherItem) => void) \| undefined` |  |

## AppSwitcherItem (type)

```ts
export type AppSwitcherItem = {
  id: string;
  name: string;
  avatar?: string;
  active?: boolean;
};
```

## Team (type)

```ts
export type Team = AppSwitcherItem;
```

## TeamSwitcherLabels (type)

```ts
export type TeamSwitcherLabels = {
  invite?: string;
  settings?: string;
  createNew?: string;
};
```
