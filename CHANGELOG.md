# 更新日志

版本以 `package.json` 为准。0.8.0 之前没有单独的更新日志，这里不补写。

## Unreleased

### 交互底层

- 升级 `@forge-ui-official/core` 到 0.11.4：弹窗、下拉、菜单、提示、通知等交互换成 Base UI 内核，外观和用法不变。删除等确认弹窗点外面不再关闭。
- 同步 forge-skill 到 core 0.11.4 对应版本。
- 升级 `@forge-ui-official/core` 到 0.11.5，同步 forge-skill 到对应版本。
- 七处删除确认改用 `ConfirmationDialog` 自带的弹窗，不再套 Modal。点外面不会关闭，必须点取消或确认，按 Esc 等同取消。

### 排版

- 升级 `@forge-ui-official/core` 到 0.10.1：正文字体换成 Inter，字距归零，黑和灰改为中性色，14px 及以下不再用粗体。布局不变。
- 根布局改为加载 `@fontsource-variable/inter` 并设置 `--font-inter`，去掉 `<html>` 上的 `antialiased`。
- 业务页和参考页里 14px 及以下的半粗、粗体统一为 medium。
- 权限、角色、菜单三个列表页的名称列改为占 32% 宽度，「操作」表头右对齐。
- 同步 forge-skill 到 core 0.10.1 对应版本。

### 深色模式

- 升级 `@forge-ui-official/core` 到 0.8.0：深色模式、弹窗里菜单被遮挡的修复，以及智能体对话组件（0.7.0）。
- 侧栏新增「外观」：浅色、深色、跟随系统三选一，保存在当前浏览器。所有登录用户可见，不受角色权限控制。
- 根布局在页面渲染前读取偏好，深色不会先闪一下浅色；其他标签页和系统深浅色变化会同步。
- 同步 forge-skill 到 core 0.8.0 对应版本。

### 安全

- 生产进程拒绝 `AUTH_MODE=demo`。没写 `AUTH_MODE` 时开发环境仍是 demo，生产里同样算 demo，会拒绝启动。
- 生产进程缺少 `AUTH_SECRET` 时拒绝启动。密钥最短 32 位；写短了不会再退回内置演示密钥。
- 确要在生产跑公开演示时，设置 `ALLOW_INSECURE_AUTH=true`。`AUTH_MODE=local` 即使开了这个开关，仍然要 32 位密钥。
- Workers 没有单独的进程入口，第一次请求就会做同样的检查。

### 数据库

- 新增 `pnpm db:migrate`。当前结构在 `migrations/0000_baseline.sql`，用 Drizzle 的迁移记录，重复执行会跳过已应用的文件。
- 这份 SQL 对已有库也尽量安全：已有表、索引、外键会跳过，以前要手跑的 `revision`、harness 列、会话表和 `role_code` 默认值会补上。
- 原来的三份手写 SQL 留在 `docs/history/sql/`，不再作为入口。
- `drizzle.config.ts` 不再在缺少 `DATABASE_URL` 时连到写死的本机库。
- `pnpm db:push` 只用于开发库。`NODE_ENV=production` 时默认拒绝，除非 `ALLOW_DB_PUSH=true`。

### 测试与工程

- `pnpm test` 会跑 `tests/` 下全部 `*.test.ts`。需要数据库的用例仍要求本机 `forge_semantic_test_*` 库；没配时会 skip，不要把 skip 当成测过。
- CI 安装依赖、跑 typecheck、规范绊线，并用 Postgres 16 跑测试。
- `package.json` 写明 `engines`、`packageManager` 和 `license`。
- 本变更没有加 ESLint。

### 文档

- 按仓库里的实际模块重写了 README。
- 一次性审计和修复记录挪到 `docs/history/`。`docs/` 根目录留下还在用的规范。
- 新增 `docs/README.md`，说明人和 Agent 各先读什么。

## 0.8.0

Ask AI 接上了 Forge Agent 组件和可恢复的 harness：任务能停下来等人选择或在页面上确认，保存成功后再继续同一会话。模型服务可以登记 Grok，Forge core 升到当时的 0.3.1。

升级和验证细节见 [docs/history/release-0.8.0.md](docs/history/release-0.8.0.md)。那里提到的手写 SQL 已被上面的 `pnpm db:migrate` 取代。
