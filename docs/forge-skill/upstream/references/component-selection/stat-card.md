## 选型

- Dashboard 首页的主要指标 → `size="sm"`，多张排网格，默认填满列宽
- 重点强调的单指标 → `size="lg"` + `theme` 品牌色 + icon
- 需要强视觉横向锚点 → `size="wide"`
- 需要右上菜单 → `onKebabClick`，或传 `action` 自定义
- 需要图表的指标 → 用 `ProgressStatCard` / `LineChartStatCard` 等变体
