# 对话内候选目标密度审计（2026-09-29）

范围：components/ask-ai-harness.tsx:47 的候选选择 surface，未审计整个 Agent 业务。
角色：Ask AI 对话内单选交互；宿主页 chrome A；对照 core ApprovalCard 选项行及 /ref/agent。

## 分层记录

- S：任务状态、处理记录、问题、候选、可选手动输入和取消操作。
- O：既有 AskAi 宿主，无新增面板和页面 padding。
- N：候选纵向列表，间距 4px，移除整行强调底与胶囊形态。
- C：core Button 复用立即提交、disabled、键盘激活；14px 名称与 12px 辅助信息左对齐；正常双行高度 52px，长内容自然增高。

ApprovalCard 未提供 description / 外部 disabled，直接接入会改变协议与禁用行为。因此复用 core Button 并对齐视觉密度，不新建组件。

| 条目 | 结论 | 证据 | 处置 |
|---|---|---|---|
| M1 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| M2 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| M3 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| M4 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| M5 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| M6 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| R1 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| R2 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| R3 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| R4 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| R5 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| H1 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| H2 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| H3 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| H4 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| H5 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| H6 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| H7 | 通过 | components/ask-ai-harness.tsx:47；状态与本次任务字段绑定 | — |
| L1 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| L2 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| L3 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| L4 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| L5 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| L6 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| L7 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| L8 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| L9 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| L10 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| C1 | 通过 | components/ask-ai-harness.tsx:47；使用 core Button/TextField，未复制原生选择控件 | — |
| C2 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| C3 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| C4 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| C5 | 通过 | components/ask-ai-harness.tsx:47；任务状态仍有中文文字 | — |
| C6 | 通过 | components/ask-ai-harness.tsx:47；候选回传 pending.id + option.id，保留真实 onReply | — |
| C7 | 通过 | components/ask-ai-harness.tsx:47；Button 使用合法 variant/disabled/motion/className；ApprovalCard 仅作为密度参照 | — |
| C8 | 通过 | components/ask-ai-harness.tsx:47；无新增不存在的导出 | — |
| C9 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| C10 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| V1 | 通过 | components/ask-ai-harness.tsx:47；使用 fg token 和 accent | — |
| V2 | 通过 | components/ask-ai-harness.tsx:47；color=siteConfig.accent | — |
| V3 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| V4 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| V5 | 通过 | components/ask-ai-harness.tsx:47；名称 14px 正常字重，辅助信息 12px | — |
| V6 | 通过 | components/ask-ai-harness.tsx:47；任务状态仍为 core StatusBadge soft | — |
| V7 | 通过 | components/ask-ai-harness.tsx:47；名称 fg-black，说明和 ID fg-grey-700 | — |
| F1 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| F2 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| F3 | 通过 | components/ask-ai-harness.tsx:47；手动输入原有字段级校验保留 | — |
| F4 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| F5 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| F6 | 通过 | components/ask-ai-harness.tsx:47；没有新建 Drawer | — |
| D1 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| D2 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| D3 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| D4 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| D5 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| D6 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| E1 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| E2 | 不适用 | 本次候选渲染不涉及该页面、路由、表格、CRUD 或菜单要求 | — |
| E3 | 通过 | components/ask-ai-harness.tsx:47；仅修改既有候选渲染，无新增抽象 | — |
| E4 | 通过 | components/ask-ai-harness.tsx:47；use client，保留交互 | — |
| Q1 | 通过 | components/ask-ai-harness.tsx:47；pnpm check 通过，15 条历史 ref 警告 | — |
| Q2 | 通过 | Chrome 真实账号候选：52px、左对齐、14px；点击正确提交目标 | 已重验 |
| Q3 | 通过 | components/ask-ai-harness.tsx:47；参照 core/src/components/ui/agent/approval-card.tsx:129 选项行；Button 承载现有立即提交行为 | — |
| Q4 | 通过 | 浏览器 error/warn 日志为空 | — |

## 重验记录

- Chrome 真实对话触发两个账号候选，DOM 测量两行均为 52px，14px 字体、左对齐、透明底色。
- 主行名称，副行完整 ID；额外说明移至按钮 title，避免副行说明与 UUID 挤成三行。长名称/更窄视口仍允许自然换行。
- 点击第二个候选后，聊天回显正确的“语义测试甲（semantic_alpha）”并继续任务；本次不以后台后续导航结果作为视觉修改验收。
- 手动输入和取消操作保留。pnpm check 通过，无浏览器 error/warn。
- 截图：tmp/grok-probe/compact-choices.png。
- 无新增规范红线；无需新增 core 组件或清单规则。
