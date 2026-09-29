# Ask AI 消息滚动规范审计（2026-09-29）

本报告覆盖规范符合性；滚动功能边界另列为开发复核，不以静态审计代替浏览器验收。

范围仅为本轮滚动变更：components/ask-ai-scroll-area.tsx（新增）和 components/ask-ai-entry.tsx（消息插槽改接滚动容器）。其他已在工作区的 Harness、账号和模型改动不纳入本轮结论。审计采用本仓 .agents/skills/forge-starter-audit/SKILL.md 与 docs/audit-checklist.md，逐项覆盖 65 个条目。

## 对照物

| 页面/组件 | 角色 | chrome | 主对照 | case |
| --- | --- | --- | --- | --- |
| 全站 Ask AI 消息区 | agent 对话附件（docs/page-roles.md 已列 agent） | 宿主页保持 A/B；附件沿用 Kit AskAi 抽屉/全屏 | app/(app)/ref/agent/page.tsx:78；已安装 core AskAi | agent、button-link |

辅助实现证据：core 0.3.1 的 ask-ai.js:188 自动滚动只操作内部 conversationRef，:316 的自定义 messages 插槽会替换该节点；ask-ai-fullscreen.js:245 另有全屏消息容器。因此在自定义插槽内封装滚动行为是合理适配，不新造抽屉、全屏层或业务控件。

## S → O → N → C 分层记录

| 层 | 本层 DOM/JSX 结构 | 对照与判定 |
| --- | --- | --- |
| S 页面结构 | 业务页页头入口 → 唯一 Kit AskAi → 消息区 → 独立 PromptBar | entry:633、:671、:681 保持 A/B 入口与 Kit 宿主；没有第二套业务页头或壳。 |
| O 内容根 | ScrollArea 外层 relative、h-full、min-h-0、flex-1、overflow-hidden；内部单独 overflow-y-auto | scroll-area:141、:148；entry:535 的 composer 保持 shrink-0 与底部 gutter。最终 Chrome 双模式 gap=0；全屏外层 663/663 无溢出，消息内层 scrollHeight=4164、clientHeight=587、top=3577。截图可见 composer 与首屏底部留白。 |
| N 节/区块 | Transcript 原纵向消息 stack；内容尾部留 48px；“回到最新”在消息容器内定位 | scroll-area:150、:153；未增加装饰卡、表格包壳或页面栅格。底部留白为悬浮操作提供空间，不是业务页根 padding。 |
| C 组件 | Kit Button + siteConfig.accent；其余是行为用原生结构容器和 React hooks | scroll-area:4、:154；Button 的 size=sm、onClick、className 均符合安装版 d.ts 与 button-link case。viewport 可聚焦，有中文区域名与 focus-visible 提示。 |

## 逐项清单

证据简写：SA = components/ask-ai-scroll-area.tsx；Entry = components/ask-ai-entry.tsx；Transcript = components/ask-ai-transcript.tsx（只读关联参考，未修改）。行号以最终代码复核时文件为准。浏览器结论仅覆盖本次桌面 Chrome；触摸与减少动态效果分支只做代码复核。

| ID | 结果 | 证据（文件:行号） | 处置/边界 |
| --- | --- | --- | --- |
| M1 | 不适用 | Entry:515 仅替换既有 messages 插槽 | 无主菜单改动。 |
| M2 | 不适用 | SA:4 仅导入 Button | 无菜单图标改动。 |
| M3 | 不适用 | Entry:515 | 不新增模块、路由或菜单。 |
| M4 | 不适用 | SA:154 为实际滚动按钮 | 无新增 href 或菜单。 |
| M5 | 不适用 | Entry:671、:681 | 保留既有页头入口，无菜单分组改动。 |
| M6 | 不适用 | Entry:515 | 无菜单 href 改动。 |
| R1 | 通过 | Entry:515；docs/page-roles.md 的 agent 行 | agent 对话附件，未混入新页面骨架。 |
| R2 | 不适用 | SA:9 | 未新增详情形态。 |
| R3 | 不适用 | SA:141 | 不新增独立表单页。 |
| R4 | 不适用 | Entry:515 | 不改表单或详情深链。 |
| R5 | 不适用 | Entry:515 | 无兼容 redirect 页变更。 |
| H1 | 通过 | Entry:671、:681 | 保持宿主页 A/B 和单一 AskAi 入口。 |
| H2 | 不适用 | Entry:685 | 本轮不改正文页头/面包屑 props。 |
| H3 | 不适用 | SA:9 | 消息滚动容器不承载实体面包屑。 |
| H4 | 不适用 | Entry:515 | 未改变面包屑层级。 |
| H5 | 不适用 | SA:154 | “回到最新”仅调整消息视口，不是详情返回导航。 |
| H6 | 通过 | Entry:638；SA:141 | 继续用 Kit AskAi，未拿 PageHeader 包内容卡。 |
| H7 | 不适用 | SA:152 | 新控件是滚动动作，无新增状态徽章。 |
| L1 | 通过 | Entry:633、:638 | 沿用现有 AppShell 下唯一 Kit portal，没有自造 sidebar/topbar。 |
| L2 | 通过 | SA:141、:150 | 外层纵向 Flex；仅消息尾部预留操作空间，未加业务页根 p-6/p-8。 |
| L3 | 不适用 | Entry:515 | 不调整 collection 工具带。 |
| L4 | 不适用 | SA:9 | 无全页详情骨架变更。 |
| L5 | 不适用 | SA:9 | 无看板布局变更。 |
| L6 | 通过 | SA:150、:153、:154 | 单一 sm Kit 按钮，底部间距为标准尺寸；history-preserved.png 可见按钮在消息区内，composer 独立。 |
| L7 | 通过 | SA:148；Transcript:186、:192、:198 | 消息 min-w-0；既有 DataTable 保持比例列宽与表内 min-width=520。fullscreen-bottom.png 可见全部列；drawer-bottom.png 的横滚限定在表内，不撑出消息区。 |
| L8 | 通过 | SA:150；Transcript:186 | 结构容器无背景卡片/边框，不给消息表增加装饰白卡。 |
| L9 | 不适用 | SA:141、:153 | 一维纵向消息与居中按钮，不是页面级分栏，Flex 合理。 |
| L10 | 通过 | SA:141、:148；Entry:535 | 高度受宿主约束、min-h-0、内部滚动；composer 独立 shrink-0。Chrome 全屏 outer 663/663、inner 587/4164，只有内部溢出；drawer-bottom.png、fullscreen-bottom.png 可见 composer 与底部留白。 |
| C1 | 通过 | SA:4、:154；Entry:21 | 新增可见控件来自 core；结构 div 封装原生滚动行为，不替代 Kit UI。 |
| C2 | 不适用 | SA:150 | 不新增 collection 数据表，children 保留原 Transcript 渲染。关联表仍按 L7/L8 核查。 |
| C3 | 不适用 | Entry:516 | 本轮不改表格排序配置。 |
| C4 | 不适用 | SA:141 | 不新增 ConfirmationDialog。 |
| C5 | 不适用 | SA:154 | 无新状态展示，按钮为明确中文动作。 |
| C6 | 通过 | SA:56、:154 | 按钮真实调用 scrollToLatest；Chrome 点击“回到最新”后到达底部，继续 End/展开记录仍保持 gap=0。 |
| C7 | 通过 | SA:154；core button.d.ts 的 Button 签名 | size=sm、color、onClick、className 为真实支持的 props。 |
| C8 | 通过 | SA:4；Entry:21 | 导出存在，pnpm check 类型检查通过。 |
| C9 | 不适用 | SA:150 | 不调整结果表实体入口或操作列。 |
| C10 | 不适用 | SA:141 | 无指标卡。 |
| V1 | 通过 | SA:148；Entry:529 | 新增显式颜色为 outline-fg-grey-500；没有默认色/裸 hex。 |
| V2 | 通过 | SA:154；Entry:544 | 滚动按钮及保留的 composer 采用 siteConfig.accent。 |
| V3 | 不适用 | SA:154 | 不新增图标。 |
| V4 | 不适用 | SA:9 | 不新增图表。 |
| V5 | 通过 | SA:154；Entry:671、:681 | 使用 Kit sm 按钮字号，不改变 A/B 页头尺度。 |
| V6 | 不适用 | SA:152 | 不新增语义状态；“回到最新”为真实 Button，不是手搓状态 pill。 |
| V7 | 通过 | SA:148、:154；Entry:529 | 按钮文字沿用 Kit 配色；grey-500 只用于焦点轮廓，不用于正文。 |
| F1 | 不适用 | SA:150 | 不改变表单控件、宿主或状态归属。 |
| F2 | 不适用 | SA:154 | 仅滚动操作，无危险业务写入。 |
| F3 | 不适用 | SA:90 | 不新增字段校验；键盘处理跳过输入控件。 |
| F4 | 不适用 | SA:56 | 滚动位置改变无需业务成功反馈；Entry:67 既有业务操作仍走 toast。 |
| F5 | 不适用 | Entry:515 | 不改创建后的动线。 |
| F6 | 通过 | Entry:638；SA:141 | 继续 Kit AskAi 抽屉与全屏，没有新增 Drawer/Sheet/视口层。 |
| D1 | 不适用 | Entry:514、:527、:537 | 本轮仅包装已有消息；既有恢复、空态和错误重试保持。 |
| D2 | 不适用 | SA:9 | 不新增全页详情。 |
| D3 | 不适用 | SA:14、:17 | 仅 DOM 引用和临时滚动状态，不实现 CRUD/持久化。 |
| D4 | 不适用 | SA:9 | 不改数据库表或认证模型。 |
| D5 | 通过 | SA:17、:23；Entry:515 | 阅读位置和 following 是临时状态；按当前 session 与末条 turn ID 驱动，不写 URL。 |
| D6 | 通过 | SA:9；Entry:515 | 新组件仅接 children、sessionId、followKey；没有新增敏感字段渲染或密钥传输。 |
| E1 | 通过 | SA:9；Entry:515 | DOM 滚动生命周期单独封装，Provider 只接 props；无 service/DB 混入。 |
| E2 | 不适用 | SA:9 | 本轮无 API 变更。 |
| E3 | 通过 | SA:7、:9 | 同一容器复用抽屉与全屏，把监听/observer/RAF 清理集中；未引入通用滚动框架。 |
| E4 | 通过 | SA:1、:19；Entry:1 | client 指令与 layout effects、浏览器事件的使用匹配。 |
| Q1 | 通过 | 本轮 pnpm check，退出码 0 | 类型检查与 tripwire 通过，仅 15 条既有 /ref 警告。 |
| Q2 | 通过 | 复用稳定桌面 Chrome；末尾 5 张截图与实测数据 | 抽屉/全屏、真实回复追尾、历史阅读、刷新切会话、备注展开和错误字段 focus 均已验证；触摸/减少动态效果不计实测。 |
| Q3 | 通过 | 本报告对照物与 S/O/N/C；ref/agent:124；button-link case | 角色和 chrome 已确认；差异是实际对话滚动适配，不是把附件改成 accounts 页。 |
| Q4 | 通过 | 最终 Chrome fresh logs：error=[]、warn=[] | 主任务检查无新增 console/React 警告；最终截图无 Next 错误覆盖层。 |

## 结论与修复记录

- 规范审计通过：65 项全覆盖，最终无未闭环的 Forge 结构、控件、token 或交付验证违规。
- 开发 review 修复 1：初版 interrupt() 无条件关闭 following，底部无位移操作可能静默停止跟随。最终 SA:85 依据 atBottom() 更新 following/away，真正离底再由滚动意图关闭跟随。
- 开发 review 修复 2：备注展开时布局滚动先于 ResizeObserver，可能把跟随误判为历史阅读。最终加入尺寸保护、滚动意图与编辑 focus 保护；备注展开保持 gap=0，校验焦点稳定停在错误字段，真实回复期间 Home 阅读也未被打断。两项修复均不改变业务提交逻辑。
- 验证边界：仅桌面 Chrome。触摸与减少动态效果分支只做代码复核，不宣称真实设备实测；本结论不等于移动端验收或用户接受。
- 本审计未修改业务/组件文件、参考页或检查清单。

## 相对对照页的差异

1. /ref/agent 是组件展廊；实际 Ask AI 持续增长的会话需要受约束的消息视口。新增结构容器是合理产品差异。
2. “回到最新”使用既有 Kit Button，仅在离开底部时出现；不增加独立全屏层或导航。
3. 48px 内容尾部空间给消息区浮动操作让位；PromptBar 仍有独立 gutter。form-expanded.png 与 drawer-bottom.png 已核最下方交互可见。

## 重验记录

- 静态：2026-09-29，Node 22.23.2 环境执行 pnpm check，退出码 0；typecheck、tripwire 通过，15 条范围外 /ref 既有颜色警告。interrupt 边界修复、尺寸/意图/focus 保护接入后分别再次执行，均相同结果；主任务最终 pnpm check 与 git diff --check 也通过。
- 生命周期只读复核：监听器、ResizeObserver、requestAnimationFrame 均在卸载/切换会话清理；布局 effect 以 sessionId 重建，followKey 为当前末条 turn ID；减弱动态效果偏好走即时定位。最新代码新增尺寸缓存、滚动意图窗口、输入框 focusin 保护；新增 pointermove、touchmove、focusin 监听均成对移除，按钮 Space 激活不计滚动意图。
- 浏览器：由主任务复用用户当前稳定桌面 Chrome，真实 grok-4.7 只读查询；本报告作者未启动浏览器，直接查看以下 5 张截图完成 S/O/N/C 视觉复核。表单只验证展示、校验、取消，未保存业务数据。证据目录为 .semantic/evidence/ask-ai-scroll-20260929。

| 场景 | 必须观察的结果 | 证据/结果 |
| --- | --- | --- |
| 抽屉首开、已有长会话 | 消息在底部；composer 与底 gutter 保留 | 刷新并切回测试会话：scrollHeight=4124、clientHeight=646、top=3478、gap=0。drawer-bottom.png 与 form-expanded.png 可见独立 composer/gutter |
| 抽屉发送并等待长回复 | 新问题恢复跟随；同 turn 回复增高后继续到底 | 主任务 Chrome 已实测新消息结果追尾；上翻后发新消息恢复追尾，表单前 scrollHeight=4386、clientHeight=702、top=3684、gap=0 |
| 全屏消息区、退出全屏 | 有效滚动区内到底；无外层叠加滚动或整页横滚 | 最终 Kit outer clientHeight/scrollHeight=663/663、top=0；消息 inner clientHeight=587、scrollHeight=4164、top=3577、gap=0。fullscreen-bottom.png；退出全屏回抽屉后保留测试页 |
| 向上读历史后内容增长 | 保留阅读位置；“回到最新”有效 | 初验 pending 中 Home 后 top=0、gap=2735，history-preserved.png；最终真实查询立即 Home，回复后 scrollHeight=4416、clientHeight=646、top=0、gap=3770，未抢阅读。点击“回到最新”并 End 后 top=3770、gap=0，drawer-bottom.png |
| 底部无位移操作 | 不因无位移的输入事件静默丢失跟随 | SA:82–96 代码复核：按 atBottom 保留跟随，普通点击清旧意图。触摸未实测 |
| 添加备注与展开处理记录 | 高度变化保持原跟随意图，末尾按钮可见 | 修复后备注展开：scrollHeight=4166、clientHeight=646、top=3520、gap=0，form-expanded.png；处理记录展开后 top=3770、gap=0，drawer-bottom.png |
| 校验错误字段定位 | 保留编辑焦点，不被追尾拉回底部 | 空字段确认后 focus 为“填写姓名”，y=386；viewport y=73、height=646，top=3076、gap=510 且稳定。validation-focus.png；随后取消任务成功，无保存 |
| 刷新、切换会话与关闭重开 | 新视口正确到底 | 刷新后切回测试会话，initial scrollHeight=4124、clientHeight=646、top=3478、gap=0；关闭重开首开 gap=0 |
| 键盘与减少动态效果 | 键盘阅读、编辑定位可用；减少动态效果直接定位 | Home/End、返回按钮、错误字段 focus 已实测；prefers-reduced-motion 分支仅代码复核，未切系统偏好实测 |
| console / Next overlay | 本次未新增 error、React 警告或错误覆盖层 | 最终 fresh browser logs error=[]、warn=[]；最终截图无 Next 错误覆盖层 |

## 清单反哺建议

为 agent/chat 角色增加“自定义消息插槽需明确滚动宿主、尊重历史阅读、用户新提交恢复跟随、长内容与动态高度保持 composer 可见”的验证项。本轮不修改清单。
