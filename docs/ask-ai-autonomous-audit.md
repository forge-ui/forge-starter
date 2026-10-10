# Ask AI 流式与按需展示审计（2026-10-10）
本报告只覆盖本次 Ask AI 修改的规范符合性；功能验证另列测试记录。

## 对照物
角色：既有 dashboard/collection 的共享聊天 surface；宿主页头保持原 A/B。主对照 Starter `/ref/agent` 与 Forge `/cases/agent`、`/cases/table`。没有更改宿主页头或增加入口。
审计范围：components/ask-ai-transcript.tsx, components/ask-ai-presentation.tsx, components/ask-ai-harness.tsx

## 分层记录
| 层 | 结构与对照 | 判定 |
|---|---|---|
| S | 既有页头入口 → Kit AskAi → 消息 → PromptBar；普通文字、真实查询、按需展示分别处理 | 合理业务差异：不固定插入 ThinkingTrace |
| O | 唯一 AskAi 宿主，消息面内滚动、composer 仍位于底部 | 不增加第二套壳或页根 padding |
| N | 展示表为标题 + DataTable；横滚容器无装饰白卡；清单保留 Kit | 没有表套卡、伪流程、伪进度 |
| C | Kit StreamingAnswer、DataTable/CellText、真实 ToolChips；业务任务仅多个真实步骤 | props 与 token 核对；不暴露密钥或放开写权限 |

## 清单逐项
| ID | 判定 | 证据 | 理由 |
|---|---|---|---|
| M1 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| M2 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| M3 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| M4 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| M5 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| M6 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| R1 | 通过 | components/ask-ai-transcript.tsx:1 | 共享助手嵌入既有 dashboard/collection 宿主，不新增业务页面骨架 |
| R2 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| R3 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| R4 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| R5 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| H1 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| H2 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| H3 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| H4 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| H5 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| H6 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| H7 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| L1 | 通过 | components/ask-ai-transcript.tsx:1 | 复用壳内唯一 Kit AskAi，不增加第二套导航 |
| L2 | 通过 | components/ask-ai-presentation.tsx:19 | 组件纵向 stack，min-w-0；没有页面根大 padding |
| L3 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| L4 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| L5 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| L6 | 通过 | components/ask-ai-presentation.tsx:19 | Kit 组件与文本层级，抽屉采用既有 PromptBar gutter |
| L7 | 通过 | components/ask-ai-presentation.tsx:22 | 列宽平均百分比，无 flex 单列占空；抽屉内表格横向滚动，全屏复核末列 |
| L8 | 通过 | components/ask-ai-presentation.tsx:19 | 节标题直接接 DataTable；overflow 容器不加装饰白卡 |
| L9 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| L10 | 通过 | components/ask-ai-transcript.tsx:1 | 沿用已有壳与 PromptBar docking，消息面内滚动，本地截图验证 |
| C1 | 通过 | components/ask-ai-presentation.tsx:4 | UI 从 core 导入；保留既有宿主 |
| C2 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| C3 | 通过 | components/ask-ai-presentation.tsx:22 | 无 sortable，无假排序 |
| C4 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| C5 | 通过 | components/ask-ai-transcript.tsx:1 | 真实任务状态有文字；普通回答不展示合成任务 |
| C6 | 通过 | components/ask-ai-presentation.tsx:19 | 表格无装饰按钮；既有展示动作与查询/确认逻辑相连 |
| C7 | 通过 | components/ask-ai-presentation.tsx:22 | DataTable key/header/rows/getRowKey 与 Kit table case 匹配，类型检查通过 |
| C8 | 通过 | components/ask-ai-presentation.tsx:4 | 仅已安装 core 导出的组件 |
| C9 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| C10 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| V1 | 通过 | components/ask-ai-presentation.tsx:20 | 新标题 text-fg-black；加载态 grey-700 |
| V2 | 通过 | components/ask-ai-presentation.tsx:21 | DataTable color=siteConfig.accent |
| V3 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| V4 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| V5 | 通过 | components/ask-ai-presentation.tsx:20 | 节标题 text-sm font-semibold；正文沿用 StreamingAnswer |
| V6 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| V7 | 通过 | components/ask-ai-presentation.tsx:20 | 标题/主单元格黑；辅助文字 grey-700 |
| F1 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| F2 | 通过 | lib/harness/engine.ts:209 | 保留等待用户/页面确认，不新增直接危险写入 |
| F3 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| F4 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| F5 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| F6 | 通过 | components/ask-ai-transcript.tsx:1 | 使用已有 Kit AskAi 抽屉/全屏，没有自研 Sheet |
| D1 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| D2 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| D3 | 通过 | lib/harness/engine.ts:193 | 事实由授权 read 工具提供，观察记录经 JSON 边界持久化 |
| D4 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| D5 | 不适用 | 本次 diff | 未改该项：无新菜单、路由、详情、业务表单、分栏或列表过滤；聊天结果表为只读展示 |
| D6 | 通过 | lib/harness/engine.ts:1 | 不新增客户端密钥，错误不持久化供应商原始消息；测试 key 仅读服务端临时脚本 |
| E1 | 通过 | lib/harness/presentation-policy.ts:1 | 引擎、适配器、来源校验、渲染分文件 |
| E2 | 通过 | lib/harness/engine.ts:69 | 沿用 API session、所有权、build、能力及签名提案校验 |
| E3 | 通过 | components/ask-ai-presentation.tsx:12 | 所有展示类型复用同一渲染器，四仓依各自业务适配器 |
| E4 | 通过 | components/ask-ai-presentation.tsx:1 | client 展示含真实交互，服务端引擎独立 |
| Q1 | 通过 | package.json | 类型检查通过；工场按自身 Q1 口径保留范围外4处既有颜色绊线 |
| Q2 | 待线上重验 | 线上 Chrome | 本地 Starter 完成正文/表格/全屏，四站部署后补齐截图与主路径 |
| Q3 | 通过 | ../forge/src/app/cases/agent/page.tsx | 按需组件是合理业务差异，移除固定 ThinkingTrace；不以 accounts 为聊天基线 |
| Q4 | 待线上重验 | Chrome console | 本地 Starter 无 warn/error；四站部署后补齐 |

## 偏差与修复
- 移除固定上下文/模型步骤以及 ThinkingTrace，普通等待仅短状态文字。
- 模型根据请求选择展示；表格从本轮授权来源组装，图表核对来源及数值。模型语义正确率不等于来源校验，不声称绝对准确。
- 查询回执仍保留真实业务调用；展示工具不计为业务调用。
- 旧 respond 交互兼容，确认/回执/权限边界保留。

## 重验记录
代码检查、独立数据库、真实模型及线上 Chrome 记录将在发布后追加。
