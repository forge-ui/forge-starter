# Forge Starter — 产品说明

范围与拍板。怎么写代码、扩模块见 **`AGENTS.md`**。

## 1. 一句话定位

**用 Forge UI 快速搭建管理后台**：面向人类开发者与 Coding Agent，从 0 搭 **B 端、运营后台、内部系统**。  
视觉与组件以 **`@forge-ui-official/core`** 为准；内置 skills + 双样板 + `/ref` 画廊，让扩模块又快又稳。

| 对外名称 | 说明 |
|----------|------|
| 英文 | **Forge Starter** |
| 中文 | **Forge 后台脚手架** |
| 定位 | Forge 官方级后台体验 · skills 驱动扩模块 · 真页面可抄 |

| 亮点 | 说明 |
|------|------|
| 主战场 | **管理后台、内部系统** |
| UI | **Forge-first**，页面像官方产品 |
| Agent | skills 拆后端/页面，**装页面不歪、扩 CRUD 稳** |
| 开箱能力 | 壳 + 登录 + SMTP + **双 CRUD 样板** + 应用切换 + `/ref` 画廊 |

## 2. 设计原则

1. **Forge-first**：只从 `@forge-ui-official/core` 取组件；颜色只用 `fg-*`；图标用 `solar-icon-set`。
2. **Agent 友好**：第一开发界面是 Agent + skills；人读 `AGENTS.md`。
3. **范例即文档**：`accounts` = 重详情样板；`approvals` = 轻详情弹窗样板；按内容选型。
4. **轻量可扩展**：模块边界清晰，按业务逐步加域。
5. **演示与生产边界清晰**：`AUTH_MODE=demo|local`；登录用户与业务表分表。
6. **聚焦后台**：优先列表、表单、详情、工作台等高频页面。
7. **邮件可自建**：标准 SMTP，方便对接企业邮箱。

## 3. 认证与邮件（已拍板）

### 3.1 登录

| 能力 | 约定 |
|------|------|
| 主路径 | 用户名或邮箱 + 密码 |
| 会话 | httpOnly cookie（jose JWT） |
| 库 | PostgreSQL only（`DATABASE_URL`） |
| 不做默认 | OAuth、托管 IdP |

### 3.2 邮件

仅 SMTP（`SMTP_HOST` 等）；未配置时重置链打印到服务端日志，不假装已发信。

### 3.3 运行模式

| `AUTH_MODE` | 行为 |
|-------------|------|
| `demo` | 任意账号可进后台（UI、Agent 开发） |
| `local` | 真库 + 守卫 + SMTP 找回 |

`demo` 只绕过登录用户库，不提供业务持久化。CRUD 仍要 `DATABASE_URL` + `pnpm db:push`。

## 4. 模块现状（0.5 agent-native）

| 模块 | 状态 |
|------|------|
| App Shell | `AppLayout`；应用切换器；隐藏未实现的通知/消息 widget |
| 认证 | 登录、注册、找回、重置、profile 改资料改密 |
| 工作台 | ecommerce-2 布局，指标接业务账号 |
| 账号管理 | **CRUD 样板**：DataTable 列表 + Modal 新建编辑 + 详情 + `/api/accounts` |
| 应用管理 | 应用列表 CRUD；内部应用多选菜单；外链/外部系统认证占位 |
| Agent skills | `.agents/skills/*` |

### 4.1 数据边界

| 数据 | 存储 | 用途 |
|------|------|------|
| 登录用户 | Postgres `users` | 认证 |
| 业务账号 | Postgres `admin_accounts` | 账号管理 CRUD 样板 |
| 应用注册表 | localStorage | 侧栏应用切换（非登录库） |

### 4.2 Non-goals

- 营销落地页、博客
- 支付、订阅、积分
- 完整 IM、真通知中心
- 芋道模块清单复刻
- 默认云邮件 API

## 5. 版本节奏

| 版本 | 目标 |
|------|------|
| 0.3 | 认证 + Postgres + SMTP |
| 0.4 | 账号 CRUD + ecommerce 模板对齐 |
| **0.5（当前）** | **Agent-native 定位 + skills + 文档合约** |
| 0.6 | skill 脚本化检查、可选 RBAC、部署说明 |

## 6. 成功标准

1. Clone 后能跑登录与后台壳，视觉明显是 Forge。
2. Agent 能按 skill 新增一个业务模块且 typecheck 绿。
3. 不引入第二套 UI 库。
4. 人读本文与 `AGENTS.md` 能判断「做什么、不做什么」。

写法、skill 边界、交付检查：**`AGENTS.md`** · `docs/agent-native.md`。
