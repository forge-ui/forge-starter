## 选型

- Dashboard 首页的主要指标 → `size="sm"`，多张排网格，默认填满列宽
- 重点强调的单指标 → `size="lg"` + `theme` 品牌色 + icon
- 需要强视觉横向锚点 → `size="wide"`
- 需要右上菜单 → `onKebabClick`，或传 `action` 自定义
- 需要图表的指标 → 用 `ProgressStatCard` / `LineChartStatCard` 等变体

## 看板密度

看板使用 `density="compact"`，不要复制私有 `!important` 覆盖。省略 density 保持默认外观；完整九类卡片对照见 `/cases/dashboard-kit`。公开类型 `CardDensity` 与对应 `*Props` 可从 core 导入。
