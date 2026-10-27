# 文档索引

`docs/` 根目录只放还在生效的规范。某次页面改完后的审计、修复和发布记录在 [history/](history/)。那些记录能帮你看当时为什么这么改，不要把它们当成现在的做法。

## 人先读什么

1. 仓库根目录的 [README](../README.md)：这个 starter 为什么存在、适合谁、不做什么、怎么跑起来。
2. [setup.md](setup.md)：环境变量、数据库、命令。准备动手时再看。
3. [product.md](product.md)：范围和已经定下来的取舍。

然后按你正在做的事挑：

| 你在做 | 读 |
| --- | --- |
| 加一个业务模块 | [module-template.md](module-template.md)，再看 [page-roles.md](page-roles.md) |
| 选组件、对视觉 | [forge-components.md](forge-components.md) |
| 画整页/布局结构尺寸图 | `.agents/skills/dimensional-drawing`（audit / new-page 必用；缺图审计 FAIL；不进 runtime；Kit 示例在 forge 仓；上游 MIT） |
| 页面做完，要按规范查 | [audit-checklist.md](audit-checklist.md) |
| 看布局参考 | [reference-pages.md](reference-pages.md)，开发环境打开 `/ref/` |
| 接 Ask AI 的任务和确认 | [ask-ai-harness.md](ask-ai-harness.md)、[ask-ai-agent-components.md](ask-ai-agent-components.md) |
| 让助手理解业务字段和动作 | [agent-semantic-foundation.md](agent-semantic-foundation.md) |
| 部署到 Workers | [cloudflare.md](cloudflare.md) |

## Agent 先读什么

先读仓库根目录的 [AGENTS.md](../AGENTS.md)。它点名的必读是：

- [product.md](product.md)
- [agent-native.md](agent-native.md)
- [module-template.md](module-template.md)
- [page-roles.md](page-roles.md)
- [forge-components.md](forge-components.md)
- [audit-checklist.md](audit-checklist.md)

做完页面再按 `.agents/skills/forge-starter-audit/SKILL.md` 对照清单。`pnpm check` 通过不等于审计做完。

不要从 `history/` 里抄页面。那里的结论有的已经被后来的规范改过。
