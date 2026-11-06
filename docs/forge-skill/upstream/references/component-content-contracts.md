# 组件内容与布局契约

提炼自已采纳 component-content-layout-policy、description-item-layout-contract。推荐契约不等于所有版本已实现。

- 先计算父容器实际可用宽，再预留 lead、操作和间距，正文 FLEX 取得 max(0,可用宽−lead−操作−间距)。min-w-0 只允许收缩，不自动解决断行。
- 文本和 ReactNode 都需考虑空值、换行、长不可分标识；不固定说明/错误高度。身份信息必须可完整获取；次要信息截断需可恢复。
- DescriptionItem/ListItemLeadSlot 的参考预算：默认根字号16px时图片44px、circle icon lg48px（可覆盖）、slot gap8px、label-content gap4px、文字行高20px、尾操作 HUG 不收缩且 gap8px。来源为对应组件源码与已采纳契约，消费项目字体/覆盖需另测。
- 高度 HUG 内容，不把176px/320px等样本当全站最小宽。信息不足时重排或局部滚动，不能靠 overflow-hidden 隐藏操作。
- 表格身份列、数字对齐、剩余宽度归属明确；不要把剩余宽强塞最后一列掩盖空隙。图表区分标题、单位、图例和绘图区。
- 复杂图形标外包络/keep-out、安全区域；数量/内容支持域未知记 FORGE-GAP。Calendar、分页等输入边界、路由与数据归一仍由宿主负责，不把异常现状当规范。

本轮未做浏览器内容极限/字体/读屏器验证；按 [审计清单](audit-checklist.md) 分开记录源码与实测。
