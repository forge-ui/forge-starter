# 运行时管理

分类：AI 与智能体。自主智能体可用的执行引擎：类型、在线状态、版本与最后检测时间、连接地址，支持搜索、单个检查与探测本机运行时。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、DataTable、PageTitleToolbar、StatusBadge、TextField。

## 最小可用示例

```tsx
import { RuntimeList } from "@/components/blocks/runtime-list";

export default function Example() {
  return (<RuntimeList />);
}
```

## RuntimeList Props

| Prop | 必填 | Type |
|---|---|---|
| runtimes | 否 | `AgentRuntime[] \| undefined` |
| defaultRuntimeId | 否 | `string \| undefined` |
| className | 否 | `string \| undefined` |
