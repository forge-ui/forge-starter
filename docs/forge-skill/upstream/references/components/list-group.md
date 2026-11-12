# list-group

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/list-group.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ListGroup (value)

```ts
({ title, subtitle, color, badge, items, action, tabs, activeTab, onTabChange, closable, onClose, density, className, }: { title: string; subtitle?: string; color?: AccentColor; badge?: ReactNode; items: ReactNode; action?: ReactNode; tabs?: ListGroupTab[]; activeTab?: string; onTabChange?: (value: string) => void; closable?: boolean; onClose?: () => void; density?: CardDensity; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `badge` | 否 | `ReactNode` |  |
| `items` | 是 | `ReactNode` |  |
| `action` | 否 | `ReactNode` |  |
| `tabs` | 否 | `ListGroupTab[] \| undefined` |  |
| `activeTab` | 否 | `string \| undefined` |  |
| `onTabChange` | 否 | `((value: string) => void) \| undefined` |  |
| `closable` | 否 | `boolean \| undefined` |  |
| `onClose` | 否 | `(() => void) \| undefined` |  |
| `density` | 否 | `CardDensity \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ListGroupProps (type)

```ts
export type ListGroupProps = Parameters<typeof ListGroup>[0];
```

## ListGroupTab (type)

```ts
export type ListGroupTab = { value: string; label: string };
```

## 选型

- 聚合卡片展示列表数据 → `ListGroup`
- 纯列表无卡外框 → 直接用一串 `ListItem`
- 带 tab 切换数据源 → `tabs` + `activeTab`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
