# profile-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/profile-card.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ProfileCard (value)

```ts
({ avatar, name, subtitle, state, accent, surface, className, onClick, }: { avatar: string; name: string; subtitle?: string; state?: ProfileCardState; accent?: AccentColor; surface?: ProfileCardSurface; className?: string; onClick?: () => void; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `avatar` | 是 | `string` |  |
| `name` | 是 | `string` |  |
| `subtitle` | 否 | `string \| undefined` |  |
| `state` | 否 | `ProfileCardState \| undefined` |  |
| `accent` | 否 | `AccentColor \| undefined` |  |
| `surface` | 否 | `ProfileCardSurface \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |

## ProfileCardState (type)

```ts
export type ProfileCardState = "idle" | "hover" | "selected";
```

## ProfileCardSurface (type)

```ts
export type ProfileCardSurface = "default" | "onColoredBg";
```

## 选型

- sidebar 底部 profile → `ProfileCard surface="default"`
- 彩色 sidebar 内 → `ProfileCard surface="onColoredBg"`
- 深度用户卡（大头像 + stats） → `UserCard`
- 评论 / 提及用户 → `ContactItem`
