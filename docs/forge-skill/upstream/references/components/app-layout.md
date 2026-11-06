# app-layout

自动生成；请勿编辑 API 部分。来源：`core/src/components/layouts/app-layout.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AppLayout (value)

```ts
({ motion, mode, profilePosition, accent, children, logo, logoText, appName, appIcon, appSubtitle, apps, onAppChange, teamName: legacyTeamName, teamAvatar: legacyTeamAvatar, teamMemberCount, teamSubtitle: legacyTeamSubtitle, menuSectionLabel, favoriteSectionLabel, teams: legacyTeams, menuItems, favoriteItems, menuSections, profile, notifications, messages, language, defaultLanguage, onLanguageChange, searchPlaceholder, topbarLeftMode, topbarAccent, pageTitle, breadcrumbs, pageHeaderVariant, askAi, onBack, primaryAction, secondaryAction, showDatePicker, showKebab, showFavorite, hideHeader, sidebarSlot, sidebarWidth, collapsedSidebarWidth, hideSidebarWidgets, teamLabels, showTeamActions, }: AppLayoutProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `motion` | 否 | `MotionPreference \| undefined` | Motion for the navigation shell and its nested menu branches. |
| `mode` | 否 | `AppLayoutMode \| undefined` |  |
| `profilePosition` | 否 | `AppLayoutProfilePosition \| undefined` |  |
| `accent` | 否 | `AppLayoutAccentColor \| undefined` |  |
| `children` | 是 | `ReactNode` |  |
| `logo` | 否 | `ReactNode` |  |
| `logoText` | 否 | `string \| undefined` |  |
| `appName` | 否 | `string \| undefined` |  |
| `appIcon` | 否 | `string \| undefined` |  |
| `appSubtitle` | 否 | `string \| undefined` |  |
| `apps` | 否 | `AppSwitcherItem[] \| undefined` |  |
| `onAppChange` | 否 | `((app: AppSwitcherItem) => void) \| undefined` | Called on selection; the consumer controls the current application. |
| `teamName` | 否 | `string \| undefined` |  |
| `teamAvatar` | 否 | `string \| undefined` |  |
| `teamMemberCount` | 否 | `number \| undefined` |  |
| `teamSubtitle` | 否 | `string \| undefined` | 自定义 team switcher 下面那行副标题；不传则 fallback 到 `${teamMemberCount} 名成员` |
| `menuSectionLabel` | 否 | `string \| undefined` | 自定义 sidebar 主菜单分组标题 |
| `favoriteSectionLabel` | 否 | `string \| undefined` | 自定义 sidebar 收藏分组标题 |
| `teams` | 否 | `AppSwitcherItem[] \| undefined` |  |
| `menuItems` | 否 | `AppLayoutMenuItem[] \| undefined` | 默认 sidebar 主菜单。如果传了 menuSections 或 sidebarSlot，这个会被忽略 |
| `favoriteItems` | 否 | `AppLayoutMenuItem[] \| undefined` |  |
| `menuSections` | 否 | `AppLayoutMenuSection[] \| undefined` | 按顺序渲染的侧栏分组。传入后忽略旧的菜单项和分组标题；sidebarSlot 优先级更高。 |
| `profile` | 否 | `AppLayoutProfile \| undefined` |  |
| `notifications` | 否 | `number \| undefined` |  |
| `messages` | 否 | `number \| undefined` |  |
| `language` | 否 | `LanguageCode \| undefined` |  |
| `defaultLanguage` | 否 | `LanguageCode \| undefined` |  |
| `onLanguageChange` | 否 | `((language: AppLayoutLanguage) => void) \| undefined` |  |
| `pageHeaderVariant` | 否 | `AppLayoutPageHeaderVariant \| undefined` |  |
| `askAi` | 否 | `AskAiProps \| undefined` | Optional Ask AI conversation drawer for every header variant. |
| `onBack` | 否 | `(() => void) \| undefined` |  |
| `primaryAction` | 否 | `{ label: string; onClick?: () => void; } \| undefined` |  |
| `secondaryAction` | 否 | `{ label: string; onClick?: () => void; } \| undefined` |  |
| `searchPlaceholder` | 否 | `string \| undefined` |  |
| `topbarLeftMode` | 否 | `"search" \| "hamburger" \| undefined` |  |
| `topbarAccent` | 否 | `AppLayoutAccentColor \| undefined` |  |
| `pageTitle` | 否 | `string \| undefined` |  |
| `breadcrumbs` | 否 | `AppLayoutBreadcrumb[] \| undefined` |  |
| `showDatePicker` | 否 | `boolean \| undefined` | 是否在 page header 显示日期选择器（默认：home variant 显示，detail variant 不显示） |
| `showKebab` | 否 | `boolean \| undefined` | 是否在 page header 显示三点菜单（默认 true） |
| `showFavorite` | 否 | `boolean \| undefined` | 是否在 page header 显示收藏操作（默认：home variant 不显示，detail variant 显示） |
| `hideHeader` | 否 | `boolean \| undefined` | 完全隐藏 page header 区（标题 / 按钮 / 边框）。chat / 沉浸式页面用 |
| `sidebarSlot` | 否 | `ReactNode` | 完全自定义 sidebar 主体，优先于 menuSections 和旧的两个菜单分组。 |
| `sidebarWidth` | 否 | `string \| undefined` | Expanded sidebar width. Accepts any CSS length; default keeps the Forge starter density. |
| `collapsedSidebarWidth` | 否 | `string \| undefined` | Collapsed sidebar rail width. Accepts any CSS length; default keeps the Forge starter density. |
| `hideSidebarWidgets` | 否 | `boolean \| undefined` | 隐藏 sidebar 底部那一排 widget icon（语言、日历、通知、消息），profile 卡保留 |
| `teamLabels` | 否 | `TeamSwitcherLabels \| undefined` | 自定义 team switcher 下拉里 invite / settings / createNew 按钮的文案 |
| `showTeamActions` | 否 | `boolean \| undefined` | Team switcher 是否显示邀请 / 设置 / 新建。 false = 仅当前工作区标题 + teams 列表（应用切换器用）。默认 false。 |

## AppLayoutAccentColor (type)

```ts
export type AppLayoutAccentColor = "purple" | "blue" | "black";
```

## AppLayoutBreadcrumb (type)

```ts
export interface AppLayoutBreadcrumb {
  label: string;
  href?: string;
}
```

## AppLayoutLanguage (type)

```ts
export type AppLayoutLanguage = LanguageCode;
```

## AppLayoutMenuItem (type)

```ts
export type AppLayoutMenuItem =
  | (AppLayoutMenuItemBase & {
      href: string;
      children?: AppLayoutMenuItem[];
    })
  | (AppLayoutMenuItemBase & {
      href?: undefined;
      children: AppLayoutMenuItem[];
    });
```

## AppLayoutMenuSection (type)

```ts
export type AppLayoutMenuSection = {
  /** 空字符串或省略时不渲染标题行 */
  label?: string;
  items: AppLayoutMenuItem[];
};
```

## AppLayoutMode (type)

```ts
export type AppLayoutMode = "light" | "dark";
```

## AppLayoutPageHeaderVariant (type)

```ts
export type AppLayoutPageHeaderVariant = "home" | "detail";
```

## AppLayoutProfile (type)

```ts
export interface AppLayoutProfile {
  avatar: string;
  name: string;
  role: string;
}
```

## AppLayoutProfilePosition (type)

```ts
export type AppLayoutProfilePosition = "sidebar" | "topbar";
```

## AppLayoutProps (type)

```ts
export interface AppLayoutProps {
  /** Motion for the navigation shell and its nested menu branches. */
  motion?: MotionPreference;
  mode?: AppLayoutMode;
  profilePosition?: AppLayoutProfilePosition;
  accent?: AppLayoutAccentColor;
  children: ReactNode;
  logo?: ReactNode;
  logoText?: string;
  appName?: string;
  appIcon?: string;
  appSubtitle?: string;
  apps?: AppSwitcherItem[];
  /** Called on selection; the consumer controls the current application. */
  onAppChange?: (app: AppSwitcherItem) => void;
  /** @deprecated Use appName. */
  teamName?: string;
  teamAvatar?: string;
  teamMemberCount?: number;
  /** 自定义 team switcher 下面那行副标题；不传则 fallback 到 `${teamMemberCount} 名成员` */
  teamSubtitle?: string;
  /** 自定义 sidebar 主菜单分组标题 */
  menuSectionLabel?: string;
  /** 自定义 sidebar 收藏分组标题 */
  favoriteSectionLabel?: string;
  teams?: Team[];
  /** 默认 sidebar 主菜单。如果传了 menuSections 或 sidebarSlot，这个会被忽略 */
  menuItems?: AppLayoutMenuItem[];
  favoriteItems?: AppLayoutMenuItem[];
  /** 按顺序渲染的侧栏分组。传入后忽略旧的菜单项和分组标题；sidebarSlot 优先级更高。 */
  menuSections?: AppLayoutMenuSection[];
  profile?: AppLayoutProfile;
  notifications?: number;
  messages?: number;
  language?: AppLayoutLanguage;
  defaultLanguage?: AppLayoutLanguage;
  onLanguageChange?: (language: AppLayoutLanguage) => void;
  pageHeaderVariant?: AppLayoutPageHeaderVariant;
  /** Optional Ask AI conversation drawer for every header variant. */
  askAi?: AskAiProps;
  onBack?: () => void;
  primaryAction?: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
  searchPlaceholder?: string;
  topbarLeftMode?: "search" | "hamburger";
  topbarAccent?: AppLayoutAccentColor;
  pageTitle?: string;
  breadcrumbs?: AppLayoutBreadcrumb[];
  /** 是否在 page header 显示日期选择器（默认：home variant 显示，detail variant 不显示） */
  showDatePicker?: boolean;
  /** 是否在 page header 显示三点菜单（默认 true） */
  showKebab?: boolean;
  /** 是否在 page header 显示收藏操作（默认：home variant 不显示，detail variant 显示） */
  showFavorite?: boolean;
  /** 完全隐藏 page header 区（标题 / 按钮 / 边框）。chat / 沉浸式页面用 */
  hideHeader?: boolean;
  /** 完全自定义 sidebar 主体，优先于 menuSections 和旧的两个菜单分组。 */
  sidebarSlot?: ReactNode;
  /** Expanded sidebar width. Accepts any CSS length; default keeps the Forge starter density. */
  sidebarWidth?: string;
  /** Collapsed sidebar rail width. Accepts any CSS length; default keeps the Forge starter density. */
  collapsedSidebarWidth?: string;
  /** 隐藏 sidebar 底部那一排 widget icon（语言、日历、通知、消息），profile 卡保留 */
  hideSidebarWidgets?: boolean;
  /** 自定义 team switcher 下拉里 invite / settings / createNew 按钮的文案 */
  teamLabels?: TeamSwitcherLabels;
  /**
   * Team switcher 是否显示邀请 / 设置 / 新建。
   * false = 仅当前工作区标题 + teams 列表（应用切换器用）。默认 false。
   */
  showTeamActions?: boolean;
}
```

## 选型建议

| 场景 | 配置 |
|---|---|
| 首页 / Dashboard | `pageHeaderVariant="home"`，无 breadcrumbs，`profilePosition="topbar"` |
| 列表页 | `pageHeaderVariant="home"`，`primaryAction="New"` |
| 详情页 | `pageHeaderVariant="detail"` + `onBack` + `breadcrumbs` |
| 深色品牌 | `mode="dark"` 或 `accent="black"` |
