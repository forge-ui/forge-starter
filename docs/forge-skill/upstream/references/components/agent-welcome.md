# agent-welcome

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-welcome.tsx`；core **0.11.5**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentWelcome (value)

```ts
({ title, description, icon, footer, size, className }: AgentWelcomeProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `ReactNode` |  |
| `description` | 否 | `ReactNode` |  |
| `icon` | 否 | `ReactNode` |  |
| `footer` | 否 | `ReactNode` | Anything under the greeting, e.g. recent conversations. Starter tasks belong in ChatInputBar's quickActions. |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentWelcomeProps (type)

```ts
export type AgentWelcomeProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Anything under the greeting, e.g. recent conversations. Starter tasks belong in ChatInputBar's quickActions. */
  footer?: ReactNode;
  size?: "md" | "sm";
  className?: string;
};
```

## 选型

- 空对话时介绍智能体 → `AgentWelcome`，起手任务放在输入框的 `quickActions`

不要用：
- 有内容的对话 → 不显示
