## 选型

- 项目 / 团队摘要卡（需要展示责任人头像） → `ImageStatCard`
- 日期范围的汇总指标 → 用 `subtitle` 标注期间
- 纯数字指标不需要头像 → `StatCard lg`

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
