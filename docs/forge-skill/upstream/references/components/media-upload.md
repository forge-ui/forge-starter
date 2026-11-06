# media-upload

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/media-upload.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## MediaItem (type)

```ts
export interface MediaItem {
  id: string;
  src: string;
  state?: "success" | "uploading" | "error";
  progress?: number;
}
```

## MediaUpload (value)

```ts
({ items, label, buttonLabel, message, color, onUpload, onRemove, className, }: { items?: MediaItem[]; label?: string; buttonLabel?: string; message?: string; color?: MediaUploadColor; onUpload?: (files: FileList) => void; onRemove?: (id: string) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `items` | 否 | `MediaItem[] \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `buttonLabel` | 否 | `string \| undefined` |  |
| `message` | 否 | `string \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `onUpload` | 否 | `((files: FileList) => void) \| undefined` |  |
| `onRemove` | 否 | `((id: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## MediaUploadColor (type)

```ts
export type MediaUploadColor = FormAccentColor;
```

## ProfileImgUpload (value)

```ts
({ src, label, linkLabel, color, onUpload, className, }: { src?: string; label?: string; linkLabel?: string; color?: MediaUploadColor; onUpload?: (files: FileList) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `src` | 否 | `string \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `linkLabel` | 否 | `string \| undefined` |  |
| `color` | 否 | `FormAccentColor \| undefined` |  |
| `onUpload` | 否 | `((files: FileList) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |
