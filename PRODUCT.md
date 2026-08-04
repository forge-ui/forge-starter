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
2. **轻默认、可删除**：每个模块可摘掉；不绑死 Stripe / 某家 ORM / 某家云。
3. **演示与生产边界清晰**：demo 可一键进后台；生产必须显式接 auth。
4. **范例即文档**：用真列表/表单页教用法，不用五个菜单指向同一占位页。
5. **不做中台**：无代码生成、无 BPM、无复杂多租户权限引擎。

## 3. 模块规划

### 3.1 必做（P0）— 达到「轻量 ShipAny」下限

| 模块 | 做什么 | 不做 |
|------|--------|------|
| **应用壳 App Shell** | 统一 `(app)/layout` + `AppLayout`；`config/menu` 唯一菜单源；Header 主/次动作可配置 | 收藏夹默认开启、第二套导航 |
| **认证 Auth（可插拔）** | 保留现有登录/注册/找回 UI；`demo` 模式可进后台；文档化接 Clerk / Auth.js / 自建 | 自研完整账号中台 |
| **路由守卫** | `middleware` 示例：未登录不可进 `(app)`；可用 env 关闭便于纯 UI 开发 | 细粒度 RBAC 引擎 |
| **工作台 Dashboard** | 真 Forge 指标卡/区块（可 mock 数据），Header 动作有行为或去掉 | 空虚线框充数 |
| **列表范式 Collection** | 一页：`Toolbar` + `DataTable` + 行操作 + 空态 | 五个路由 re-export 同一页 |
| **表单范式 Form** | 一页：新建/编辑 + 校验 + 提交反馈 | 无校验的假表单 |
| **工程基线** | `AGENTS.md`、env 示例、typecheck/build 绿、core 版本说明 | 私有 registry |

### 3.2 应做（P1）— 好完像正经产品模板

| 模块 | 做什么 | 不做 |
|------|--------|------|
| **详情范式 Detail** | 只读字段 + 返回/面包屑 + 状态下一步 | 复杂审批流引擎 |
| **设置 Settings** | 简易资料/偏好页（mock） | 组织级配置中心 |
| **会话模型** | 简单 session / cookie 或 demo user；退出登录可用 | 完整 OAuth 自建 |
| **状态范例** | loading / empty / error 各一处示范 | 全站状态机框架 |
| **主题配置** | accent / 团队名 / logo 集中配置 | 多主题市场 |
| **部署说明** | Vercel / Node 启动；GitHub Pages 仅可选 | 默认绑死一家云 |

### 3.3 可选（P2）— 有明确需求再加

| 模块 | 说明 |
|------|------|
| **简易 RBAC mock** | 2～3 角色切换看菜单差异（仍 mock） |
| **i18n** | 中英切换；默认可不出 |
| **API 层约定** | `lib/api` fetch 封装 + 错误 toast 范例 |
| **与 Readdy 衔接** | 文档说明：Readdy 出原型 → 迁入本脚手架手写 |

### 3.4 明确不做（Non-goals）

- 营销落地页 / 博客 / 文档站（ShipAny 重内容侧）
- 支付、订阅、发票（Stripe 等）
- 广告、邮件营销扩展
- 代码生成、工作流 BPM、多租户中台
- 复刻芋道模块清单
- 把 Readdy 生成器塞进本仓

## 4. 建议目录演进（相对现状）

```txt
app/
  (auth)/                 # 已有：认证 UI
  (app)/
    layout.tsx            # P0：统一 AppLayout
    dashboard/            # P0：工作台
    examples/
      list/               # P0：列表范式
      form/               # P0：表单范式
      detail/             # P1：详情范式
    settings/             # P1
  middleware 或 proxy     # P0：守卫（Next 版本惯例为准）
config/
  menu.tsx                # 已有
  site.ts                 # P1：产品名、logo、accent
lib/
  auth/                   # P0：demo | 适配器接口
  session.ts              # P1
```

菜单只保留 **真实存在且内容不同** 的路由；示范页可用「示例」分组，避免假装已有日历/收件箱业务。

## 5. 版本节奏建议

| 版本 | 目标 |
|------|------|
| **0.1.x**（当前） | 认证 UI + dashboard 占位 + Forge 接入；**演示级 auth** |
| **0.2.0**（本版文档） | 定位更名与模块路线图；对外称「后台脚手架」 |
| **0.3.0** | P0 落地：共享 layout、守卫、列表/表单真范例、去掉假多页 |
| **0.4.0** | P1：详情、设置、会话/退出、env 与部署文档 |

## 6. 成功标准

clone 后 10 分钟内应能：

1. 跑起登录页与后台壳，视觉明显是 Forge；
2. 看懂「列表 / 表单怎么写」并复制出业务页；
3. 按文档把 demo 登录换成真实 auth，并打开路由守卫；
4. AI 在 `AGENTS.md` 约束下不引入第二套 UI 库。

做不到 1～2，就还只是展厅；做满 1～3，才算轻量 ShipAny 意义上的脚手架。
