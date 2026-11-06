# project-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/project-card.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProjectCard (value)

```ts
({ logo, title, description, labelText, labelColor, progress, progressColor, avatars, overflowCount, date, onMenuClick, width, className, }: { logo?: string; title: string; description?: string; labelText?: string; labelColor?: ProjectCardColor; progress?: number; progressColor?: ProjectCardColor; avatars?: string[]; overflowCount?: number; date?: string; onMenuClick?: () => void; width?: CardWidth; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `logo` | 否 | `string \| undefined` |  |
| `title` | 是 | `string` |  |
| `description` | 否 | `string \| undefined` |  |
| `labelText` | 否 | `string \| undefined` |  |
| `labelColor` | 否 | `ProjectCardColor \| undefined` |  |
| `progress` | 否 | `number \| undefined` |  |
| `progressColor` | 否 | `ProjectCardColor \| undefined` |  |
| `avatars` | 否 | `string[] \| undefined` |  |
| `overflowCount` | 否 | `number \| undefined` |  |
| `date` | 否 | `string \| undefined` |  |
| `onMenuClick` | 否 | `(() => void) \| undefined` |  |
| `width` | 否 | `CardWidth \| undefined` | Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. |
| `className` | 否 | `string \| undefined` |  |

## ProjectCardColor (type)

```ts
export type ProjectCardColor =
  | "purple" | "blue" | "green" | "red" | "yellow" | "cyan" | "gray";
```

## 选型

- 项目 / 看板卡 → `ProjectCard`
- 单任务 → `TaskCard`
- 活动流 → `ActivityCard`
