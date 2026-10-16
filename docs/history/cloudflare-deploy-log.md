# Cloudflare 部署记录

这些是 2026-09-28 和 2026-10-08 的上线与验证记录，不是现行步骤。现行部署见 [docs/cloudflare.md](../cloudflare.md)。当时要手跑的 SQL 现在由 `pnpm db:migrate` 覆盖。

## 2026-09-28 迁移准备验证

- OpenNext 1.20.6 / Next.js 16.3.6 / Wrangler 4.142.0 构建通过。
- `pnpm check` 通过，保留 15 条既有参考页颜色警告；AI 续办 6 项测试通过。
- 本地 Workers 使用现有 Docker PostgreSQL，连续三轮并发读取账号、角色和 Ask AI 模型接口均返回 200；未登录账号请求返回 401。
- 修复迁移前预览中跨请求连接复用导致的接口 500 / 挂起。

## 2026-09-28 Neon 与 Workers 上线验证

- 新建 Neon 免费项目 `forge-starter`（`steep-dawn-93987117`），新加坡区域，PostgreSQL 18，production 分支。已初始化 schema、基础权限和独立管理员，未迁移历史项目的数据或模型密钥。
- 云端通过 Hyperdrive `forge-starter-db` 连接 Neon，关闭 SQL 查询缓存。直接 Node.js TLS 连接在 Workers 中有兼容性错误，生产配置使用 Hyperdrive 处理源站 TLS 和连接池。
- 临时地址：`https://forge-starter.hesongworkmail.workers.dev`。Workers 版本：`00e9180b-1127-4af5-9a24-932dfb52e28a`。
- 真实密码登录 200、匿名账号请求 401、关闭注册 403；连续两轮并发读取权限、账号、角色、Ask AI 运行配置均为 200。
- 业务账号新建 201、详情 200、修改和再次读取持久化通过、删除 200、删除后 404；测试记录已清理。
- 浏览器真实登录和侧栏到账号列表通过。当前是新数据库，业务账号和模型目录为空。
- 连接串与随机生成的初始管理员密码仅保存在本地已忽略的 `.env.production.local`，密码字段为 `BOOTSTRAP_ADMIN_PASSWORD`；云端凭据使用 Worker secrets / Hyperdrive 配置。
- 正式地址：`https://starter.forgeui.org`。原 GitHub CNAME 已替换为 Workers Custom Domain；HTTPS、真实登录、侧栏账号列表及深链刷新通过，正式域名 API 并发查询和完整 CRUD 持久化复测通过，测试记录已清理。
- GitHub Pages 已禁用（删除配置返回 204，复查返回 404）；正式域名继续返回 200。原 Pages 设置与 DNS 记录保存在本地忽略目录 `.gstack/qa-2026-09-28/`。
- 用户明确确认后，已永久删除 Neon 旧项目 am team、justlogo、ccshop、scria、supa、mcpchat 及其数据。刷新组织列表确认只剩新建的 `forge-starter`。

## 2026-10-08 安全修复升级

发布此版本前，在目标 Neon 库执行 `docs/history/sql/20261008_security_sessions.sql`。该迁移仅新增 `auth_sessions` 及索引，并将未来登录用户插入的角色默认值改为 `readonly`；既有用户角色、授权和业务数据保留。旧 local JWT 需重新登录。运行时不会再补回角色授权，首次空库使用显式 `pnpm db:seed`，升级现有库无需重新初始化角色。

恢复链接只经 SMTP 发到注册邮箱；未配置 SMTP 时公开接口返回统一说明。编辑模型供应商或实际调用地址须显式提供新密钥。Compose 的 loopback 绑定和数据库密码设置适用于本地 Docker；生产 Neon 连接继续使用既有 Hyperdrive 配置。
