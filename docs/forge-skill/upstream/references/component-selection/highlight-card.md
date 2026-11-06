## 选型

- 运营 / 营销展示 → `HighlightCard`（非数据型）
- 单纯指标 → 用 `StatCard` 家族
- 产品卡列表 → 用 `ProductRow`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
