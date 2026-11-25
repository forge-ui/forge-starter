# agent-governance

自动生成；请勿编辑 API 部分。来源：`core/src/components/ui/agent/agent-governance.tsx`；core **0.11.6**。
默认值和运行行为以源码初始化为准；类型表不推测默认值。

## AgentCheckpoints (value)

```ts
({ checkpoints, currentId, onRewind, title, locale, size, className }: AgentCheckpointsProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `checkpoints` | 是 | `Checkpoint[]` |  |
| `currentId` | 否 | `string \| undefined` |  |
| `onRewind` | 否 | `((id: string) => void) \| undefined` | Go back to this point; the next attempt branches from it. |
| `title` | 否 | `ReactNode` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AgentCheckpointsProps (type)

```ts
export type AgentCheckpointsProps = {
  checkpoints: Checkpoint[];
  currentId?: string;
  /** Go back to this point; the next attempt branches from it. */
  onRewind?: (id: string) => void;
  title?: ReactNode;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## AutonomyAction (type)

```ts
export type AutonomyAction = { id: string; label: string; risk: "low" | "medium" | "high" };
```

## AutonomyLevel (type)

```ts
export type AutonomyLevel = "ask" | "balanced" | "auto";
```

## AutonomySelector (value)

```ts
({ value, onChange, actions, title, locale, size, className }: AutonomySelectorProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `value` | 是 | `AutonomyLevel` |  |
| `onChange` | 是 | `(value: AutonomyLevel) => void` |  |
| `actions` | 否 | `AutonomyAction[] \| undefined` | Example actions, sorted by what this level lets the agent do on its own. |
| `title` | 否 | `ReactNode` |  |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## AutonomySelectorProps (type)

```ts
export type AutonomySelectorProps = {
  value: AutonomyLevel;
  onChange: (value: AutonomyLevel) => void;
  /** Example actions, sorted by what this level lets the agent do on its own. */
  actions?: AutonomyAction[];
  title?: ReactNode;
  locale?: AgentLocale;
  size?: "md" | "sm";
  className?: string;
};
```

## ChangeLedger (value)

```ts
({ entries, title, onUndo, locale, motion, size, className }: ChangeLedgerProps) => JSX.Element
```

| 属性 | 必填 | 类型 | 说明 |
|---|---|---|---|
| `entries` | 是 | `LedgerEntry[]` |  |
| `title` | 否 | `ReactNode` |  |
| `onUndo` | 否 | `((id: string, alsoUndone: string[]) => void) \| undefined` | Undo one entry; entries that depend on it are listed in the confirmation and undone with it. |
| `locale` | 否 | `AgentLocale \| undefined` |  |
| `motion` | 否 | `MotionPreference \| undefined` |  |
| `size` | 否 | `"md" \| "sm" \| undefined` |  |
| `className` | 否 | `string \| undefined` |  |

## ChangeLedgerProps (type)

```ts
export type ChangeLedgerProps = {
  entries: LedgerEntry[];
  title?: ReactNode;
  /** Undo one entry; entries that depend on it are listed in the confirmation and undone with it. */
  onUndo?: (id: string, alsoUndone: string[]) => void;
  locale?: AgentLocale;
  motion?: MotionPreference;
  size?: "md" | "sm";
  className?: string;
};
```

## Checkpoint (type)

```ts
export type Checkpoint = {
  id: string;
  label: string;
  detail?: string;
  time?: string;
  /** An attempt the run moved away from after a rewind; shown faded beside the line. */
  abandoned?: boolean;
};
```

## LedgerEntry (type)

```ts
export type LedgerEntry = {
  id: string;
  /** What changed, e.g. "张三的角色". */
  title: string;
  /** Where, e.g. "账号管理" or a record number. */
  target?: string;
  fields?: LedgerField[];
  time?: string;
  /** Who made it, e.g. the agent's name. */
  actor?: string;
  status?: "applied" | "undone" | "irreversible";
  /** Entries this one builds on; undoing those undoes this one too. */
  dependsOn?: string[];
};
```

## LedgerField (type)

```ts
export type LedgerField = { label: string; before?: string; after: string };
```

## 选型

- 智能体改过的数据和撤销 → `ChangeLedger`
- 回到某一步重来 → `AgentCheckpoints`
- 智能体能自己做多少 → `AutonomySelector`

不要用：
- 单次确认 → `Approval`
