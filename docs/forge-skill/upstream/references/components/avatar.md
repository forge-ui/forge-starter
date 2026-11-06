# avatar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/avatar.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Avatar (value)

```ts
({ src, initials, size, color, alt, online, }: { src?: string; initials?: string; size?: AvatarSize; color?: AvatarInitialColor; alt?: string; online?: boolean; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `src` | 否 | `string \| undefined` |  |
| `initials` | 否 | `string \| undefined` |  |
| `size` | 否 | `"lg" \| "md" \| "sm" \| "xs" \| "2xl" \| "xl" \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| undefined` |  |
| `alt` | 否 | `string \| undefined` |  |
| `online` | 否 | `boolean \| undefined` |  |

## AvatarGroup (value)

```ts
({ children, overflowCount, }: { children: ReactNode; overflowCount?: number; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `overflowCount` | 否 | `number \| undefined` |  |

## AvatarInitialColor (type)

```ts
export type AvatarInitialColor = keyof typeof avatarInitialColors;
```

## AvatarSize (type)

```ts
export type AvatarSize = keyof typeof avatarSizes;
```

## 选型

- 用户列表 / 评论 / 顶部 profile → `Avatar` `md` 或 `sm`
- 项目协作者多人堆叠 → `AvatarGroup`
- Hero 大头像展示 → `xl` / `2xl`
