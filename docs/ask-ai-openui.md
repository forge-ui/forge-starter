# Ask AI × OpenUI（PoC）

这是一条报销结果的流式结构化回复，不是整仓替换 Ask AI。对比日期：2026-10-20。数据来自两个仓库的 GitHub API 与当时的 `main`。

## 对比

| | [thesysdev/openui](https://github.com/thesysdev/openui) | [thesysdev/open-intelligent-ui](https://github.com/thesysdev/open-intelligent-ui) |
| --- | --- | --- |
| 是什么 | 生成式 UI 的语言和运行时。npm 包从这里发布。 | 用 OpenUI 做的 Intelligent UI 示例应用：地图、图表、可交互工具。 |
| 许可证 | MIT（Copyright 2011-2024 Thesys Inc.） | MIT（Copyright 2026 Thesys Inc.） |
| 要装什么 | `@openuidev/react-lang`（本 PoC 锁定 1.0.1）。它自带 `@openuidev/lang-core`。可选 `@openuidev/react-ui` 才是整套聊天壳。 | 应用自己依赖 `@openuidev/react-lang`、`@openuidev/lang-core`、`@openuidev/react-ui`。没有单独的 npm 包。 |
| 接入成本 | 定义小组件库，用 `library.prompt()` / `generateSystemPrompt` 出提示词，用 `Renderer` 吃累计文本。可以只接这一层。 | 默认是整页 `AgentInterface` + 自建主题。另外提供 `/gallery` 手写程序，以及 `LLM_BASE_URL` 直连 Chat Completions。整页搬进来会换掉 Ask AI 壳。 |
| 流式结构化 UI | `Renderer` 的 `isStreaming` 按累计 OpenUI Lang 重绘。语言比 JSON 更短，边到边画。 | 同一套语言。聊天接口把模型增量转成流；画廊不调用模型，直接渲染手写程序。 |
| 和 Forge / Ask AI | 渲染器不带自己的业务壳。组件可以画成 `StatusBadge`、`DataTable` 和 `fg-*`。 | 示例壳是另一套聊天界面和 token。和现有 Ask AI、Forge 色板不是同一套。 |
| 维护 | 2024-12 创建，2026-10-19 仍有提交。约 12340 star、833 fork。包每周有发布。 | 2026-10-08 创建，2026-10-17 仍有提交。约 691 star、50 fork。它跟随 OpenUI 1.0，不是另一套标准。 |

两边都是 MIT，都可以 fork。Intelligent UI 的默认云路径要 `THESYS_API_KEY`（OpenUI Gateway）。它的直连和画廊路径不需要这把钥匙。Gateway 会替模型改写语言；直连时模型写什么就渲染什么。

## 推荐

**组合，不二选一。**

- 运行时只用 OpenUI 的 `@openuidev/react-lang`。不安装 `@openuidev/react-ui`，不用 `AgentInterface`。
- 接法照 Intelligent UI：自定义组件库、服务端 `library.prompt()`（与它的 `generateSystemPrompt` 同一条提示词能力）、现有 Chat Completions 流式输出、`Renderer` 按累计文本重绘。
- 没有可用模型时，播放一段手写 OpenUI Lang。这和它的 `/gallery` 一样，不经过付费网关。
- 卡片和表格用 Forge 的 `StatusBadge`、`DataTable` 和 `fg-*`。Ask AI 的壳、会话和工具循环不动。

## 怎么看

1. 按仓库 README 启动：`pnpm install && pnpm db:migrate && pnpm db:seed && pnpm dev`。
2. 登录后打开任意后台页，点右上角 Ask AI。
3. 输入：**用 OpenUI 展示报销结果**。只要句子里同时有 `openui` 和「报销」就会走进这条路径。
4. 没有可用模型时，会逐段画出内置的差旅报销卡片和明细表。模型管理或 `ASK_AI_LLM_*` 有可用模型时，同一渲染器改画模型写出的 OpenUI Lang；写坏了就退回内置样例。

未接模型时，问一句落在四条本地示例之外的问题，回复末尾也会提到这句触发语。

## 限制

- 只登记了 `ExpenseResult`、`ExpenseCard`、`ExpenseTable`。不能画地图、图表或表单。
- 这条触发语不走原有工具循环，也不写入 harness 会话。刷新后这条卡片不会从运行记录里恢复。
- 不调用 Thesys Gateway，因此没有它的自动纠错。
- 开发模式下本包会尝试挂 Inspect 浮层。`lib/openui/skip-devtools.ts` 在导入渲染器之前关掉它，避免盖住后台壳。生产构建里该浮层本来就会被去掉。
- `@openuidev/lang-core` 的 postinstall 只做安装遥测，本仓库在 `pnpm-workspace.yaml` 里关掉了，不需要跑它。
