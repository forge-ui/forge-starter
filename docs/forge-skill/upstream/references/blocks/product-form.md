# 分组表单

分类：表单。字段较多的录入页：同一张卡片里按基本信息、价格库存、图片、物流上架分组，每行三列等宽、单位写在输入框尾部，底部固定操作栏带校验结果与保存状态。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、MediaUpload、PageTitleToolbar、RadioWithLabel、SelectOption、TextArea、TextField。

## 最小可用示例

```tsx
import { ProductForm } from "@/components/blocks/product-form";

export default function Example() {
  return (<ProductForm onSubmit={(draft, mode) => console.log(mode, draft.name)} />);
}
```

## ProductForm Props

| Prop | 必填 | Type |
|---|---|---|
| initial | 否 | `ProductDraft \| undefined` |
| onSubmit | 否 | `((draft: ProductDraft, mode: "draft" \| "publish") => void) \| undefined` |
| className | 否 | `string \| undefined` |
