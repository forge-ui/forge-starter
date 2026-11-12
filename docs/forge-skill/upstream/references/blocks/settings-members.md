# 成员与团队

分类：设置。席位与管理员概况、按角色筛选的成员表、行内改角色、批量移除与邀请成员。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、ButtonGroup、CellImageText、DataTable、Modal、Panel、PlusIcon、ProgressBar、SelectOption、TabBar、TextField、ToolbarSearchInput、cn。

## 最小可用示例

```tsx
import { SettingsMembers } from "@/components/blocks/settings-members";

export default function Example() {
  return (<SettingsMembers seats={10} onInvite={(email, role) => console.log(email, role)} />);
}
```

## SettingsMembers Props

| Prop | 必填 | Type |
|---|---|---|
| members | 否 | `WorkspaceMember[] \| undefined` |
| seats | 否 | `number \| undefined` |
| onInvite | 否 | `((email: string, role: MemberRole) => void) \| undefined` |
| className | 否 | `string \| undefined` |
