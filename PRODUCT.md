# Forge Starter — 产品说明与模块规划

## 1. 一句话定位

**轻量 Forge 后台脚手架**：给业务后台 / 内部系统 / Agent 产品一个「能当真项目起点」的底座。  
对标 **ShipAny 的轻量层**（可开工、可扩展），**不对标** ShipAny 全量 SaaS，**更不对标** 芋道式中台。

| 对外名称 | 说明 |
|----------|------|
| 英文 | **Forge Starter** |
| 中文 | **Forge 后台脚手架**（或「轻量后台脚手架」） |
| 避免使用 | 「起手式」「控制台起手式」等拗口说法 |

## 2. 设计原则

1. **Forge-first**：布局与业务控件优先 `@forge-ui-official/core` + `fg-*` token + `solar-icon-set`。
2. **轻默认、可删除**：每个模块可摘掉；不绑死 Stripe、Clerk、某家云邮件 SaaS。
3. **演示与生产边界清晰**：`AUTH_MODE=demo` 可一键进后台；生产用本地账号 + 自建 SMTP。
4. **范例即文档**：用真列表/表单页教用法，不用五个菜单指向同一占位页。
5. **不做中台**：无代码生成、无 BPM、无复杂多租户权限引擎。
6. **邮件可自建**：发信只依赖 **标准 SMTP**（主机 / 端口 / 账号 / 密码 / TLS），不强制 Resend、SendGrid、Mailgun 等在线邮件云。

## 3. 认证与邮件（已拍板）

### 3.1 登录方式

| 能力 | 约定 |
|------|------|
| 主路径 | **用户名 + 密码**，或 **邮箱 + 密码**（同一登录框可接受「用户名或邮箱」） |
| 注册 | 至少收集：用户名、邮箱、密码（密码哈希存储，不明文落库） |
| 会话 | 服务端 session（httpOnly cookie）；支持退出登录 |
| 守卫 | 未登录不可进 `app/(app)`；可用 env 在纯 UI 开发时关闭 |
| 默认不做 | Google / GitHub 等 OAuth（P2 可选，非默认） |
| 默认不做 | 强制绑定 Clerk / Auth0 / Supabase Auth 等托管身份云 |

实现倾向（实现阶段可微调，产品语义不变）：

- 本地用户表：**PostgreSQL**（`DATABASE_URL`），主流部署默认，不做 SQLite 双轨
- 密码：`bcrypt` / `argon2` 一类单向哈希
- 会话：Auth.js（Credentials）或等价自建 session，**不把云 IdP 当硬依赖**
- 本地开发：Docker Compose 起一个 Postgres，或连已有实例；`.env.example` 给标准连接串

### 3.2 邮件：仅 SMTP，可自定义服务器

用于：**注册验证（若开启）、找回密码、重置密码链接** 等事务邮件。

| 配置项（env 示例名） | 含义 |
|----------------------|------|
| `SMTP_HOST` | 邮件服务器主机（如 `mail.example.com`、内网 Postfix、企业邮箱 SMTP） |
| `SMTP_PORT` | 端口（常见 465 / 587） |
| `SMTP_SECURE` | 是否隐式 TLS（465 常为 true） |
| `SMTP_USER` | SMTP 登录用户名 |
| `SMTP_PASS` | SMTP 登录密码 |
| `SMTP_FROM` | 发件人展示地址（如 `noreply@example.com`） |
| `APP_URL` | 重置链接等回跳的应用根 URL |

原则：

1. **只实现 SMTP 传输**（如 nodemailer 直连），配置进 `.env`，文档给自建 / 企业邮箱示例。  
2. **禁止**把 Resend / SendGrid / Mailgun / Amazon SES SDK 等作为默认或必选依赖。  
3. 用户若自己用「兼容 SMTP 的云邮箱」当 `SMTP_HOST`，那是用户选择，产品不内置其 API。  
4. `AUTH_MODE=demo` 或未配置 SMTP 时：找回密码可提示「未配置邮件」，开发环境可把重置链打印到服务端日志，**不得假装已发送成功到真实邮箱**。  
5. 重置令牌：一次性、短时有效、哈希存储。

### 3.3 运行模式

| `AUTH_MODE` | 行为 |
|-------------|------|
| `demo` | 任意/固定演示账号可进后台；可不连库、不发信（当前 0.2 行为，保留作 UI 开发） |
| `local`（生产默认目标） | 用户名或邮箱 + 密码校验；注册写入本地用户；邮件走 SMTP |

## 4. 模块规划

### 4.1 必做（P0）— 达到「轻量 ShipAny」下限

| 模块 | 做什么 | 不做 |
|------|--------|------|
| **应用壳 App Shell** | 统一 `(app)/layout` + `AppLayout`；`config/menu` 唯一菜单源；Header 主/次动作可配置 | 收藏夹默认开启、第二套导航 |
| **认证 Auth（本地账号）** | 用户名或邮箱 + 密码登录；注册；session；退出；**PostgreSQL** 用户表；`demo` / `local` 双模式 | 默认 OAuth、托管 IdP、SQLite 双轨 |
| **邮件 Mail（SMTP）** | 可配置自定义 SMTP；找回/重置密码邮件 | 云邮件 API 必选、营销群发 |
| **路由守卫** | 未登录不可进 `(app)`；env 可关 | 细粒度 RBAC 引擎 |
| **工作台 Dashboard** | 真 Forge 指标卡/区块（可 mock），Header 动作有效或去掉 | 空虚线框充数 |
| **列表范式 Collection** | 一页：`Toolbar` + `DataTable` + 行操作 + 空态 | 五个路由 re-export 同一页 |
| **表单范式 Form** | 一页：新建/编辑 + 校验 + 提交反馈 | 无校验的假表单 |
| **工程基线** | `AGENTS.md`、`.env.example`、typecheck/build 绿、core 版本说明 | 私有 registry |

### 4.2 应做（P1）— 补完像正经产品模板

| 模块 | 做什么 | 不做 |
|------|--------|------|
| **详情范式 Detail** | 只读字段 + 返回/面包屑 + 状态下一步 | 复杂审批流引擎 |
| **设置 Settings** | 资料（改显示名等）；可选改密 | 组织级配置中心 |
| **邮箱验证（可选开关）** | 注册后 SMTP 发验证链 | 强制手机验证码 |
| **状态范例** | loading / empty / error 各一处示范 | 全站状态机框架 |
| **主题配置** | accent / 团队名 / logo 集中配置 | 多主题市场 |
| **部署说明** | Vercel / Node；SMTP 在 Serverless 下的注意点（长连接/端口） | 默认绑死一家云 |

### 4.3 可选（P2）— 有明确需求再加

| 模块 | 说明 |
|------|------|
| **简易 RBAC** | 2～3 角色与菜单差异 |
| **OAuth** | Google 等，仍非默认 |
| **i18n** | 中英切换 |
| **API 层约定** | `lib/api` + 错误提示范例 |
| **与 Readdy 衔接** | 原型迁入本脚手架的说明 |

### 4.4 明确不做（Non-goals）

- 营销落地页 / 博客 / 文档站  
- 支付、订阅、发票  
- 广告、邮件营销  
- **默认依赖在线云邮件服务商 API**  
- 代码生成、工作流 BPM、多租户中台  
- 复刻芋道模块清单  
- 把 Readdy 生成器塞进本仓  

## 5. 建议目录演进

```txt
app/
  (auth)/                 # 登录 / 注册 / 找回 / 重置（Forge UI）
  (app)/
    layout.tsx            # 统一 AppLayout + DemoStore
    dashboard/            # ← dashboards/ecommerce-2，账号运营指标
    accounts/
      page.tsx            # ← ecommerce/customers 列表
      new/                # ← ecommerce/products/new 表单
      [id]/               # ← ecommerce/customers/[id] 详情
      [id]/edit/          # 编辑表单
    settings/             # 个人资料 / 安全 / 通知
  api/auth/               # 登录注册 session、重置密码 API
middleware.ts             # 守卫
config/
  menu.tsx                # 工作台 / 账号管理（设置走 profile 菜单）
  site.ts
lib/
  auth/
    password.ts           # hash / verify
    session.ts
    users.ts              # 本地用户读写
  mail/
    smtp.ts               # 仅 SMTP 发送
  demo/
    accounts.ts           # AdminAccount 演示域模型
  db/                     # PostgreSQL + Drizzle
.env.example              # AUTH_MODE、SMTP_*、DATABASE_URL、APP_URL
docker-compose.yml        # 本地 Postgres
```

业务域固定为 **管理后台账号管理**；菜单只保留 **工作台 / 账号管理**。

### 5.1 演示边界（写进 README 同步）

- **登录用户**：`AUTH_MODE=local` 时写 Postgres；profile 改资料/改密走 `/api/auth/*`。
- **账号管理 CRUD**：`components/demo-store.tsx` 内存状态，刷新恢复种子数据；用于范例 UI，**不要当成生产账号库**。
- **新建入口**：列表主按钮 / 空态 / 工作台 → 弹窗；`/accounts/new` 仅重定向 `?create=1`。
- **设置入口**：侧栏 profile 四项（编辑资料 / 修改密码 / 系统设置 / 退出），**不设一级「设置」菜单**。

## 6. 版本节奏建议

| 版本 | 目标 |
|------|------|
| **0.1.x** | 认证 UI + dashboard 占位 + Forge 接入；演示级跳转 |
| **0.2.0** | 定位更名 + 模块路线图 + **认证/SMTP 产品决策** |
| **0.3.0** | P0：共享 layout、**PostgreSQL + local 用户名/邮箱密码**、**SMTP 找回密码**、守卫、列表/表单范例 |
| **0.4.x**（当前） | 业务域 **账号管理**；Dashboard←**`dashboards/ecommerce-2`**；列表←`ecommerce/customers`（搜索/筛选）；**新建=列表 Modal**（customers Add 模式）；编辑=窄栏整页；详情←`customers/[id]`；`AdminAccount` 内存 demo store（与登录 `users` 分离）；设置仅 profile 入口 |
| **0.5.0** | 可选邮箱验证、部署与 SMTP 运维说明、设置写回用户表 |

## 7. 成功标准

clone 后应能：

1. 跑起登录页与后台壳，视觉明显是 Forge；  
2. 配置 **PostgreSQL**（`DATABASE_URL`）后，`AUTH_MODE=local` 下用 **用户名或邮箱 + 密码** 注册/登录，session 可退出；  
3. 配置 **自建或企业 SMTP** 后完成找回密码邮件（不依赖云邮件 SaaS SDK）；  
4. 看懂列表/表单范例并复制出业务页；  
5. AI 在 `AGENTS.md` 约束下不引入第二套 UI 库。  

做不到 1，仍是展厅；做满 2～3，认证才算达到你要求的「可自建邮件的本地账号体系」。
