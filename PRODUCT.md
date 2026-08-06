# Forge Starter — 产品说明与模块规划

## 1. 一句话定位

**用 Forge UI 快速搭建管理后台**：面向人类开发者与 Coding Agent，从 0 搭 **B 端 / 运营后台 / 内部系统**。  
视觉与组件以 **`@forge-ui-official/core`** 为准；内置 skills + 双样板 + `/ref` 画廊，让扩模块又快又稳。

| 对外名称 | 说明 |
|----------|------|
| 英文 | **Forge Starter** |
| 中文 | **Forge 后台脚手架** |
| 定位 | Forge 官方级后台体验 · skills 驱动扩模块 · 真页面可抄 |

| 亮点 | 说明 |
|------|------|
| 主战场 | **管理后台 / 内部系统** |
| UI | **Forge-first**，页面像官方产品 |
| Agent | skills 拆后端/页面，**装页面不歪、扩 CRUD 稳** |
| 开箱能力 | 壳 + 登录 + SMTP + **双 CRUD 样板** + 应用切换 + `/ref` 画廊 |

## 2. 设计原则

1. **Forge-first**：只从 `@forge-ui-official/core` 取组件；颜色只用 `fg-*`；图标用 `solar-icon-set`。
2. **Agent 友好**：第一开发界面是 Agent + skills（`quick-start` / `new-module` / `new-page`），人读 `AGENTS.md`。
3. **范例即文档**：`accounts` = 重详情样板；`approvals` = 轻详情弹窗样板；按内容选型。
4. **轻量可扩展**：模块边界清晰，按业务逐步加域。
5. **演示与生产边界清晰**：`AUTH_MODE=demo|local`；登录用户与业务表分表。
6. **聚焦后台**：优先列表 / 表单 / 详情 / 工作台等高频页面。
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
| `demo` | 任意账号可进后台（UI / Agent 开发） |
| `local` | 真库 + 守卫 + SMTP 找回 |

## 4. 模块现状（0.5 agent-native）

| 模块 | 状态 |
|------|------|
| App Shell | `AppLayout`；应用切换器；隐藏未实现的通知/消息 widget |
| 认证 | 登录 / 注册 / 找回 / 重置 / profile 改资料改密 |
| 工作台 | ecommerce-2 布局，指标接业务账号 |
| 账号管理 | **CRUD 样板**：DataTable 列表 + Modal 新建编辑 + 详情 + `/api/accounts` |
| 应用管理 | 应用列表 CRUD；内部应用多选菜单；外链/外部系统认证占位 |
| Agent skills | `.agents/skills/*`（`.claude/skills` 为 symlink） |

### 4.1 数据边界

| 数据 | 存储 | 用途 |
|------|------|------|
| 登录用户 | Postgres `users` | 认证 |
| 业务账号 | Postgres `admin_accounts` | 账号管理 CRUD 样板 |
| 应用注册表 | localStorage | 侧栏应用切换（非登录库） |

### 4.2 Non-goals

- 营销落地页 / 博客  
- 支付、订阅、积分  
- 完整 IM / 真通知中心  
- 芋道模块清单复刻  
- 默认云邮件 API  

## 5. 扩模块铁律（Agent 必须遵守）

1. **复制样板**：以 `app/(app)/accounts` + `app/api/accounts` + `lib/accounts` + `components/*-form-dialog` + store 为模板。  
2. **列表页**：PageHeader（标题 + Breadcrumbs + 主按钮「新建」）+ 筛选 + 搜索 + `DataTable` + 空态。  
3. **新建/编辑**：`Modal` + 表单弹窗，**不要**整页表单（除非字段极多且用户明确要求）。  
4. **详情**：只读 + 编辑/删除 action；对照 `ecommerce/customers/[id]`。  
5. **API**：REST under `app/api/<resource>`；写库用 Drizzle；需登录 session。  
6. **菜单**：`config/menu.tsx` 注册；图标 `BoldDuotone` size 20。  
7. **颜色**：业务页 `color={siteConfig.accent}`（默认 blue）。  
8. **缺组件**：写 `FORGE-GAP` 停下问人，不手搓 Kit 已有能力。  
9. **交付前**：`pnpm typecheck` 必过。

## 6. Agent 工作流

```
产品 brief
  → /forge-starter-quick-start   # 改名、accent、菜单、env
  → /forge-starter-new-module    # 新 CRUD 域（抄 accounts）
  → /forge-starter-new-page      # 单页对照官方 template
  → pnpm typecheck
```

详细步骤见：

- `AGENTS.md` — 铁律摘要  
- `docs/agent-native.md` — 工作流  
- `docs/module-template.md` — CRUD 文件地图  
- `docs/page-roles.md` — 页面角色 → 官方 template（**无外部设计插件**）  
- `.agents/skills/*/SKILL.md`（`.claude/skills` → symlink，勿双份）

## 7. 版本节奏

| 版本 | 目标 |
|------|------|
| 0.3 | 认证 + Postgres + SMTP |
| 0.4 | 账号 CRUD + ecommerce 模板对齐 |
| **0.5（当前）** | **Agent-native 定位 + skills + 文档合约** |
| 0.6 | skill 脚本化检查、可选 RBAC、部署说明 |

## 8. 成功标准

1. Clone 后能跑登录与后台壳，视觉明显是 Forge。  
2. Agent 能按 skill 新增一个业务模块且 typecheck 绿。  
3. 不引入第二套 UI 库。  
4. 人读 PRODUCT/AGENTS 能判断「做什么 / 不做什么」。  
