# page-header

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/page-header.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PageHeader (value)

```ts
(props: PageHeaderProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `variant` | 否 | `PageHeaderVariant \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `askAi` | 否 | `AskAiProps \| undefined` | Optional AI conversation drawer; the application supplies the response handler. |
| `leftMode` | 否 | `"search" \| "hamburger" \| undefined` | "search" renders search input (default), "hamburger" renders compact menu button. |
| `onHamburgerClick` | 否 | `(() => void) \| undefined` |  |
| `showMobileMenuButton` | 否 | `boolean \| undefined` | Show a mobile-only menu button before the search/title content. |
| `hamburgerAriaLabel` | 否 | `string \| undefined` |  |
| `hamburgerExpanded` | 否 | `boolean \| undefined` |  |
| `hamburgerControls` | 否 | `string \| undefined` |  |
| `searchPlaceholder` | 否 | `string \| undefined` |  |
| `onSearch` | 否 | `((value: string) => void) \| undefined` |  |
| `showCalendar` | 否 | `boolean \| undefined` |  |
| `onCalendarClick` | 否 | `(() => void) \| undefined` |  |
| `calendarExpanded` | 否 | `boolean \| undefined` |  |
| `calendarButtonClassName` | 否 | `string \| undefined` |  |
| `notifications` | 否 | `number \| undefined` |  |
| `onNotificationsClick` | 否 | `(() => void) \| undefined` |  |
| `notificationsExpanded` | 否 | `boolean \| undefined` |  |
| `notificationsButtonClassName` | 否 | `string \| undefined` |  |
| `messages` | 否 | `number \| undefined` |  |
| `onMessagesClick` | 否 | `(() => void) \| undefined` |  |
| `messagesExpanded` | 否 | `boolean \| undefined` |  |
| `messagesButtonClassName` | 否 | `string \| undefined` |  |
| `onLanguageClick` | 否 | `(() => void) \| undefined` |  |
| `languageExpanded` | 否 | `boolean \| undefined` |  |
| `languageButtonClassName` | 否 | `string \| undefined` |  |
| `languageFlag` | 否 | `ReactNode` |  |
| `showAddButton` | 否 | `boolean \| undefined` |  |
| `onAddClick` | 否 | `(() => void) \| undefined` |  |
| `showProfile` | 否 | `boolean \| undefined` |  |
| `profile` | 否 | `PageHeaderProfile \| undefined` |  |
| `onProfileClick` | 否 | `(() => void) \| undefined` |  |
| `profileExpanded` | 否 | `boolean \| undefined` |  |
| `profileButtonClassName` | 否 | `string \| undefined` |  |
| `profileNameClassName` | 否 | `string \| undefined` |  |
| `profileRoleClassName` | 否 | `string \| undefined` |  |
| `profileChevronClassName` | 否 | `string \| undefined` |  |
| `title` | 否 | `string \| undefined` |  |
| `showBackButton` | 否 | `boolean \| undefined` |  |
| `onBack` | 否 | `(() => void) \| undefined` |  |
| `titleAvatar` | 否 | `string \| undefined` |  |
| `showDatePicker` | 否 | `boolean \| undefined` |  |
| `datePickerLabel` | 否 | `string \| undefined` |  |
| `onDatePickerClick` | 否 | `(() => void) \| undefined` |  |
| `showFilters` | 否 | `boolean \| undefined` |  |
| `filtersLabel` | 否 | `string \| undefined` |  |
| `onFiltersClick` | 否 | `(() => void) \| undefined` |  |
| `showKebab` | 否 | `boolean \| undefined` |  |
| `onKebabClick` | 否 | `(() => void) \| undefined` |  |
| `showFavorite` | 否 | `boolean \| undefined` |  |
| `onFavoriteClick` | 否 | `(() => void) \| undefined` |  |
| `secondaryAction` | 否 | `PageHeaderAction \| undefined` |  |
| `primaryAction` | 否 | `PageHeaderAction \| undefined` |  |
| `actions` | 否 | `ReactNode` |  |
| `children` | 否 | `ReactNode` |  |

## PageHeaderAction (type)

```ts
export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
}
```

## PageHeaderColor (type)

```ts
export type PageHeaderColor = AccentColor;
```

## PageHeaderProfile (type)

```ts
export interface PageHeaderProfile {
  name: string;
  role: string;
  avatar: string;
}
```

## PageHeaderProps (type)

```ts
export interface PageHeaderProps {
  variant?: PageHeaderVariant;
  color?: PageHeaderColor;
  className?: string;

  /** Optional AI conversation drawer; the application supplies the response handler. */
  askAi?: AskAiProps;

  // --- Search variant props ---
  /** "search" renders search input (default), "hamburger" renders compact menu button. */
  leftMode?: "search" | "hamburger";
  onHamburgerClick?: () => void;
  /** Show a mobile-only menu button before the search/title content. */
  showMobileMenuButton?: boolean;
  hamburgerAriaLabel?: string;
  hamburgerExpanded?: boolean;
  hamburgerControls?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showCalendar?: boolean;
  onCalendarClick?: () => void;
  calendarExpanded?: boolean;
  calendarButtonClassName?: string;
  notifications?: number;
  onNotificationsClick?: () => void;
  notificationsExpanded?: boolean;
  notificationsButtonClassName?: string;
  messages?: number;
  onMessagesClick?: () => void;
  messagesExpanded?: boolean;
  messagesButtonClassName?: string;
  onLanguageClick?: () => void;
  languageExpanded?: boolean;
  languageButtonClassName?: string;
  languageFlag?: ReactNode;
  showAddButton?: boolean;
  onAddClick?: () => void;
  showProfile?: boolean;
  profile?: PageHeaderProfile;
  onProfileClick?: () => void;
  profileExpanded?: boolean;
  profileButtonClassName?: string;
  profileNameClassName?: string;
  profileRoleClassName?: string;
  profileChevronClassName?: string;

  // --- Title variant props ---
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  titleAvatar?: string;
  showDatePicker?: boolean;
  datePickerLabel?: string;
  onDatePickerClick?: () => void;
  showFilters?: boolean;
  filtersLabel?: string;
  onFiltersClick?: () => void;
  showKebab?: boolean;
  onKebabClick?: () => void;
  showFavorite?: boolean;
  onFavoriteClick?: () => void;
  secondaryAction?: PageHeaderAction;
  primaryAction?: PageHeaderAction;
  actions?: ReactNode;
  children?: ReactNode;
}
```

## PageHeaderVariant (type)

```ts
export type PageHeaderVariant = "search" | "title";
```

## 选型

| 场景 | variant |
|---|---|
| 首页 / 列表页（需要搜索 + 通知区） | `search` |
| 详情页（有返回 + 单一主 action） | `title` |
| 业务页统一布局 | 用 `AppLayout`，不直接 render PageHeader |
