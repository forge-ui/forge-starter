# 已退役的手写 SQL

这三份脚本是 `pnpm db:migrate` 出现之前的增量。当时要按库手工执行，文件名也不统一。

它们的效果已经收进 `migrations/0000_baseline.sql`：新库会建出当前结构；已有库会跳过现成的表，并补上 `revision`、harness 列、`auth_sessions` 和 `users.role_code` 的默认值。

留下原文，是为了能对上当时的发布记录。不要再把它们当作迁移入口。
