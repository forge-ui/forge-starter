# Ask AI 终止按钮规范审计（2026-09-30）

范围：本次 AskAiProvider / PromptBar 接入与 transcript 类型收窄；其余已有未提交改动不属于本次审计。规范审计不替代功能测试。

## 对照物

角色：agent 会话 surface；宿主页 chrome A，B 封装保留。主对照：`app/(app)/ref/agent/page.tsx`；组件依据：Core 0.3.5 PromptBar 的 status/onStop 定义及实现。抽屉与全屏继续由 Kit AskAi 提供。

## 分层记录

| 层 | 结构与对照 | 判定 |
|---|---|---|
| S | 宿主页头入口 → Kit AskAi → 消息 → PromptBar | 通过 |
| O | 唯一 provider portal；抽屉/全屏由 Kit 管理；模型页底 gutter 可见 | 通过 |
| N | 消息区滚动，输入区 gutter/min-w-0；没有新增卡片或分栏 | 通过 |
| C | Core PromptBar status/onStop；中文可访问名称；siteConfig.accent | 通过 |

## 清单逐条记录

| 条目 | 判定 | 证据与适用范围 | 修复 |
|---|---|---|---|
| M1 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| M2 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| M3 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| M4 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| M5 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| M6 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| R1 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| R2 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| R3 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| R4 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| R5 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| H1 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| H2 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| H3 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| H4 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| H5 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| H6 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| H7 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| L1 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| L2 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| L3 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| L4 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| L5 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| L6 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| L7 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| L8 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| L9 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| L10 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| C1 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| C2 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| C3 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| C4 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| C5 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| C6 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| C7 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| C8 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| C9 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| C10 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| V1 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| V2 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| V3 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| V4 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| V5 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| V6 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| V7 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| F1 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| F2 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| F3 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| F4 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| F5 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| F6 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| D1 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| D2 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| D3 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| D4 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| D5 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| D6 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| E1 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| E2 | 不适用 | 本次仅会话输入终止动作；不新增菜单、路由、CRUD、表格、图表或业务字段 | 无 |
| E3 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| E4 | 通过 | components/ask-ai-entry.tsx:1；components/ask-ai-transcript.tsx:1 | 无 |
| Q1 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| Q2 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| Q3 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |
| Q4 | 通过 | components/ask-ai-entry.tsx:648，Kit AskAi/PromptBar；本次浏览器抽屉及全屏验收 | 无 |

## 对照偏差与修复

- 自定义 composer 使用 Core 新接口，无手搓按钮或第二套抽屉。
- 请求中 abort 请求与进度读取；文字播放中切换 stopped；既有请求身份校验阻止迟到结果覆盖。
- 修复 transcript 既有 choice filter 后类型未收窄导致的 typecheck 错误，不改变展示逻辑。
- 规范红线：本次修改未发现新增违规。无清单反哺建议。

## 重验记录

- Ask AI 16 项测试通过，包括停止后迟到响应隔离与播放状态。
- 浏览器复用已运行 Chrome，模型页打开 Ask AI，发送 → 停止生成 → 已停止 → 输入恢复；全屏继续发送。
- 截图视觉检查：正文清晰、composer 留有边距、宿主底 gutter 可见。

- 最终 pnpm check 通过；15 条 /ref 历史颜色警告，未新增。
- 全屏发送 → 停止生成 → 已停止验证通过；停止后再次发送并正常完成已验证。浏览器控制台 error/warn 为空。
- 回复逐字显示时停止由既有 playback 单测验证，本次浏览器未单独截获该时段。
- 截图：`tmp/ask-ai-stop-fullscreen.png`。
