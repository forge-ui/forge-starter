# page-dot

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/page-dot.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## PageDot (value)

```ts
({ children, color, active, onClick, className, }: { children: ReactNode; color?: PageDotColor; active?: boolean; onClick?: () => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `active` | 否 | `boolean \| undefined` |  |
| `onClick` | 否 | `(() => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## PageDotColor (type)

```ts
export type PageDotColor = keyof typeof activeColors;
```

## 选型

- 业务里用 `<Pagination>`，别自己拼 PageDot
- 自定义轮播指示器、数字导航时才直接用 PageDot
