# 排行列表卡

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：ChartListItem、ListGroup、cn。

## 最小可用示例

```tsx
import { RankingList } from "@/components/blocks/ranking-list";

export default function Example() {
  return (<RankingList title="商品排行" entries={[{ id: "keyboard", title: "机械键盘", subtitle: "192 件", value: "¥24,500", avatar: "KB" }, { id: "mouse", title: "无线鼠标", subtitle: "160 件", value: "¥12,500" }]} />);
}
```

## RankingList Props

| Prop | 必填 | Type |
|---|---|---|
| title | 是 | `string` |
| className | 否 | `string \| undefined` |
| color | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").AccentColor \| undefined` |
| subtitle | 否 | `string \| undefined` |
| action | 否 | `ReactNode` |
| badge | 否 | `ReactNode` |
| tabs | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").ListGroupTab[] \| undefined` |
| activeTab | 否 | `string \| undefined` |
| onTabChange | 否 | `((value: string) => void) \| undefined` |
| closable | 否 | `boolean \| undefined` |
| onClose | 否 | `(() => void) \| undefined` |
| density | 否 | `import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").CardDensity \| undefined` |
| items | 否 | `ReactNode` |
| entries | 否 | `{ id: string; title: string; subtitle?: string; value: string; icon?: ComponentProps<typeof ChartListItem>["icon"]; accent?: ComponentProps<typeof ChartListItem>["accent"]; avatar?: string; }[] \| undefined` |
| variant | 否 | `"plain" \| "template" \| undefined` |
