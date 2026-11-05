# SurfaceCard 与标题 Panel 边界

SurfaceCard 已从当前 core 主入口间接导出，Props 和类型见 [生成 API](components/surface-card.md)，不要仅 grep 根 index.ts 就判定未导出。它提供中性内容容器，不自动等于后续计划中的模板风格通用标题 Panel。

按任务选真实 Screen：ecommerce-2 的表格卡壳是有效模板现状。不要把 ChartCard 伪装非图表面板，也不要把 SurfaceCard 的现有 API 宣称为已完成所有目标 Panel 契约。新增公共 API 时记录 FORGE-GAP 并等待决定，本阶段不修改 core。

参阅 [Blocks 计划](blocks.md) 与 [统一审计清单](audit-checklist.md)。
