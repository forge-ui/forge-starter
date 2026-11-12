# 提示词评测

分类：AI 与智能体。按版本对比通过率、得分、延迟与成本，展示提示词改动和可筛选的测试用例结果。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、DataTable、Panel、SmoothLineChart、StatusBadge、cn。

## 最小可用示例

```tsx
import { PromptEvals } from "@/components/blocks/prompt-evals";

export default function Example() {
  return (<PromptEvals onRun={() => {}} />);
}
```

## PromptEvals Props

| Prop | 必填 | Type |
|---|---|---|
| evals | 否 | `PromptEvalsData \| undefined` |
| onRun | 否 | `(() => void) \| undefined` |
| className | 否 | `string \| undefined` |
