# toast

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/toast.tsx`；core **0.4.7**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## ToastApi (type)

```ts
export interface ToastApi { toast: (options: ToastOptions) => string; dismiss: (id: string) => void; update: (id: string, options: Partial<ToastOptions>) => void }
```

## ToastOptions (type)

```ts
export interface ToastOptions { title: string; description?: string; /** Milliseconds; 0 keeps the notification until dismissed. */ duration?: number; status?: "loading" | "success" | "error"; action?: { label: string; onClick: () => void }; }
```

## ToastProvider (value)

```ts
({ children, motion, locale, stacked }: { children: ReactNode; motion?: MotionPreference; locale?: "zh" | "en"; stacked?: boolean; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `children` | 是 | `ReactNode` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `stacked` | 否 | `boolean \| undefined` |  |

## useToast (value)

```ts
() => ToastApi
```
