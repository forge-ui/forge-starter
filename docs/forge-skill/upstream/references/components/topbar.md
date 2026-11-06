# topbar

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/topbar.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## TopBar (value)

```ts
({ value, color, className, }: { value?: number; color?: TopBarColor; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 否 | `number \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "green" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## TopBarColor (type)

```ts
export type TopBarColor = keyof typeof topbarColors;
```

## 选型

- 路由切换 loading → 配 next/navigation 的 loading hook
- 下载 / 大文件进度 → 优先用 `ProgressBar`（有 label），顶部 `TopBar` 只做粗略全局提示
- 不要混用 `TopBar` 和 `ProgressBar` 做同一任务
