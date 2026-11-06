# sidebar-menu

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/sidebar-menu.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## SidebarMenu (value)

```ts
({ logo, logoText, teamName, teamAvatar, teamMemberCount, mainMenuItems, favoriteItems, profile, accent, mode, bgMode, width, railWidth, onMenuCollapse, className, motion, }: { logo?: ReactNode; logoText?: string; teamName?: string; teamAvatar?: string; teamMemberCount?: number; mainMenuItems: SidebarMenuItem[]; favoriteItems?: SidebarMenuItem[]; profile?: { avatar: string; name: string; role: string; }; accent?: SidebarMenuAccent; mode?: SidebarMenuMode; bgMode?: SidebarMenuBgMode; width?: string; railWidth?: string; onMenuCollapse?: () => void; className?: string; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `logo` | 否 | `ReactNode` |  |
| `logoText` | 否 | `string \| undefined` |  |
| `teamName` | 否 | `string \| undefined` |  |
| `teamAvatar` | 否 | `string \| undefined` |  |
| `teamMemberCount` | 否 | `number \| undefined` |  |
| `mainMenuItems` | 是 | `SidebarMenuItem[]` |  |
| `favoriteItems` | 否 | `SidebarMenuItem[] \| undefined` |  |
| `profile` | 否 | `{ avatar: string; name: string; role: string; } \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `mode` | 否 | `SidebarMenuMode \| undefined` |  |
| `bgMode` | 否 | `SidebarMenuBgMode \| undefined` |  |
| `width` | 否 | `string \| undefined` | Expanded sidebar width. Accepts any CSS length; default keeps the Forge starter density. |
| `railWidth` | 否 | `string \| undefined` | Minimized sidebar rail width. Accepts any CSS length; default keeps the Forge starter density. |
| `onMenuCollapse` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |

## SidebarMenuAccent (type)

```ts
export type SidebarMenuAccent = AccentColor;
```

## SidebarMenuBgMode (type)

```ts
export type SidebarMenuBgMode = "white" | "colored";
```

## SidebarMenuItem (type)

```ts
export type SidebarMenuItem = {
  icon?: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  expanded?: boolean;
  badge?: number;
  children?: SidebarMenuItem[];
};
```

## SidebarMenuMode (type)

```ts
export type SidebarMenuMode = "full" | "minimized";
```

## 选型

| 场景 | 配置 |
|---|---|
| 默认后台 | `mode="full"`, `bgMode="white"` |
| 紧凑（只 icon 轨道） | `mode="minimized"` |
| 品牌色强化 | `bgMode="colored"`（按 accent 填满 sidebar） |
| 业务页统一 | 用 `AppLayout`，别直接 render SidebarMenu |
