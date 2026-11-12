# image-grid

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/image-grid.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ImageGrid (value)

```ts
({ images, size, overflowCount, overflowClassName, className, }: { images: string[]; size?: ImageGridSize; overflowCount?: number; overflowClassName?: string; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `images` | 是 | `string[]` |  |
| `size` | 否 | `ImageGridSize \| undefined` |  |
| `overflowCount` | 否 | `number \| undefined` |  |
| `overflowClassName` | 否 | `string \| undefined` | Customize the +N overflow chip background & text color. Default: Forge blue. |
| `className` | 否 | `string \| undefined` |  |

## ImageGridSize (type)

```ts
export type ImageGridSize = "sm" | "md" | "lg";
```

## 选型建议

<!-- 待补：什么场景用这个 -->
