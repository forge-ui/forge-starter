## 选型

- 离散周期对比（周销售 / 日访问） → `BarChartStatCard`
- 连续趋势 → `LineChartStatCard`
- 完成度占比 → `WheelChartStatCard`
- 多维图表 → 用 `charts/` 下的 `BarChart`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
