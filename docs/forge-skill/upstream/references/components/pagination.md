# pagination

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/pagination.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## Pagination (value)

```ts
({ totalPages, currentPage, onPageChange, color, className, locale, motion, }: { totalPages: number; currentPage: number; onPageChange?: (page: number) => void; color?: PaginationColor; className?: string; locale?: "zh" | "en"; motion?: MotionPreference; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `totalPages` | 是 | `number` |  |
| `currentPage` | 是 | `number` |  |
| `onPageChange` | 否 | `((page: number) => void) \| undefined` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` | 无障碍标签的语言，默认中文。 |
| `motion` | 否 | `MotionPreference \| undefined` | auto 跟随系统的减弱动效设置。 |

## PaginationColor (type)

```ts
export type PaginationColor = PageDotColor;
```

## 选型

- 后台列表底部翻页 — 配合 `DataTable` 使用
- 深色底用 `color="black"` 或 `"blue"`
