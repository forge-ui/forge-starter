# user-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/user-card.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## UserCard (value)

```ts
({ avatar, initials, initialsColor, name, badge, subtitle, stats, checked, onMenuClick, width, className, }: { avatar?: string; initials?: string; initialsColor?: "purple" | "blue" | "green" | "orange"; name: string; badge?: ReactNode; subtitle?: ReactNode; stats?: { label: string; value: string; }[]; checked?: boolean; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `avatar` | 否 | `string \| undefined` |  |
| `initials` | 否 | `string \| undefined` |  |
| `initialsColor` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| undefined` |  |
| `name` | 是 | `string` |  |
| `badge` | 否 | `ReactNode` |  |
| `subtitle` | 否 | `ReactNode` |  |
| `stats` | 否 | `{ label: string; value: string; }[] \| undefined` |  |
| `checked` | 否 | `boolean \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## 选型

- 团队成员网格 / 选人 → `UserCard`
- 水平用户行（如评论头像） → `ContactItem`
- Profile 下拉菜单项 → `ProfileCard`
