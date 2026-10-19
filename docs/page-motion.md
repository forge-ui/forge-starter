# 页面切换与刷新动效

本约定适用于现有 `AppShell` 下的业务页面。实现入口：`components/app-shell.tsx`、`components/page-transition.tsx`、`app/globals.css`。这是项目壳能力，不是 Forge core 自带能力；新项目需携带这三个文件的接入，不能只安装组件包。

## 自动继承范围

- 新页面沿用已有业务 layout / `AppShell`，无需逐页导入 `PageTransition` 或复制 CSS。
- `AppLayout` 和侧栏保持常驻；只有正文 `children` 放入 `PageTransition`。禁止给整个壳按 pathname 设置 key，或把侧栏、全站 Toast、Ask AI 宿主一起包进动效。
- 页面首次挂载、刷新、pathname 改变时自动进入。普通同源业务链接的无修饰键左键点击，会先淡出再导航。
- 同 pathname 的 query/hash 变化不触发整页重入；筛选、分页和弹窗深链应继续保留原交互，不得为了动效强制整页重挂载。
- `router.push/replace()`、浏览器前进/后退目前只继承 pathname 改变后的进入动效，不保证离场淡出；不要在交付说明中宣称所有导航方式均有离场效果。
- 登录/注册/找回密码/API、外链、下载、新窗口及修饰键点击保留各自导航行为；不属于这套完整业务页切换动效。

## 页面结构

包装使用 `display: contents`，不增加布局盒。当前选择器是 `.starter-page-transition > * > *`：页面应优先保持一个正文根，页头、工具带、主体等有意义的直接子区块依次进入。以实际渲染 DOM 为准，Fragment、Suspense、额外嵌套及复杂工作台会影响分段粒度；自动接入不等于每个页面都天然按业务模块分段。

不得为凑分段拆散 Kit 组件内部结构，也不要在每一行表格、卡片内部或页级重复添加相同动画。新增页面后实测实际分段；需要调整时仅整理合理的页面区块结构，并保持原布局、滚动和弹窗行为。

## 固定参数与边界

| 项 | 当前约定 |
|---|---|
| 正文离场 | opacity 淡出 100ms，ease-out |
| 区块进入 | opacity 0 → 1，translateY 6px → 0，220ms，ease-out |
| 错峰 | 第1块0ms、第2块20ms、第3块40ms、第4块及以后60ms |
| 动效时长 | 进入220–280ms；含离场合计320–380ms，不含路由、接口或编译等待 |
| 布局 | 只动画 opacity/transform；不动画 width/height/margin/padding，不改变原内容面 gutter 和滚动根 |
| 无障碍 | `prefers-reduced-motion: reduce` 关闭进入/离场动画，不增加100ms导航等待 |
| 慢导航恢复 | 发起导航后1500ms仍未卸载时恢复旧正文可见，避免永久透明；不保证慢请求下绝无空白或恢复闪现 |

页面数据与资源加载仍需使用原有 loading/空态处理及尺寸预留。动效不能代替骨架屏，也不能保证由异步数据、字体或图片引起的布局变化为零。

## 交付与审计

按 `docs/audit-checklist.md` 的 **Q5** 验证，并记录实际路由、刷新、分段时序、侧栏及内容面几何、减少动态效果和 console。程序化导航及前进后退按上述已实现边界验收，不虚报完整离场。只改文档无需重新运行 UI 用例；新增/修改页面或动效实现时必须执行浏览器验证。
