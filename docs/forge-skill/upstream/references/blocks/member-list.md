# 成员列表

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.6.0；组件：ListGroup、UserCard。

## 最小可用示例

```tsx
import { MemberList } from "@/components/blocks/member-list";

export default function Example() {
  return (<MemberList title="成员" members={[{ id: "zhang", name: "张三", initials: "张", subtitle: "负责人" }]} />);
}
```

## MemberList Props

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
| members | 否 | `({ avatar?: string; initials?: string; initialsColor?: "purple" \| "blue" \| "green" \| "orange"; name: string; badge?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode; subtitle?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/node_modules/.pnpm/@types+react@19.2.14/node_modules/@types/react/index").ReactNode; stats?: { label: string; value: string; }[]; checked?: boolean; onMenuClick?: () => void; width?: import("/Users/hesong/Documents/forge-worktrees/forge-templates/core/src/index").CardWidth; className?: string; } & { id: string; })[] \| undefined` |
