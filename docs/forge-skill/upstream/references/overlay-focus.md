# 弹层、焦点与 Tooltip 契约

提炼自已采纳 batch1-rules-addendum 与 tooltip-group-timing-contract；适用性仍需核对安装版本与宿主组合。

- 原生 dialog 内的 KebabMenu portal 留在所属 dialog；普通页面挂普通宿主，不能靠更高 z-index 修原生 top-layer。
- Escape 先关闭最上层活动子层，再由宿主处理父层；不能靠 stopPropagation 掩盖多层关闭。
- 选择或 Escape 后返回仍存在的 trigger；外点尊重新焦点。选择后开启子 Modal/导航则由新目标接管，不强抢旧 trigger。受控 open 由宿主确认回写，拒绝关闭后仍可再次操作。
- 标题可换行，关闭控件不收缩；正常 body 单滚，头尾超预算时整层单滚；宽代码和表格只在所属区域横滚，不藏关闭按钮。菜单外边预算8px、通知/个人/团队/应用面板16px是采用契约，需按当前实现核对。
- 独立 SearchHeader 窄屏允许搜索与操作换行；AppLayout 使用自身 mobile-menu 能力，不另画第二套汉堡或搜索。
- TooltipGroup 仅提供上下文，不生成布局盒/ARIA group；以最近 provider 为作用域，不自动合并。冷 hover 默认200ms（单项 delay 可覆盖），最后实际可见项关闭后 warmWindow 默认500ms；focus 即时开启。仅实际移除更新 warmUntil；计时参数变化会重建，不保证保留内部时序。
- 分组共享时序/位置，不保证互斥：两个受控 open=true 可同时存在，宿主负责仲裁。位置过渡声明180ms，不等于实机精确时长保证，也不提供 group motion prop。

触摸、读屏器、软键盘、跨浏览器及极端尺寸本轮未验证。验收见 [清单](audit-checklist.md)。
