# Ask AI 布局接入审计（2026-10-16）

范围：Starter 升级 core 0.4.6，以及 components/ask-ai-entry.tsx 的布局接入。业务页仅作为宿主回归，不扩大到账号/工作台既有业务逻辑。规范审计不等于用户体验验收。

## 对照物

| 页面 | 角色 | chrome | 对照页 | case |
|---|---|---|---|---|
| Ask AI | 壳级辅助面板 | 宿主既有 chrome；面板非业务页头 | Kit /dev/ask-ai-panel；本仓 /ref/agent | page-header 的 AskAi；chat-input-bar |
| /accounts/ | collection | B | 本仓 accounts + Kit toolbar | toolbar / table |
| /dashboard/ | dashboard | 保留原页头 | 本仓 dashboard | grid / card / chart |

## 分层记录

| 层 | 观察到的结构 | 对照与判定 |
|---|---|---|
| S | 宿主页头、工具带、主体保持原顺序；Ask AI 独立于业务页面 | Kit AskAi 负责标题、欢迎区、会话和全屏，符合壳辅助面板职责 |
| O | Provider 在 AppLayout 外预留 460px，仅 docked 时生效 | 无第二套 AppLayout；内容壳首屏底/右 gutter 保留 |
| N | 面板：会话工具栏 → 欢迎标题/说明/建议或消息 → composer | 全部复用 Kit，未增加表外卡或额外业务分栏 |
| C | AskAi responsive + session；原 ChatInputBar 和 Transcript 保留 | npm 0.4.6 类型确认具备接口；无自研抽屉/全屏 |

## 结论

本次接入范围未发现规范违规。下面逐项记录适用性；不适用指本次未创建或修改该类结构。未重新认证整个既有业务模块。

## 清单逐条核查

| ID | 判定 | 证据（文件:行）及理由 | 修复 |
|---|---|---|---|
| M1 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| M2 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| M3 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| M4 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| M5 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| M6 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| R1 | 通过 | components/app-shell.tsx:240；壳辅助面板，宿主角色不变 | 无 |
| R2 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| R3 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| R4 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| R5 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| H1 | 通过 | components/ask-ai-entry.tsx:876；单一 Kit 入口挂既有页头槽 | 无 |
| H2 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| H3 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| H4 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| H5 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| H6 | 通过 | components/ask-ai-entry.tsx:706；未在业务正文引入 PageHeader | 无 |
| H7 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| L1 | 通过 | components/app-shell.tsx:240；仍由唯一 AppLayout 承载 | 无 |
| L2 | 通过 | components/ask-ai-entry.tsx:868；只预留 docked 宽，无页面根 padding | 无 |
| L3 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| L4 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| L5 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| L6 | 通过 | components/ask-ai-entry.tsx:709；Kit session 顶栏及欢迎区；desktop/mobile 截图 | 无 |
| L7 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| L8 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| L9 | 不适用 | components/ask-ai-entry.tsx:868；壳预留固定面板空间，不是业务页面栅格；未新增卡组 | 无 |
| L10 | 通过 | components/ask-ai-entry.tsx:868；1440/1920 截图底边与右边 gutter 可见 | 无 |
| C1 | 通过 | components/ask-ai-entry.tsx:20；AskAi/ChatInputBar 从 core 导入 | 无 |
| C2 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| C3 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| C4 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| C5 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| C6 | 通过 | components/ask-ai-entry.tsx:780；新建、历史、全屏、关闭、发送浏览器实点 | 无 |
| C7 | 通过 | components/ask-ai-entry.tsx:707；发布包声明与 responsive/session/回调一致，typecheck 通过 | 无 |
| C8 | 通过 | components/ask-ai-entry.tsx:20；导出存在，未新增 Drawer/Sheet | 无 |
| C9 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| C10 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| V1 | 通过 | components/ask-ai-entry.tsx:707；未新增颜色 class/hex，面板由 Kit 管理 | 无 |
| V2 | 通过 | components/ask-ai-entry.tsx:708；沿用 color: siteConfig.accent | 无 |
| V3 | 不适用 | components/ask-ai-entry.tsx:709；没有新增宿主图标，工具图标由 Kit 提供 | 无 |
| V4 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| V5 | 通过 | components/ask-ai-entry.tsx:710；字号层级交给 Kit，欢迎标题/说明视觉确认 | 无 |
| V6 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| V7 | 通过 | components/ask-ai-entry.tsx:710；标题深色、说明/建议辅助层级，实际截图确认 | 无 |
| F1 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| F2 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| F3 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| F4 | 通过 | components/ask-ai-entry.tsx:70；沿用全站 toast，无内嵌成功条 | 无 |
| F5 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| F6 | 通过 | components/ask-ai-entry.tsx:707；使用已发布 Kit AskAi panelMode，无自研抽屉 | 无 |
| D1 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| D2 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| D3 | 通过 | components/ask-ai-entry.tsx:39；沿用服务端 Ask AI API，实测查询账号返回 | 无 |
| D4 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| D5 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| D6 | 通过 | components/ask-ai-entry.tsx:706；新增 props 均为布局/文案，无密钥 | 无 |
| E1 | 通过 | components/ask-ai-entry.tsx:706；接入放共享 Provider，未塞入业务 page | 无 |
| E2 | 不适用 | components/ask-ai-entry.tsx:706；本次布局接入未创建或修改此项涉及的业务菜单、路由、详情、表格、表单或数据结构 | 无 |
| E3 | 通过 | components/ask-ai-entry.tsx:871；保持唯一实例及原 composer/transcript | 无 |
| E4 | 通过 | components/ask-ai-entry.tsx:1；交互组件 use client | 无 |
| Q1 | 通过 | package.json:15；pnpm check 退出0，15条原有 /ref 色彩警告 | 无 |
| Q2 | 通过 | components/ask-ai-entry.tsx:706；Chrome 实际账号页/工作台/发送/会话/全屏/关闭 | 无 |
| Q3 | 通过 | 本报告对照物及分层记录；壳辅助面板使用 Kit 专用能力 | 无 |
| Q4 | 通过 | Chrome console warn/error 返回空；Next 既有 middleware 弃用提示范围外 | 无 |

## 对照偏差

- 宿主自行预留 460px：Kit onDockedChange 的消费职责；面板渲染、遮罩、焦点、断点和全屏仍交给 Kit。
- 无快捷建议的工作台也使用统一欢迎标题和说明，避免旧的单句提示占据欢迎内容槽。
- 1440 宽度下账号表在自身容器横向滚动，文档没有横向溢出；1920 时全表可见。未改表列或业务逻辑。

## 建议复核

- 用户最终视觉验收尚未执行。
- pnpm check 的 15 条 /ref 默认色警告、Next middleware 弃用提示为既有范围外事项。

## 清单反哺建议

无新增规则建议。

## 重验记录

- npm 发布包确认为 0.4.6，并核对 landingDescription/headerLayout/panelMode/onDockedChange 类型；依赖固定该版本。pnpm 新版重解可选 supports-color peer 后缀，没有升级其它依赖版本。
- pnpm check 通过（typecheck + tripwire）；git diff --check 通过。
- 复用现有 Chrome；375 / 768 / 1024 均 modal，1440 / 1920 为 docked；所有尺寸 document.scrollWidth 等于 viewport，侧栏桌面保持展开。
- docked 时可点击工作台导航，草稿保留；工作台无建议欢迎区可见；全屏时预留宽归零，退出恢复；关闭归零，再开保留消息。
- 点击“查看停用账号”，真实模型调用查询账号工具并回复无停用账号；历史菜单包含该会话，顶部显示“查看停用账号”；新建对话恢复欢迎区。
- 未进行业务写入/删除；没有发布 Starter。
- 截图：tmp/ask-ai-panel/desktop.png（1920）、wide.png（1440）、mobile.png（375）。截图位于忽略目录。

## 操作卡片修复复验

用户指明的是 composer 上方扇形操作卡片，不是欢迎区的推荐问题。根因为 lib/ask-ai-quick-actions.ts 原先主动限制仅全屏空会话返回卡片。

本次移除该限制及对应旧策略测试，components/ask-ai-entry.tsx:749 始终传 ASK_AI_QUICK_ACTIONS；保留 Kit defaultQuickActionsOpen / hasMessages，自动处理展开收起。已有消息也保留卡片定义，供加号菜单重新打开。没有增加模型不支持的图片或日程功能。

重新按本报告全部 M/R/H/L/C/V/F/D/E/Q 条目核查，适用性与上表一致；C6/C7/F6 更新为 Kit 直接管理卡片。S/O/N 不变，C 层仅 props 数据范围更正，无自研卡片、颜色或栅格。主对照补充 Kit /cases/chat-input-bar 的空会话卡片及窄容器案例。

Chrome 工作台实测：已有消息时卡片默认收起；点击新建对话显示查询信息/使用指导/整理步骤三卡；加号菜单出现快捷操作。375px 模态与桌面并排均显示卡片；console warn/error 为空。截图 tmp/ask-ai-panel/cards-restored.png。pnpm check 通过，仍为15条既有参考页警告。快捷动作发送语义测试6项通过。无新增规范违规。
