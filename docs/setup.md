# 本地安装与环境

README 只给最短路径。本文是环境变量、目录和命令的完整说明。

## 依赖

- Node.js 22.14 或更新（`package.json` 的 `engines`）
- [pnpm](https://pnpm.io) 11（版本以 `packageManager` 为准）
- Docker（跑 Postgres；也可用自己的库，把 `DATABASE_URL` 改成实际连接串）

## 最短路径

顺序必须是：先配置环境变量与数据库密码，再起数据库、安装依赖并同步 schema。

```bash
cp .env.example .env
# 编辑 .env：设置唯一 POSTGRES_PASSWORD，并同步 DATABASE_URL
docker compose up -d
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

打开 `http://localhost:3000`。

`pnpm db:migrate` 依赖已安装的 `drizzle-kit`，所以必须在 `pnpm install` 之后。compose 起来后若立刻失败，等几秒等 Postgres 健康检查通过再试（`docker compose up -d --wait` 会等到 healthy）。再执行一次是安全的，已经记过的迁移会跳过。

`pnpm db:push` 只用于开发库：它按当前 schema 直接改表，不写迁移记录。`NODE_ENV=production` 时默认拒绝。新环境、CI 和生产用 `pnpm db:migrate`。

Compose 仅监听 `127.0.0.1:5432`，要求设置独立的 `POSTGRES_PASSWORD`。把密码的 URL 编码值同步到 `DATABASE_URL`。可用 `openssl rand -hex 32` 生成随机密码。已有数据卷不会因环境变量改变而自动更换数据库密码，需由运维显式轮换。

## demo 和 local

| | `AUTH_MODE=demo`（默认） | `AUTH_MODE=local` |
|--|--------------------------|-------------------|
| 登录 | 任意用户名/邮箱 + 密码即可进后台 | 走 Postgres `users` 表，需先注册 |
| 侧栏角色 | 见下方种子角色表。用户名 `admin` / `operator` / `auditor` / `readonly`（及中文别名）映射种子角色；**其余用户名默认超级管理员（全开）**。无库时回退种子授权 | `users.role_code`（**默认 `readonly`**）；公开注册固定只读角色。管理员须由受信任运维显式分配库字段，不是业务账号 `admin_accounts.role` |
| `AUTH_SECRET` | 未设时用内置演示密钥。写了就必须至少 32 位 | **必填**，至少 32 位 |
| 业务 CRUD | **仍要** `DATABASE_URL` + `pnpm db:migrate` | 同左 |
| 登录守卫 | 默认强制。未登录打开后台会进登录页，不出现访客壳（`AUTH_GUARD=false` 可关） | 默认强制登录 |

### 种子角色与侧栏（管理员 / 合理默认）

侧栏可见 = **菜单三处** ∩ 当前应用勾选 ∩ 角色 `{module}:read`。无 `:read` 的模块不出现；直链业务页由壳层 `replace` 回工作台，不要停在空态/403 列表。不是完整 IAM（没有用户-角色管理 UI）。

| 角色码 | 演示登录用户名（及别名） | 侧栏可见 | 写操作 |
|--------|--------------------------|----------|--------|
| `super_admin` | `admin` / `super_admin` / `管理员`；**任意未识别用户名** | 全部模块 | 全部 |
| `operator` | `operator` / `运营` | 工作台、账号、应用 | 账号可写；无 RBAC 目录 |
| `auditor` | `auditor` / `审计` | 全部模块 | 只读（无发起/通过/改配置） |
| `readonly` | `readonly` / `只读` | 工作台、账号 | 无 |

管理员默认：

- **demo**：用户名对不上上表 → `super_admin`，方便开箱试用。
- **local**：公开注册统一 `readonly`，用户名不影响权限。首次管理员由运维核实注册用户后，显式设置 `users.role_code='super_admin'`。既有用户角色不会自动修改。
- **local**：角色不存在、停用或读取数据库失败时，权限为空。**demo** 无库时仅回退已知演示角色授权。
- 停用角色 → 侧栏为空、权限为空。

API 一律先 `requireSession`（未登录 401）。账号 / 角色 / 菜单 / 权限再加 `requirePermission`（无权限 403）。无 `:read` 的模块 store 不预拉，避免工作台刷 403。

`demo` **只**绕过登录用户库，**不**提供业务表内存存储。账号管理等 CRUD 没有 Postgres 跑不起来。

`AUTH_MODE=local` 的密码恢复只通过已配置的 SMTP 向注册邮箱投递；接口返回统一说明，页面和日志不包含重置令牌。

RBAC 初始角色与授权由 `pnpm db:seed` 显式创建；已有角色授权不会自动补回。运行时授权不会初始化角色。

本地会话保存在 `auth_sessions`：注销撤销当前会话，改密或密码重置使此前所有会话失效。升级时先运行 `pnpm db:migrate`；既有本地 JWT 需重新登录。演示模式仍为无用户数据库的静态演示认证，不能用于真实访问控制。

`NODE_ENV=production` 时，demo（含没写 `AUTH_MODE`）、关闭登录守卫、缺少 `AUTH_SECRET` 或使用公开演示密钥都会拒绝启动。Workers 在第一次请求做同样的检查。确要公开演示才设置 `ALLOW_INSECURE_AUTH=true`。`local` 即使开了这个开关，仍然要 32 位密钥。`next build` 不会因为开发用的 demo 配置中断。

## 环境变量

完整模板：仓库根目录 [`.env.example`](../.env.example)。

| 变量 | 说明 |
|------|------|
| `AUTH_MODE` | `demo` 或 `local`。不写时开发环境是 `demo`；生产里这会被拒绝 |
| `AUTH_SECRET` | 会话签名。至少 32 位。`local` 和生产必填 |
| `ALLOW_INSECURE_AUTH` | 仅 `true` 时允许生产环境跑 demo。不要当默认 |
| `APP_URL` | 对外地址，用于重置密码链接，默认 `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL 连接串。`local` 登录和任何业务 CRUD 都需要 |
| `AUTH_GUARD` | 默认开启。开发环境设 `false` 可免登录；生产环境需同时显式设置 `ALLOW_INSECURE_AUTH=true` |
| `SHOW_REF_PAGES` | `/ref/*` 参考页。开发默认开、生产默认关；生产要开则设 `true` |
| `SMTP_HOST` | 有值才发信；留空时返回统一说明，不创建或展示重置链接 |
| `SMTP_PORT` | 默认 `587` |
| `SMTP_SECURE` | 默认 `false` |
| `SMTP_USER` / `SMTP_PASS` | 可选 |
| `SMTP_FROM` | 发件人显示名 |
| `ASK_AI_LLM_API_KEY` | 模型表为空时的 Ask AI 回退密钥；优先用模型管理里启用的条目。密钥不要放进前端 |
| `ASK_AI_LLM_PROVIDER` | 默认 `dashscope`（OpenAI 兼容） |
| `ASK_AI_LLM_MODEL` | 回退模型 ID，默认使用供应商预设（百炼为 `qwen-plus`，Grok 为 `grok-4.7`） |
| `ASK_AI_LLM_BASE_URL` | 可选，覆盖供应商默认地址 |

只支持标准 SMTP，没有云邮件 SaaS SDK。Ask AI 优先走模型管理，其次服务端 `ASK_AI_LLM_*`，请求体带 `apiKey` 会被拒绝。

### Grok 接入

在「模型服务」新建模型，供应商选择 **xAI / Grok**，填写服务端 API Key。默认模型为 `grok-4.7`，调用地址为 `https://api.x.ai/v1`；模型 ID 和调用地址均可按账号可用模型或 OpenAI 兼容代理修改。保存后可执行连通性测试，启用后可在 Ask AI 中选择。

环境变量接入可设置 `ASK_AI_LLM_PROVIDER=xai`（也支持 `grok`、`x.ai`），并填写 `ASK_AI_LLM_API_KEY`。省略模型 ID 和地址时使用上述预设；已有 `ASK_AI_LLM_MODEL` / `ASK_AI_LLM_BASE_URL` 会优先覆盖预设。模型表为空时导入与无库回退使用相同供应商默认值。

协议依据：[xAI Chat Completions 文档](https://docs.x.ai/developers/model-capabilities/legacy/chat-completions)。使用现有 Chat Completions 与函数工具调用链。

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发服务器（默认 3000） |
| `pnpm build` / `pnpm start` | 生产构建与启动 |
| `pnpm typecheck` | TypeScript 检查 |
| `pnpm check` | typecheck + 规范绊线 |
| `pnpm test` | 跑 `tests/` 下全部测试。需要库的用例见下方 |
| `pnpm db:migrate` | 按 `migrations/` 应用到当前库。可重复执行 |
| `pnpm db:push` | 仅开发库。按 schema 直接改表，不写迁移记录 |
| `pnpm db:seed` | 显式初始化 RBAC 角色与授权；保留已有角色授权 |
| `pnpm test:security` | 安全回归的旧入口，已被 `pnpm test` 覆盖 |
| `pnpm db:generate` | 根据 schema 差异生成下一份 migration |
| `pnpm db:studio` | Drizzle Studio |
| `docker compose up -d` | 启动本仓库 Postgres 16 |

## 目录结构

```text
app/
  (auth)/            登录 · 注册 · 找回、重置密码
  (app)/             工作台 · 账号 · 角色 · 菜单 · 权限 · 设置 · ref/*
  api/               auth · accounts · roles · menus · permissions
components/          app-shell · *-store · *-dialog · ui/modal
config/              site · menu · apps
lib/                 auth · db · accounts · roles · menus · permissions · rbac · apps · mail · reference
docs/                产品说明 · 工作流 · 安装环境 · 组件选型
.agents/skills/      quick-start · new-module · new-page · audit · dimensional-drawing
AGENTS.md
```

登录用户在 `users`，业务账号在 `admin_accounts`，不要混接。应用登记在浏览器 `localStorage` 键 `forge-starter:app-registry`。加模块后当前产品会按 `APP_MODULE_IDS` 刷新勾选；自己建的内部应用要手动勾，或清该 key。

## 安全回归验证

使用独立的本地 PostgreSQL 数据库（名称以 `forge_semantic_test_` 开头，主机必须是 `127.0.0.1`），将 `DATABASE_URL` 指向它，设置 `AUTH_MODE=local` 和至少 32 位的测试专用 `AUTH_SECRET`。先 `pnpm db:migrate`，再 `pnpm test`。测试仅使用合成账户和密钥；安全用例里有一条会调用本机 `docker compose config`。

没配隔离库时，依赖数据库的用例会 skip。skip 不是通过。HTTP 用例另外要求本机已有服务：`SEMANTIC_HTTP_ORIGIN` 或 `SECURITY_TEST_ORIGIN` 只能是 `http://127.0.0.1:3167` 或 `3168`。语义和 harness 的 HTTP 用例按 demo 登录来写，安全用例的 HTTP 按 `local` 来写，所以一次进程环境跑不齐这两类。没设 origin 时它们明确跳过。`pnpm test` 会把 `NODE_ENV` 设为 `test`，避免本机生产变量把启动检查当成正在对外服务。

模型供应商或实际 Chat Completions 地址（含路径和查询）变更时须重新提供 API Key；等价地址与普通名称编辑可以保留密钥。无密钥的本地服务可显式提供占位值 `ollama`，从而不会携带旧供应商密钥。
