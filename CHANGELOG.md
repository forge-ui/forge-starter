# 更新日志

版本以 `package.json` 为准。0.8.0 之前没有单独的更新日志，这里不补写。

## Unreleased

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
