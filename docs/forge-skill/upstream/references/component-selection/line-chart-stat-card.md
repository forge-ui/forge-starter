## 选型

- 有时间序列 / 持续波动的指标（DAU / 流量 / 销售额） → `LineChartStatCard`
- 单值指标 → `StatCard`
- 带百分比进度 → `ProgressStatCard`
- 多数据对比 → `BarChartStatCard`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
