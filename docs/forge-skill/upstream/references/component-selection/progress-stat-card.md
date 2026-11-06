## 选型

- 有百分比的指标（完成率 / 使用率 / 容量） → `ProgressStatCard`
- 纯数字指标 → `StatCard`
- 带小图 sparkline 的 → `LineChartStatCard`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
