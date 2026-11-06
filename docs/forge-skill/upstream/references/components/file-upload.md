# file-upload

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/forms/file-upload.tsx`；core **0.6.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## FileCard (value)

```ts
({ file, onRemove, onRetry, locale, color, className, }: { file: FileItem; locale?: "zh" | "en"; color?: FileUploadColor; onRemove?: (id: string) => void; onRetry?: (id: string) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `file` | 是 | `FileItem` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `onRemove` | 否 | `((id: string) => void) \| undefined` |  |
| `onRetry` | 否 | `((id: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FileItem (type)

```ts
export interface FileItem {
  id: string;
  name: string;
  size: string;
  state?: FileState;
  /** Upload progress supplied by the caller, from 0 to 100. */
  progress?: number;
  uploadedBytes?: number;
  totalBytes?: number;
}
```

## FileState (type)

```ts
export type FileState = "uploaded" | "success" | "uploading" | "error";
```

## FileTypeIcon (value)

```ts
({ fileName, dim, className }: { fileName: string; dim?: boolean; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `fileName` | 是 | `string` |  |
| `dim` | 否 | `boolean \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FileUpload (value)

```ts
({ files, label, buttonLabel, locale, color, onUpload, onRemove, onRetry, className, }: { files?: FileItem[]; label?: string; buttonLabel?: string; locale?: "zh" | "en"; color?: FileUploadColor; onUpload?: (files: FileList) => void; onRemove?: (id: string) => void; onRetry?: (id: string) => void; className?: string; }) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `files` | 否 | `FileItem[] \| undefined` |  |
| `label` | 否 | `string \| undefined` |  |
| `buttonLabel` | 否 | `string \| undefined` |  |
| `locale` | 否 | `"zh" \| "en" \| undefined` |  |
| `color` | 否 | `AccentColor \| undefined` |  |
| `onUpload` | 否 | `((files: FileList) => void) \| undefined` |  |
| `onRemove` | 否 | `((id: string) => void) \| undefined` |  |
| `onRetry` | 否 | `((id: string) => void) \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## FileUploadColor (type)

```ts
export type FileUploadColor = AccentColor;
```
