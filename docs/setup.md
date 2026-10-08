# 本地安装与环境

README 只给最短路径。本文是环境变量、目录和命令的完整说明。

## 依赖

- Node.js（建议 20+）
- [pnpm](https://pnpm.io)
- Docker（跑 Postgres；也可用自己的库，把 `DATABASE_URL` 改成实际连接串）

## 最短路径

顺序必须是：先配置环境变量与数据库密码，再起数据库、安装依赖并同步 schema。

```bash
cp .env.example .env
# 编辑 .env：设置唯一 POSTGRES_PASSWORD，并同步 DATABASE_URL
docker compose up -d
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

打开 `http://localhost:3000`。

`pnpm db:push` 依赖已安装的 `drizzle-kit`，所以必须在 `pnpm install` 之后。compose 起来后若立刻 push 失败，等几秒等 Postgres 健康检查通过再试（`docker compose up -d --wait` 会等到 healthy）。

Compose 仅监听 `127.0.0.1:5432`，要求设置独立的 `POSTGRES_PASSWORD`。把密码的 URL 编码值同步到 `DATABASE_URL`。可用 `openssl rand -hex 32` 生成随机密码。已有数据卷不会因环境变量改变而自动更换数据库密码，需由运维显式轮换。

## demo 和 local

| | `AUTH_MODE=demo`（默认） | `AUTH_MODE=local` |
|--|--------------------------|-------------------|
| 登录 | 任意用户名/邮箱 + 密码即可进后台 | 走 Postgres `users` 表，需先注册 |
| 侧栏角色 | 见下方种子角色表。用户名 `admin` / `operator` / `auditor` / `readonly`（及中文别名）映射种子角色；**其余用户名默认超级管理员（全开）**。无库时回退种子授权 | `users.role_code`（**默认 `readonly`**）；公开注册固定只读角色。管理员须由受信任运维显式分配库字段，不是业务账号 `admin_accounts.role` |
| `AUTH_SECRET` | 未设时用内置演示密钥 | **必填**，至少 16 位（`.env.example` 建议更长） |
| 业务 CRUD | **仍要** `DATABASE_URL` + `pnpm db:push` | 同左 |
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

本地会话保存在 `auth_sessions`：注销撤销当前会话，改密或密码重置使此前所有会话失效。升级时先运行 `pnpm db:push` 新增会话表；既有本地 JWT 需重新登录。演示模式仍为无用户数据库的静态演示认证，不能用于真实访问控制。

## 环境变量

完整模板：仓库根目录 [`.env.example`](../.env.example)。

| 变量 | 说明 |
|------|------|
| `AUTH_MODE` | `demo` 或 `local`，默认 `demo` |
| `AUTH_SECRET` | 会话签名。`local` 至少 16 位 |
| `APP_URL` | 对外地址，用于重置密码链接，默认 `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL 连接串。`local` 登录和任何业务 CRUD 都需要 |
| `AUTH_GUARD` | 默认开启。设 `false` 才允许未登录进入后台 |
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
| `pnpm db:push` | 把 Drizzle schema 推到当前库（开发） |
| `pnpm db:seed` | 显式初始化 RBAC 角色与授权；保留已有角色授权 |
| `pnpm test:security` | 本地隔离测试库运行安全回归；可设置 SECURITY_TEST_ORIGIN 为 127.0.0.1:3167/3168 验证 HTTP |
| `pnpm db:generate` | 生成 migration |
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
.agents/skills/      quick-start · new-module · new-page · audit
AGENTS.md
```

登录用户在 `users`，业务账号在 `admin_accounts`，不要混接。应用登记在浏览器 `localStorage` 键 `forge-starter:app-registry`。加模块后当前产品会按 `APP_MODULE_IDS` 刷新勾选；自己建的内部应用要手动勾，或清该 key。

## 安全回归验证

使用独立的本地 PostgreSQL 数据库（名称以 `forge_semantic_test_` 开头），将 `DATABASE_URL` 指向它，设置 `AUTH_MODE=local` 和测试专用 `AUTH_SECRET`。先 `pnpm db:push`，再 `pnpm test:security`。测试仅使用合成账户和密钥；需要本机 Docker 命令校验 Compose。若要覆盖真实 HTTP，会话测试服务也必须使用同一测试库和密钥，设置 `SECURITY_TEST_ORIGIN=http://127.0.0.1:3168` 后运行。未设置该变量时 HTTP 用例明确跳过。

模型供应商或实际 Chat Completions 地址（含路径和查询）变更时须重新提供 API Key；等价地址与普通名称编辑可以保留密钥。无密钥的本地服务可显式提供占位值 `ollama`，从而不会携带旧供应商密钥。
