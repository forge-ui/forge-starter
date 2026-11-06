# breadcrumbs

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/breadcrumbs.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## BreadcrumbColor (type)

```ts
export type BreadcrumbColor = keyof typeof breadcrumbColors;
```

## BreadcrumbItem (type)

```ts
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}
```

## Breadcrumbs (value)

```ts
({ items, color, className, ariaLabel, }: { items: BreadcrumbItem[]; color?: BreadcrumbColor; className?: string; ariaLabel?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 是 | `BreadcrumbItem[]` |  |
| `color` | 否 | `"purple" \| "blue" \| "black" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
| `ariaLabel` | 否 | `string \| undefined` |  |

## 选型

- 详情页顶部标识路径 — 配合 `<DocHeader>` 或 `<PageHeader>`
- 三级以上路径推荐自动中间截断（业务自己处理）
