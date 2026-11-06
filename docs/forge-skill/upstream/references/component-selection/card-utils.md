## 何时用

**业务代码里不用**。这些是**扩卡片家族**（比如做一个新业务卡）时的 building block：

```tsx
import { StatCardShell, CardIconChip, CardTrend, cardThemes } from "@forge-ui-official/core";

export function MyCustomCard({ theme = "blue" }) {
  const t = cardThemes[theme];
  return (
    <StatCardShell theme={t}>
      <CardIconChip theme={t}><IconX /></CardIconChip>
      <h4>Metric</h4>
      <CardTrend direction="up" value="+12%" />
    </StatCardShell>
  );
}
```

业务直接用 → `StatCard` / `ProgressStatCard` 等封装好的组件。
