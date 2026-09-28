# Cloudflare Workers 部署

本项目通过 OpenNext 部署完整 Next.js 服务到 Workers。账号 CRUD、登录和 Ask AI 仍使用 PostgreSQL；Cloudflare D1 不兼容本项目的数据库约定。

## 构建和预览

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build:cloudflare
pnpm preview:cloudflare
```

本地预览地址默认是 `http://localhost:8787`。预览变量放在已忽略的 `.dev.vars`。构建脚本会清除 OpenNext 自动序列化的本地环境变量，避免把开发机密钥打入上传包；云端变量只从 Workers bindings/secrets 获取。预览成功不代表云端已配置同样的变量。

配置 Hyperdrive 后，预览脚本使用本地 `.env` 的 PostgreSQL 连接，也可通过进程环境变量 `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` 覆盖。云端走 Hyperdrive 连接 Neon，查询缓存关闭，避免 CRUD 保存后读到旧值。发布脚本同时处理 OpenNext 发布阶段的本地代理初始化；本地连接不会上传到 Hyperdrive。

`worker.ts` 在每次请求内建立数据库上下文，`lib/db/index.ts` 在该上下文内复用连接，请求结束后通过 `waitUntil` 关闭。普通 Next.js / Node.js 运行仍使用进程连接池，不能将 Workers 的连接改回跨请求共享。

## 云端配置

1. 准备 Workers 能连接的 PostgreSQL，使用独立数据库，并对该目标运行本仓 schema 初始化。`127.0.0.1` 的 Docker 数据库仅供本机测试，不能作为云端地址。不要把本机模型密钥或业务数据自动复制到公开演示环境。
2. 在 Cloudflare 设置 `DATABASE_URL` 和随机生成的 `AUTH_SECRET` 为 Worker secrets。密钥不要写进 `wrangler.jsonc` 或版本库。可通过 `pnpm exec wrangler secret put DATABASE_URL` 和 `pnpm exec wrangler secret put AUTH_SECRET` 交互录入。
3. `wrangler.jsonc` 默认使用真实用户登录 `AUTH_MODE=local`，并设置 `REGISTRATION_ENABLED=false` 关闭公开注册。初始管理员需在目标数据库中初始化。需要开放演示登录时应明确选择该模式并使用独立演示数据库；demo 模式同样需要数据库。
4. 需要模型或邮件服务时，配置服务端 `ASK_AI_LLM_*` / `SMTP_*` 变量和相应 secrets。模型管理页登记的模型配置存储在数据库。
5. 执行 `pnpm deploy:cloudflare`，先用部署返回的 `workers.dev` 地址验证。这个命令会重新构建，避免发布旧产物。

## 域名切换顺序

目标域名为 `starter.forgeui.org`。Wrangler 暂未声明域名，避免第一次部署就覆盖 GitHub Pages 旧站。

1. 在 Workers 临时域名验证登录、CRUD、刷新持久化、权限和 Ask AI。
2. 保存 GitHub Pages 设置及原 DNS 记录，给 Worker 添加该自定义域名，并替换原 GitHub CNAME。
3. 验证 HTTPS、自定义域名、静态资源和深链刷新。
4. 新站验证通过后禁用 `forge-ui/forge-starter` 的 GitHub Pages。

## 2026-09-28 迁移准备验证

- OpenNext 1.20.6 / Next.js 16.3.6 / Wrangler 4.142.0 构建通过。
- `pnpm check` 通过，保留 15 条既有参考页颜色警告；AI 续办 6 项测试通过。
- 本地 Workers 使用现有 Docker PostgreSQL，连续三轮并发读取账号、角色和 Ask AI 模型接口均返回 200；未登录账号请求返回 401。
- 修复迁移前预览中跨请求连接复用导致的接口 500 / 挂起。
- 上述为迁移准备阶段的本地验证，线上进展见下。

## 2026-09-28 Neon 与 Workers 上线验证

- 新建 Neon 免费项目 `forge-starter`（`steep-dawn-93987117`），新加坡区域，PostgreSQL 18，production 分支。已初始化 schema、基础权限和独立管理员，未迁移历史项目的数据或模型密钥。
- 云端通过 Hyperdrive `forge-starter-db` 连接 Neon，关闭 SQL 查询缓存。直接 Node.js TLS 连接在 Workers 中有兼容性错误，生产配置使用 Hyperdrive 处理源站 TLS 和连接池。
- 临时地址：`https://forge-starter.hesongworkmail.workers.dev`。Workers 版本：`654b6245-41df-4ba5-8f4d-09ade5dad67b`。
- 真实密码登录 200、匿名账号请求 401、关闭注册 403；连续两轮并发读取权限、账号、角色、Ask AI 运行配置均为 200。
- 业务账号新建 201、详情 200、修改和再次读取持久化通过、删除 200、删除后 404；测试记录已清理。
- 浏览器真实登录和侧栏到账号列表通过。当前是新数据库，业务账号和模型目录为空。
- 连接串与随机生成的初始管理员密码仅保存在本地已忽略的 `.env.production.local`，密码字段为 `BOOTSTRAP_ADMIN_PASSWORD`；云端凭据使用 Worker secrets / Hyperdrive 配置。
- `forgeui.org` 已有 Forge 网站；最终根域名或子域名待用户确认，因此未修改 DNS、未下线 GitHub Pages。历史 Neon 项目删除也待不可逆操作确认。

参考：[Cloudflare Next.js](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)、[OpenNext 配置](https://opennext.js.org/cloudflare/get-started)。
