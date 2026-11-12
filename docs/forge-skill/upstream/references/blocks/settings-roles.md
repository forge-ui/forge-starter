# 角色与权限

分类：设置。左侧角色列表，右侧按模块分组的菜单权限勾选树，支持整组勾选与撤销保存。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Button、Checkbox、Panel、PlusIcon、StatusBadge、cn。

## 最小可用示例

```tsx
import { SettingsRoles } from "@/components/blocks/settings-roles";

export default function Example() {
  return (<SettingsRoles onSave={role => console.log(role.permissions)} />);
}
```

## SettingsRoles Props

| Prop | 必填 | Type |
|---|---|---|
| tree | 否 | `PermissionNode[] \| undefined` |
| roles | 否 | `WorkspaceRole[] \| undefined` |
| onSave | 否 | `((role: WorkspaceRole) => void) \| undefined` |
| className | 否 | `string \| undefined` |
