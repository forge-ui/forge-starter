# 仓库与应用语义底座 V1

本期覆盖业务账号和模型工作台。Coding Agent 在本地读取源码索引；后台 Ask AI 只接收公开业务声明和当前页面状态，通过已登记工具行动。两条路径共享业务标识，权限仍由服务端检查。

## 使用

```sh
pnpm semantic build
pnpm semantic describe-entity accounts
pnpm semantic trace-action accounts.update
pnpm semantic find-references updateAdminAccount
pnpm semantic impact accounts.department
```

输出位于被 Git 忽略的 `.semantic/`。每个源码事实包含相对路径、行号、内容 hash，关系标注 extracted 或 declared。查询时重新计算指纹，内容变化后重建，不使用失效缓存。动态 URL 等不能证明的关系进入 unresolved。

`impact` 的 requiredReview 是字段变更必审位置，包含 schema、input、service、API、表单、store、页面和工具；它不是“这些文件一定要修改”的证明。find-references 使用 TypeScript 符号解析，能区分别名、重导出和同名符号。当前不是跨语言分析器，不承诺动态调用、反射、字符串拼接的完整性。

## 页面与保存

`useSemanticPage` 暴露页面类型、当前实体、查询条件、表单占用状态和页面版本，不收集表单值、密钥或 DOM。`buildId` 在 Next 构建/启动时由源码指纹生成；请求与部署不兼容时拒绝。开发热更新后的指纹代表本次启动版本，正式部署必须重新 build。

- “当前筛选结果”通过 `scope=page` 绑定页面实际条件，忽略分页。
- 页面筛选/open 经确认后交给通用指令通道。收到页面 ACK 才报告成功，超时清除待执行指令。
- “这条/这个/当前账号”等中文指代在无当前实体时保守澄清；这不是任意语言意图识别的完备证明。
- 账号修改工具接收部分字段，服务端补齐原值；备注缺省不清空。
- 创建/修改/删除仍在原页面表单完成；数据工具没有直接写库能力。
- 确认单绑定用户、页面实例/版本与记录 revision。确认时再次检查权限与记录；保存使用 If-Match。
- 实际写入与 committed 回执在同一 PostgreSQL 事务；同 operationId 或 Idempotency-Key 同内容返回原回执，不同内容返回 409。
- 提交后读回记录 revision（删除则确认不存在），成功标 verified；后续记录已变化时保留 committed，不重复执行。
- 用户修改草稿后的最终保存值进入回执。客户端保留待续办 operationId，刷新后查服务端状态恢复；清空 sessionStorage 或换设备后的任务发现不在 V1 范围。

状态：confirmed → awaiting-save → committed → verified；未保存可 cancelled，十分钟后禁止执行。verified 表示该时点读回一致，不表示记录此后永远不变。操作表目前没有自动清理任务；清理必须保留所需的幂等窗口和审计期。

## 数据库与启用顺序

**必须先应用增量迁移，再运行新代码。** `revision` 是账号读写的基础列，即使 `SEMANTIC_ENABLED=false` 也需要；该开关控制持久化操作/回执及强制 If-Match，不回退数据库 schema、页面上下文或共享校验。

1. 在明确选定的环境备份并检查 `DATABASE_URL`。
2. 执行 `migrations/semantic-v1.sql`。它只增加 revision 与 semantic_operations，不删除旧数据。
3. 部署新代码；按环境设 `SEMANTIC_ENABLED=true`。客户端正常表单自动发送幂等键和 revision。
4. 自定义 API 客户端：POST 带 UUID `Idempotency-Key`；PATCH/DELETE 还须 `If-Match: <revision>`。确认驱动的页面用 `X-Operation-Id`。
5. 回滚应用时可保留新增表/列。关闭开关恢复旧保存协议，但也关闭幂等/强制并发检查，不能作为数据完整性保证。

2026-09-28：本地复验通过后，已完成生产增量迁移并启用 SEMANTIC_ENABLED；发布和验证证据见 `docs/agent-semantic-release.md`。

## 接入新模块

1. 先完成原来的 module/service/API 与共享 Zod 输入规则。
2. 在 `lib/semantic/contracts.ts` 登记 entity/table/fields/actions/sources，fields 仅公开业务字段。
3. 工具参数用 `toolParameters(schema)` 派生；运行时仍 parse，同一模块的列表、页面、导出复用过滤函数。
4. 页面用 `useSemanticPage` 提供白名单状态和动作适配器。适配器加载未完成返回 false；冲突抛出中文错误；接收成功返回 true。不得改通用循环加入模块分支。
5. 写操作接入持久化事务回执与该实体的读回验证；V1 账号为参考。模型管理仅支持查询、筛选、打开详情，未开放模型配置写入。
6. 补符号解析、JSON/HTTP、权限、并发、浏览器与实际模型案例，执行 Forge 审计。

## 架构决策

| ADR | 决定 | 原因 / 取舍 |
|---|---|---|
| 01 | ts-morph 27.0.2（MIT），只在开发索引器使用 | 利用真实 TS 符号，业务运行时不加载解析器 |
| 02 | 显式业务声明 + 静态事实 | 业务语义由人登记；不把推测关系包装成源码事实 |
| 03 | 本地 JSON 图，未引入图数据库/向量数据库 | 当前仓库规模可重建，降低运维成本 |
| 04 | 指纹缓存 + 变更时保守全图重建 | 避免增量失效遗漏；尚未实现逐文件局部重算 |
| 05 | 页面状态协议 + 原表单确认 | 复用 Forge UI 和原业务校验，隔离页面接收与数据库提交 |
| 06 | PG 事务操作账本 + 乐观锁 | 跨进程去重与恢复；不依赖进程内 Set 证明数据写入 |
| 07 | 构建指纹匹配，源码索引不进入生产 Prompt | 限制信息暴露；旧页面请求须刷新。开发索引服务不可用不影响人工 CRUD |

## 复验

`pnpm check`、`pnpm exec tsx scripts/test-agent-fill.ts`、`pnpm test:semantic`。
数据库与 HTTP 测试在缺少隔离测试环境时会 skip，不能把 skip 当通过。完整执行使用被忽略的 `.semantic/test.env` 与 `scripts/semantic-test-env.mjs`（只允许 localhost 的 forge_semantic_test_* 库）；HTTP origin 只允许本地 3167（Node）或 3168（Workers）。不要把测试环境文件提交。

真实模型评测脚本 `scripts/semantic-model-eval.ts` 每个案例运行两轮，保存工具轨迹；仅使用隔离库的合成数据。它验证工具选择、参数与确认单，不代替浏览器保存验收。评测会调用当前配置的模型。
