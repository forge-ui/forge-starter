## 选型

- 单指标完成度展示（使用率 / 满意度 / 目标达成） → `WheelChartStatCard`
- 线性进度 → `ProgressStatCard`
- 多指标对比环 → `DonutChart`（`charts/`）

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
