# 通用规范版本同步

检查时，core 依赖为 `file:` / `link:` / `workspace:`（实际版本从已安装包读取），或精确版本高于副本版本，进入明确的“开发模式”：仍严格验证已有副本的清单和 SHA-256，但不因该版本差异使 `pnpm check` 失败，也不执行远端漂移检查。缺失/损坏副本、无效实际版本仍失败。请执行 `corepack pnpm sync:forge-skill --from <匹配当前 core 的已提交 Forge checkout> --ref <commit>`，或 `corepack pnpm sync:forge-skill --ref <匹配版本的 commit>`，同步并审查差异；不能把提示当成当前 core 的兼容性验证。精确正式版本与副本相同继续严格检查，低于副本仍失败；范围依赖不接受。同步写入本身始终要求源 core 与当前实际版本一致。

唯一正文是 [主仓 forge-skill](https://github.com/forge-ui/forge/tree/main/skills/forge-skill)。Starter 的角色、宿主、菜单、权限、数据库与检查差异留在本仓，不另写通用规范。

```sh
corepack pnpm sync:forge-skill
corepack pnpm sync:forge-skill --ref <匹配当前-core-版本的提交或标签>
corepack pnpm sync:forge-skill --from <本地主仓-checkout> [--ref <已提交-revision>]
corepack pnpm check:forge-skill
```

同步脚本先将上游 ref 解析为固定 Git commit，再核 `core/package.json` 版本与本仓精确依赖一致，下载完整 `skills/forge-skill/`。必需入口为 `SKILL.md` 和 `references/audit-checklist.md`，未迁移完成时停止，禁止把本地旧规范改名冒充来源。默认源 main；维护旧版 core 时显式选兼容 revision，不推测标签命名。

成功后生成 `upstream/` 原文副本及 `manifest.json`（仓库、core 版本、源 ref、固定 revision、逐文件 SHA-256），一并提交。不要手改 `upstream/`。通用规则引用本目录的 `upstream/SKILL.md`、`upstream/references/audit-checklist.md`，角色与线框参考 `upstream/references/page-recommended-standard.md` / `page-design-dimensional.md`。

`pnpm check` 与 CI 同时核本地摘要及同一 core 版本来源的规范漂移；网络连接/传输失败时打印 SKIP、不失败。已有副本通过本地校验后，GitHub 明确限流（HTTP 429 或 403 且 `x-ratelimit-remaining: 0`）也明确 SKIP，恢复后重跑；普通 403 仍失败。离线仍检查已有副本的版本、清单、摘要，不允许以离线掩盖本地改写。除下述本地来源未发布场景，HTTP 404、版本不匹配、缺必需文件、摘要漂移均失败。SKIP 不能当完整漂移校验通过。

本地模式只读取 Git 已提交内容，拒绝来源 `core/package.json` 或 `skills/forge-skill/` 的未提交改动（包括未跟踪文件），同样校验版本、完整清单和 SHA-256；manifest 用 `sourceKind: checkout`、`sourceRef` 和固定 `revision` 记录来源，不保存机器绝对路径。无 `--ref` 时使用 checkout 的 HEAD。

本地来源尚未 push 时，默认远端检查查询已记录的固定 revision；仅该提交查询返回 HTTP 404/422 时明确 SKIP，且仍先验证本地副本。其他 HTTP 错误、文件缺失及摘要漂移仍失败。上游发布后重跑远端检查；需要追踪更新时显式 `--ref main` 或重新同步。未同步或无法打开主清单时，只能报告 Starter 局部核查，不能宣称完整规范审计通过。
