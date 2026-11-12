# wallet-goal-card

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/wallet-goal-card.tsx`；core **0.8.0**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## WalletGoalCard (value)

```ts
({ title, date, amount, progress, progressColor, showActions, onEdit, onTopUp, onWithdraw, topUpLabel, withdrawLabel, editLabel, iconBg, icon, }: WalletGoalCardProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `title` | 是 | `string` |  |
| `date` | 是 | `string` |  |
| `amount` | 是 | `string` |  |
| `progress` | 是 | `number` |  |
| `progressColor` | 是 | `"purple" \| "blue" \| "orange" \| "green" \| "yellow" \| "cyan" \| "red"` |  |
| `showActions` | 否 | `boolean \| undefined` |  |
| `onEdit` | 否 | `(() => void) \| undefined` |  |
| `onTopUp` | 否 | `(() => void) \| undefined` |  |
| `onWithdraw` | 否 | `(() => void) \| undefined` |  |
| `topUpLabel` | 否 | `string \| undefined` |  |
| `withdrawLabel` | 否 | `string \| undefined` |  |
| `editLabel` | 否 | `string \| undefined` |  |
| `iconBg` | 否 | `string \| undefined` |  |
| `icon` | 否 | `ReactNode` |  |

## WalletGoalCardProps (type)

```ts
export interface WalletGoalCardProps {
  title: string;
  date: string;
  amount: string;
  progress: number;
  progressColor: "purple" | "green" | "blue" | "red" | "orange" | "yellow" | "cyan";
  showActions?: boolean;
  onEdit?: () => void;
  onTopUp?: () => void;
  onWithdraw?: () => void;
  topUpLabel?: string;
  withdrawLabel?: string;
  editLabel?: string;
  iconBg?: string;
  icon?: ReactNode;
}
```

## 选型建议

目标金额、日期、进度与可选操作用 WalletGoalCard；列表组合用可复制 GoalProgressList，财务特定储蓄外观用 WalletProgressPanel。onEdit/onTopUp/onWithdraw 由业务方实现；不附带资金操作后台。

导入自 `@forge-ui-official/core`；交互示例 `/cases/dashboard-kit`，Blocks 画廊 `/blocks`。源码实现不等于截图验收或 npm 已发布。
