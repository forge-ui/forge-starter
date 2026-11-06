# 组件内容与布局契约

提炼自已采纳 component-content-layout-policy、description-item-layout-contract。推荐契约不等于所有版本已实现。

- 先计算父容器实际可用宽，再预留 lead、操作和间距，正文 FLEX 取得 max(0,可用宽−lead−操作−间距)。min-w-0 只允许收缩，不自动解决断行。
- 文本和 ReactNode 都需考虑空值、换行、长不可分标识；不固定说明/错误高度。身份信息必须可完整获取；次要信息截断需可恢复。
- DescriptionItem/ListItemLeadSlot 的参考预算：默认根字号16px时图片44px、circle icon lg48px（可覆盖）、slot gap8px、label-content gap4px、文字行高20px、尾操作 HUG 不收缩且 gap8px。来源为对应组件源码与已采纳契约，消费项目字体/覆盖需另测。
- 高度 HUG 内容，不把176px/320px等样本当全站最小宽。信息不足时重排或局部滚动，不能靠 overflow-hidden 隐藏操作。
- 表格身份列、数字对齐、剩余宽度归属明确；不要把剩余宽强塞最后一列掩盖空隙。图表区分标题、单位、图例和绘图区。
- 复杂图形标外包络/keep-out、安全区域；数量/内容支持域未知记 FORGE-GAP。Calendar、分页等输入边界、路由与数据归一仍由宿主负责，不把异常现状当规范。

本轮未做浏览器内容极限/字体/读屏器验证；按 [审计清单](audit-checklist.md) 分开记录源码与实测。

## Dialog / DataTable 解剖方法

提炼自 forge PR #16 的 component-anatomy.md（来源提交 `1175d3cbe8795f5f7bb198479f6d7f9771884794`），只保留可复用契约，不复制历史自测记录、静态成片或待办清单。

- 区分 DialogSurface 外壳、ConfirmationDialog 内容布局与 Modal 内层，不能因共用外壳就假设 padding、gap、标题行高相同。记录实际 variant/layout 和源码版本。
- 尺寸图每个标注对应一条源码 Token / class / 公式；Tailwind 间距基准 0.25rem，只有根字号 16px 时 p-6 才是 24px。`outline` + 负 outline-offset 不增加盒模型尺寸，不能当 border 加进预算。
- ConfirmationDialog 的默认 spread 是剩余宽 justify-between，而 right 布局是显式按钮 gap；标题/说明一行时的参考高度不是固定组件高度。视口上限和滚动应按实际 DialogSurface 样式验证，窄屏必须仍能关闭/提交。
- DataTable 外壳 w-full 与列的 min-width 预算不同。示例勾选/身份/普通/操作列预算 56+240+128+88=512px 只属于那套列组合，不可写成所有表的固定宽。FullWidthTable 也不继承 DataTable 的表头 gap。
- 分开核对表头/页脚 padding、普通单元格 padding、勾选单元格 padding，以及单元格助手的高度。行高由最高单元格决定：max(勾选控件+上下padding，内容+上下padding)，不是简单套助手高度。
- 同时标明固定宽、最大宽和内容溢出包络；控件落进 padding 与越出列框是两种问题。排序、分页和勾选的命中区单独记录；不要用 overflow-hidden 隐藏不可达操作。
- 交付源码映射表、尺寸图与运行截图三类证据，静态 HTML/PNG 不能证明真实 Dialog 焦点恢复、表格排序/分页或 375px 操作可达性。读安装版真实声明，CellText 内容用 children，不猜 text prop。
