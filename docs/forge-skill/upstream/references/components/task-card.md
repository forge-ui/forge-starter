# task-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/task-card.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TaskCard (value)

```ts
({ title, description, labelText, labelColor, progress, progressColor, locale, progressLabel, avatars, overflowCount, date, onMenuClick, width, className, }: { title: string; description?: string; labelText?: string; labelColor?: TaskCardColor; progress?: number; progressColor?: TaskCardColor; locale?: "zh" | "en"; progressLabel?: string; avatars?: string[]; overflowCount?: number; date?: string; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `description` | 否 | `string \| undefined` |  |
| `labelText` | 否 | `string \| undefined` |  |
| `labelColor` | 否 | `TaskCardColor \| undefined` |  |
| `progress` | 否 | `number \| undefined` |  |
| `progressColor` | 否 | `TaskCardColor \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `progressLabel` | 否 | `string \| undefined` |  |
| `avatars` | 否 | `string[] \| undefined` |  |
| `overflowCount` | 否 | `number \| undefined` |  |
| `date` | 否 | `string \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## TaskCardColor (type)

```ts
export type TaskCardColor =
  | "purple" | "blue" | "green" | "red" | "yellow" | "cyan" | "gray";
```

## 选型

| 场景 | 选 |
|---|---|
| 看板卡 / Todo 项 | `TaskCard` |
| 有 logo 的项目卡 | `ProjectCard` |
| 活动记录卡 | `ActivityCard` |
