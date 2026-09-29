# Ask AI 模型菜单裁切修复审计

2026-09-29。范围仅 components/ask-ai-entry.tsx:518 的 PromptBar className；不将同文件其他未提交工作纳入本次交付结论。

角色：壳层 Ask AI 交互 surface，宿主页 chrome A。对照：/ref/agent 的 PromptBar（app/(app)/ref/agent/page.tsx:124）和已安装 core 的 PromptBar/Picker 源码。

## 分层记录

- S：Kit AskAi 标题、对话内容、底部 composer；抽屉/全屏均使用 Kit 自身结构。
- O：壳层保活单实例；composer 保留宽度约束、gutter 和 min-w-0。
- N：菜单为 Kit Picker，定位在输入框上方；宿主额外 overflow-hidden 导致裁切，已移除。
- C：PromptBar models/model/onModelChange 按 Kit props 接入，没有新建选择器。

## 清单

| 条目 | 结论 | 证据 | 处置 |
|---|---|---|---|
| M1 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| M2 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| M3 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| M4 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| M5 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| M6 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| R1 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| R2 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| R3 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| R4 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| R5 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| H1 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| H2 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| H3 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| H4 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| H5 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| H6 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| H7 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L1 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L2 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L3 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L4 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L5 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L6 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L7 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L8 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L9 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| L10 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| C1 | 通过 | components/ask-ai-entry.tsx:518：Kit PromptBar，accent 与宽度约束保持；无新增控件和样式体系 | — |
| C2 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| C3 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| C4 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| C5 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| C6 | 通过 | 实际点击默认模型 → sub2api，触发器文字更新；全屏切回默认成功 | — |
| C7 | 通过 | core/dist/components/ui/agent/prompt-bar.js：Picker 为向上绝对定位；宿主裁切与该用法冲突 | 已移除 overflow-hidden |
| C8 | 通过 | components/ask-ai-entry.tsx:518：Kit PromptBar，accent 与宽度约束保持；无新增控件和样式体系 | — |
| C9 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| C10 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| V1 | 通过 | components/ask-ai-entry.tsx:518：Kit PromptBar，accent 与宽度约束保持；无新增控件和样式体系 | — |
| V2 | 通过 | components/ask-ai-entry.tsx:518：Kit PromptBar，accent 与宽度约束保持；无新增控件和样式体系 | — |
| V3 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| V4 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| V5 | 通过 | components/ask-ai-entry.tsx:518：Kit PromptBar，accent 与宽度约束保持；无新增控件和样式体系 | — |
| V6 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| V7 | 通过 | components/ask-ai-entry.tsx:518：Kit PromptBar，accent 与宽度约束保持；无新增控件和样式体系 | — |
| F1 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| F2 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| F3 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| F4 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| F5 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| F6 | 通过 | components/ask-ai-entry.tsx:518：Kit PromptBar，accent 与宽度约束保持；无新增控件和样式体系 | — |
| D1 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| D2 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| D3 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| D4 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| D5 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| D6 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| E1 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| E2 | 不适用 | components/ask-ai-entry.tsx:518 本次仅修改 composer 裁切；未改页面、菜单、CRUD、表格或状态展示 | — |
| E3 | 通过 | components/ask-ai-entry.tsx:518：Kit PromptBar，accent 与宽度约束保持；无新增控件和样式体系 | — |
| E4 | 通过 | components/ask-ai-entry.tsx:518：Kit PromptBar，accent 与宽度约束保持；无新增控件和样式体系 | — |
| Q1 | 通过 | pnpm check 通过；15 条既有 ref 警告 | — |
| Q2 | 通过 | Chrome 抽屉和全屏实际展开、选择验证；tmp/grok-probe/model-picker.png | — |
| Q3 | 通过 | app/(app)/ref/agent/page.tsx:124 及 Kit PromptBar 原始定位逻辑 | — |
| Q4 | 通过 | 浏览器 error/warn 日志为空，无错误 overlay | — |

## 结论与重验

修复 1 处组件宿主裁切问题。抽屉模式列表可见且可选 sub2api，全屏模式列表可见且可切回默认；未发送新对话。宽度未溢出，console 无新增错误。保留原先默认模型选择。规范检查通过。无新增规范建议。

## Core 0.3.1 升级重验（2026-09-29）

本节取代此前关于“整个输入框上方 Picker”的验收结论。此前仅验证可见性，锚点形态不满足按钮菜单需求。

- 依赖从 0.1.18 固定升级至 npm 已发布的 0.3.1；同步 package.json、pnpm-lock.yaml 及 pnpm 自动生成的该版本 release-age 例外。
- components/ask-ai-entry.tsx 的 PromptBar 新增 modelMenuLabel="选择模型"；复用 core PromptModelMenu，未添加内部 CSS 覆盖。
- 对照 core/src/internal/prompt-model-menu.tsx：按钮锚定、上方 6px、右对齐、288px 有界宽度，Popover 顶层展示。Sources/Commands 独立保留。
- S/O/N/C 重验：宿主结构和 gutter 不变，模型菜单改为独立按钮浮层；右侧选中勾选可见，无链接图标。前表 C6/C7/Q2/Q3 以本节证据为准，其余条目按本次接入范围复核，无新增违规。
- Chrome 抽屉：aria-expanded 切换，默认项 aria-checked=true；方向键 + Enter 可选 sub2api，菜单关闭，焦点返回触发器。
- Chrome 全屏：展开显示 sub2api 已选；Escape 仅关闭菜单，保留全屏，焦点返回触发器；鼠标切回默认模型成功。
- 点击输入区关闭菜单通过。测试后恢复原模型选择，未发送新对话。
- pnpm check 通过（15 条既有 ref 警告）；浏览器 error/warn 日志为空。
- 截图：tmp/grok-probe/core-0.3.1-picker.png。
- 本轮未重新覆盖窄屏及长列表；这些场景由 core 0.3.1 上游测试覆盖的声明不能替代消费端实测。
