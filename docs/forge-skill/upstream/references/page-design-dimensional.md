# 多维页面图方法

使用随本仓独立分发的 [dimensional-drawing](../../dimensional-drawing/SKILL.md) 画静态尺寸图；只有用户明确要求动画成片时才使用 [dimensional-drawing-motion](../../dimensional-drawing-motion/SKILL.md)。install-skill.sh 同时安装三者，不依赖固定本机路径。先选真实同角色 Screen；另行截图验证实际 UI，图纸不能替代运行验收。安装 skill 不自动执行 headless 依赖或下载浏览器。

1. 标注角色、任务、模板源码/版本、视口、侧栏状态及净内容宽。
2. 按外壳→页面组件→组件拆槽，标 FILL/FLEX/HUG，说明 padding、gap、宽高、滚动归属。操作先保留 HUG，正文取得非负剩余宽。
3. 尺寸线、变量表与公式一一对应，区分源码值、公式推导、建议值、未核实；不以截图比例猜参数。
4. 宽屏与窄屏分别画，保留阅读顺序、关闭/提交入口；长文字重排，宽代码/表局部横滚，不隐藏不可达操作。
5. 看板必填：Screen 路径与版本、目标/KPI业务入口、轨道/span/断点、section gap、Grid gap、卡padding与内部gap、图域高度与整卡高度的区别、字体层次、滚动与侧栏净宽。公式与数值单一来源见 [页面规范](page-recommended-standard.md)。
6. 交付图纸说明有意偏差与 FORGE-GAP；浏览器验证另记录实际计算样式、截图、真实动作、焦点与溢出。

验收使用 [统一清单](audit-checklist.md)，不把技术构建或静态图纸当真实展示通过。
