# 活动流

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：ActivityCard、ListGroup。

## 最小可用示例

```tsx
import { ActivityFeed } from "@/components/blocks/activity-feed";

export default function Example() {
  return (<ActivityFeed title="最近活动" events={[{ id: "review", headerText: "订单动态", datetime: "今天 09:30", title: "张三完成订单核对", description: "核对完成", metadata: [] }]} />);
}
```

## ActivityFeed Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| className | 否 | `string \| undefined` |
| color | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").AccentColor \| undefined` |
| subtitle | 否 | `string \| undefined` |
| action | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode` |
| badge | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode` |
| tabs | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").ListGroupTab[] \| undefined` |
| activeTab | 否 | `string \| undefined` |
| onTabChange | 否 | `((value: string) => void) \| undefined` |
| closable | 否 | `boolean \| undefined` |
| onClose | 否 | `(() => void) \| undefined` |
| density | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").CardDensity \| undefined` |
| items | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode` |
| events | 否 | `(Omit<{ icon: import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode; headerText: string; datetime: string; avatar: string; title: string; description: string; metadata: { label: string; value: string \| import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode; }[]; onMenuClick?: () => void; }, "icon" \| "avatar"> & { id: string; icon?: ComponentProps<typeof ActivityCard>["icon"]; avatar?: string; })[] \| undefined` |
