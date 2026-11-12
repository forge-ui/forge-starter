# 文件管理

分类：协作与项目。按类型筛选的文件夹与文件卡片墙，支持搜索、多选、上传与删除确认。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CellActions、Checkbox、ConfirmationDialog、FileTypeIcon、Panel、PlusIcon、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { FileManager } from "@/components/blocks/file-manager";

export default function Example() {
  return (<FileManager onOpen={file => console.log(file.name)} />);
}
```

## FileManager Props

| Prop | 必填 | Type |
|---|---|---|
| files | 否 | `FileEntry[] \| undefined` |
| onUpload | 否 | `(() => void) \| undefined` |
| onOpen | 否 | `((file: FileEntry) => void) \| undefined` |
| onDelete | 否 | `((file: FileEntry) => void) \| undefined` |
| className | 否 | `string \| undefined` |
