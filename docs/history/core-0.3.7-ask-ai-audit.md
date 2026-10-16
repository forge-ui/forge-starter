# Core 0.3.7 与 Ask AI 中文文案审计（2026-10-08）

本审计覆盖此次依赖、文案属性与页头入口改动；功能发布证据另见发布记录。

## 对照物

角色：全局助手及各页标题操作区；Starter AskAiEntry / 当时的页标题封装（现已删除）与 /ref/agent 为对照。工场项目/任务列表采用 chrome B，其他既有紧凑标题采用 A；按原页面角色保留正文骨架。所有交互展示继续使用 core 组件。

## S / O / N / C 分层记录

| 层 | 本次结构 | 判定 |
|---|---|---|
| S | 既有页头、工具带、主体顺序；工场仅在标题行增加 AskAiEntry | 保留页面角色 |
| O | 既有 AppLayout 管正文边距；稳定 portal 宿主保活助手 | 无新增壳或正文 padding |
| N | 既有正文表格/卡片/弹窗；本次未添加节或表外卡 | 无新增包装 |
| C | PromptBar 与 Agent 组件接入 0.3.7 翻译 props | 只使用真实导出属性，中文文案跟随当前中文业务 UI |

## 文件范围

| 文件 | 核查点 |
|---|---|
| components/ask-ai-entry.tsx:823 | 页头槽；原骨架、标题与操作保留；稳定实例换页保活 |
| components/ask-ai-harness.tsx:90 | 新增翻译属性；原回调、权限与数据不变 |
| components/ask-ai-presentation.tsx:22 | 新增翻译属性；原回调、权限与数据不变 |
| components/ask-ai-transcript.tsx:83 | 新增翻译属性；原回调、权限与数据不变 |

## 清单逐条

| ID | 结果 | 证据 / 处置 |
|---|---|---|
| M1 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| M2 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| M3 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| M4 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| M5 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| M6 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| R1 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| R2 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| R3 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| R4 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| R5 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| H1 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| H2 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| H3 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| H4 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| H5 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| H6 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| H7 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| L1 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| L2 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| L3 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| L4 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| L5 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| L6 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| L7 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| L8 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| L9 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| L10 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| C1 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| C2 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| C3 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| C4 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| C5 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| C6 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| C7 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| C8 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| C9 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| C10 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| V1 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| V2 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| V3 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| V4 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| V5 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| V6 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| V7 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| F1 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| F2 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| F3 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| F4 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| F5 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| F6 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| D1 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| D2 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| D3 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| D4 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| D5 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| D6 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| E1 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| E2 | 不适用（本次改动） | 无新增菜单/实体/业务表单/数据接口；既有业务实现未改 |
| E3 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| E4 | 通过（范围内） | components/ask-ai-entry.tsx:1；components/ask-ai-presentation.tsx:19；core 翻译 props、fg token、真实回调；无自研交互层 |
| Q1 | 通过（范围内） | 构建/类型检查与回归记录位于 /tmp/core037-validation；线上截图完成后补录 |
| Q2 | 通过 | pnpm check、生产构建与助手回归通过；见下方发布记录 |
| Q3 | 通过（范围内） | 构建/类型检查与回归记录位于 /tmp/core037-validation；线上截图完成后补录 |
| Q4 | 通过 | Chrome 真实点击页头 Ask AI，最终部署可打开助手，无控制台错误 |

## 样式对照与修复

四端统一 core 0.3.7；PromptBar 来源/指令及任务状态、代码复制、上下文片段、推荐/洞察、流程图、差异计数、确认题翻页均使用翻译属性。ThinkingTrace 与 ToolChips 原本已有中文业务文案。未为未实现的附件/语音/来源查询增加装饰操作。核心默认英文能力保留，当前中文业务页面显式传中文，无新造全站语言切换。

## 重验

生产构建、TypeScript、既有回归已完成；线上截图、console 和入口矩形记录在部署后补录。判定只针对本次差异，不将历史规范债称为已修复。

## 最终发布验证

- core: 0.3.7; 应用源提交 `7351405`。
- Cloudflare version: `64e4f8ac-6182-4ed8-a33d-6e00b56eef92`。
- 66 tests, 0 failures, 0 skips。生产构建通过。
- 已在现有 Chrome 会话验证真实模型问答、模型选择、旧会话恢复，并刷新最终部署再次点击打开；控制台无错误。
- PromptBar / AgentTaskRows 的 en 与 zh 属性已分别通过真实 core SSR 渲染验证。
- 流程图 kindLabels 与推荐 confidenceLabels 已同步；当前中文业务 UI 使用中文属性，不新增全局语言切换。
- 完整验证输出保留在本机 `/tmp/core037-validation/`，没有使用浏览器成功替代测试成功。
