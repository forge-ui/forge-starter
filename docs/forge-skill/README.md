# 通用规范版本同步

唯一正文是 [主仓 forge-skill](https://github.com/forge-ui/forge/tree/main/skills/forge-skill)。Starter 的角色、宿主、菜单、权限、数据库与检查差异留在本仓，不另写通用规范。

```sh
corepack pnpm sync:forge-skill
corepack pnpm sync:forge-skill --ref <匹配当前-core-版本的提交或标签>
corepack pnpm check:forge-skill
```

同步脚本先将上游 ref 解析为固定 Git commit，再核 `core/package.json` 版本与本仓精确依赖一致，下载完整 `skills/forge-skill/`。必需入口为 `SKILL.md` 和 `references/audit-checklist.md`，未迁移完成时停止，禁止把本地旧规范改名冒充来源。默认源 main；维护旧版 core 时显式选兼容 revision，不推测标签命名。

成功后生成 `upstream/` 原文副本及 `manifest.json`（仓库、core 版本、源 ref、固定 revision、逐文件 SHA-256），一并提交。不要手改 `upstream/`。通用规则引用本目录的 `upstream/SKILL.md`、`upstream/references/audit-checklist.md`，角色与线框参考 `upstream/references/page-recommended-standard.md` / `page-design-dimensional.md`。

`pnpm check` 与 CI 同时核本地摘要及同一 core 版本来源的规范漂移；仅网络连接/传输失败时打印 SKIP、不失败。离线仍检查已有副本的版本、清单、摘要，不允许以离线掩盖本地改写。HTTP 404、版本不匹配、缺必需文件、摘要漂移均失败。SKIP 不能当完整漂移校验通过。

本轮主仓新目录及统一清单尚未在远端 main 提供，暂不伪造同步副本；主仓迁移合并后执行上述同步并补交生成文件。未同步或无法打开主清单时，只能报告 Starter 局部核查，不能宣称完整规范审计通过。
