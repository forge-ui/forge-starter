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

1. 准备 Workers 能连接的 PostgreSQL，使用独立数据库，并对该目标执行 `pnpm db:migrate`。不要用 `db:push`。`127.0.0.1` 的 Docker 数据库仅供本机测试，不能作为云端地址。不要把本机模型密钥或业务数据自动复制到公开演示环境。
2. 在 Cloudflare 设置 `DATABASE_URL` 和随机生成的 `AUTH_SECRET`（至少 32 位）为 Worker secrets。密钥不要写进 `wrangler.jsonc` 或版本库。可通过 `pnpm exec wrangler secret put DATABASE_URL` 和 `pnpm exec wrangler secret put AUTH_SECRET` 交互录入。
3. `wrangler.jsonc` 默认使用真实用户登录 `AUTH_MODE=local`，并设置 `REGISTRATION_ENABLED=false` 关闭公开注册。生产进程会拒绝 demo，也会拒绝没有密钥的启动。初始管理员需在目标数据库中初始化。确要开放演示登录时设置 `ALLOW_INSECURE_AUTH=true`，并使用独立演示数据库；demo 模式同样需要数据库。
4. 需要模型或邮件服务时，配置服务端 `ASK_AI_LLM_*` / `SMTP_*` 变量和相应 secrets。模型管理页登记的模型配置存储在数据库。
5. 执行 `pnpm deploy:cloudflare`，先用部署返回的 `workers.dev` 地址验证。这个命令会重新构建，避免发布旧产物。

## 域名切换顺序

正式域名为 `starter.forgeui.org`，已在 `wrangler.jsonc` 声明 Workers Custom Domain。根域名 `forgeui.org` 保留原网站。以下切换步骤已完成。

1. 在 Workers 临时域名验证登录、CRUD、刷新持久化、权限和 Ask AI。
2. 保存 GitHub Pages 设置及原 DNS 记录，给 Worker 添加该自定义域名，并替换原 GitHub CNAME。
3. 验证 HTTPS、自定义域名、静态资源和深链刷新。
4. 新站验证通过后禁用 `forge-ui/forge-starter` 的 GitHub Pages。

发布前在目标库执行 `pnpm db:migrate`。已有库会补上 `auth_sessions`，并把以后新用户的 `role_code` 默认值保持为 `readonly`；既有用户角色和业务数据保留。旧 local JWT 需重新登录。运行时不会再补回角色授权。空库首次使用显式 `pnpm db:seed`，升级现有库不必为了补表再初始化角色。

恢复链接只经 SMTP 发到注册邮箱；未配置 SMTP 时公开接口返回统一说明。编辑模型供应商或实际调用地址须显式提供新密钥。Compose 的 loopback 绑定和数据库密码设置适用于本地 Docker；生产 Neon 连接继续使用既有 Hyperdrive 配置。

当时的上线记录和一次性迁移说明在 [history/cloudflare-deploy-log.md](history/cloudflare-deploy-log.md)。

参考：[Cloudflare Next.js](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)、[OpenNext 配置](https://opennext.js.org/cloudflare/get-started)。
