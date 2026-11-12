# 集成目录

分类：设置。按分类浏览可连接的应用，支持搜索、连接中状态与断开连接。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Panel、StatusBadge、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { IntegrationsDirectory } from "@/components/blocks/integrations-directory";

export default function Example() {
  return (<IntegrationsDirectory onConnect={app => console.log(app.name)} />);
}
```

## IntegrationsDirectory Props

| Prop | 必填 | Type |
|---|---|---|
| integrations | 否 | `Integration[] \| undefined` |
| onConnect | 否 | `((integration: Integration) => Promise<void> \| void) \| undefined` |
| className | 否 | `string \| undefined` |
