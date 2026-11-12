# 消息渠道

分类：AI 与智能体。把智能体接入微信、企业微信、飞书、钉钉和 QQ：渠道入口、智能体与渠道的连接卡片、连接状态，以及填写凭据和绑定智能体的连接弹窗。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Breadcrumbs、Button、CheckboxWithLabel、ConfirmationDialog、Grid、KebabMenu、Modal、PageTitleToolbar、PlusIcon、RadioWithLabel、SelectOption、StatusBadge、SurfaceCard、TextField、Toolbar、ToolbarSearchInput、ToolbarSelectDropdown。

## 最小可用示例

```tsx
import { MessageChannels } from "@/components/blocks/message-channels";

export default function Example() {
  return (<MessageChannels />);
}
```

## MessageChannels Props

| Prop | 必填 | Type |
|---|---|---|
| connections | 否 | `ChannelConnection[] \| undefined` |
| applications | 否 | `ChannelAgentOption[] \| undefined` |
| autonomousAgents | 否 | `ChannelAgentOption[] \| undefined` |
| className | 否 | `string \| undefined` |
