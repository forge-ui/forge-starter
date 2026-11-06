# 动效采用规则

依据 docs/design/motion-role-fusion.md 的角色契约：enter180ms、exit120ms、layout200ms、press80ms；缓动 cubic-bezier(.2,.8,.2,1)。这些是对应角色的声明值，不是所有组件强制统一时长，也不是实机测量。

退出短于进入；Overlay 用透明度，减少动态偏好时 dialog 不平移、保留必要透明度反馈，motion="none" 即时完成。重新打开取消未结束的关闭计时，避免旧回调误关新弹层。路由切换保留稳定壳，不用整页重挂制造动画。

优先现有组件能力。core 当前存在 motion 依赖，LiquidTabs/Calendar/Chat 等可使用它；不以此授权新增另一套动效库或宣称所有组件均由纯CSS实现。具体 Props 以生成目录为准。

reduced-motion、快速重复操作、退出期间重开和焦点归属必须实测；本次文档任务未完成这些浏览器验证。
