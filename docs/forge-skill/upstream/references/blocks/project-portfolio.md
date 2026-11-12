# 项目总览

分类：协作与项目。整体进度、项目进展与需要关注三张统计卡，项目按状态筛选、搜索与归档切换，并可在可操作的卡片和表格之间切换。

由源码类型生成；继承的 DOM 属性一并列出。默认值与插槽优先级见 registry 内源码。

依赖：core ^0.8.0；组件：Avatar、Breadcrumbs、Button、ButtonGroup、CardIconChip、CellMuted、CellProgressBar、CellText、CellTextSubtitle、ConfirmationDialog、DataTable、DonutChart、Grid、GridItem、IconButton、KebabMenu、PageTitleToolbar、ProgressBar、StatusBadge、SurfaceCard、Toolbar、ToolbarPillTabs、ToolbarSearchInput、ToolbarSelectDropdown、cardThemes。

## 最小可用示例

```tsx
import { ProjectPortfolio } from "@/components/blocks/project-portfolio";

export default function Example() {
  return (<ProjectPortfolio />);
}
```

## ProjectPortfolio Props

| Prop | 必填 | Type |
|---|---|---|
| projects | 否 | `PortfolioProject[] \| undefined` |
| stats | 否 | `PortfolioTaskStats \| undefined` |
| className | 否 | `string \| undefined` |
