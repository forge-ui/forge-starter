# 页面角色 → 官方 Template 对照表

写后台页时 **先定角色，再抄 template**。  
权威：Forge monorepo `templates/` + 本表 + `docs/module-template.md`。

## 模板源码

```text
../forge/src/app/templates/
  (dashboards)/dashboards/
  (dashboard)/ecommerce/
  crm-template/
  finance-template/
  project-template/
  micellaneous-template/
  _shared/
```

## 角色

| 角色 | 关键词 | 主结构 |
|------|--------|--------|
| **dashboard** | 工作台、指标、趋势 | 指标卡 + 图 + 次级列表 |
| **collection** | 列表、筛选 | Header + **单行**筛选/搜索 + DataTable |
| **form-modal** | 新建/编辑字段不多 | Modal 表单 |
| **detail-modal** | 轻详情、短处理 | 列表上叠 Modal |
| **detail** | 重详情、档案 | 主栏 + 侧栏 + Tab/时间线 |
| **form-page** | 字段极多 | 页内长表单（少用） |
| **settings** | 资料、偏好 | 窄卡片或 collection |
| **auth** | 登录注册 | `app/(auth)` |

### detail-modal 与 detail

两者都是合法详情角色，**无全局默认**。

| | detail-modal | detail |
|--|--------------|--------|
| Starter 样板 | `approvals` | `accounts/[id]` |
| 何时倾向 | 字段少、处理完回列表 | 多区块/Tab/图/关联 |
| 返回 | 关弹窗 | 页内 `←`/面包屑 |
| 禁止 | 为「统一」硬弹窗重内容 | 轻内容硬全页；侧栏塞返回 |

拿不准时问用户，不要在 skill 里写死某一种。

## Starter 可渲染参考页（不进菜单）

开发环境打开 **`/ref/`**。生产默认关闭，见 `docs/reference-pages.md`。

| 角色 | `/ref/*` | 业务可运行样板 |
|------|----------|----------------|
| collection-table | `/ref/list-table` | accounts / approvals 列表 |
| collection-cards | `/ref/list-cards` | — |
| detail | `/ref/detail` | accounts/[id] |
| person（CRM 人物多 Tab） | `/ref/person` | — john-bushmill |
| profile（项目成员） | `/ref/profile` | — members/[id] |
| product（产品多 Tab） | `/ref/product` | — products/[id] |
| detail-modal | `/ref/detail-modal` | approvals 弹窗 |
| form-page（整页） | `/ref/form-page` | — leads/new |
| form-modal | `/ref/form-modal` | *-form-dialog |
| split | `/ref/split` | — |
| calendar | `/ref/calendar` | — |
| chat | `/ref/chat` | — |
| files | `/ref/files` | — |
| settings | `/ref/settings` | settings/* |
| activity | `/ref/activity` | — |
| queue | `/ref/queue` | approvals 待办 |
| empty | `/ref/empty` | 各列表空态 |
| dashboard | `/ref/dashboard-board` · `/ref/dashboard-kpi` · `/ref/dashboard-crm` · `/ref/dashboard-analytics` · `/ref/dashboard-project` | `/dashboard` |
| invoice 单据 | `/ref/invoice` | — |
| task 任务 | `/ref/task` | — |
| project 项目 | `/ref/project` | — |
| kanban 泳道 | `/ref/kanban`（官方嵌在 project Task tab） | — |
| tickets 工单线程 | `/ref/tickets` | —（语义见 ShipAny Next tickets） |
| api-keys | `/ref/api-keys` | — |
| credits 积分账本 | `/ref/credits` | — |
| billing 订阅 | `/ref/billing` | — |

## 推荐对照

| 角色 | 官方参考 | Starter 样板 |
|------|----------|--------------|
| dashboard | ecommerce-2 / crm / analytics | `/dashboard` + `/ref/dashboard-*` |
| collection | ecommerce/customers | `accounts`、`approvals` 列表 + `/ref/list-table` / `list-cards` |
| form-modal | customers Add Modal | `account-form-dialog`、`approval-form-dialog` |
| detail-modal | （Starter 自研） | `approval-detail-dialog` |
| detail | customers/[id] | `accounts/[id]` |
| settings | — | `settings/*` |
| auth | finance/crm 登录 | `app/(auth)/*` |

## Starter 铁律

1. 只用 `@forge-ui-official/core` + 宿主 `components/ui/modal.tsx`  
2. `color={siteConfig.accent}`  
3. CRUD：collection + form-modal + **（detail-modal 或 detail）** + API  
4. `hideHeader: true` 时壳 `onBack` **不渲染**  
5. collection 筛选单行，禁止双行 pills  
6. 假按钮删掉或接真逻辑  
7. 浏览器验收，不只 curl  

## Agent 速查

```text
「xxx 管理」整域？
  → forge-starter-new-module
     选型详情形态（modal | page | 问用户）
     单行筛选
     浏览器验收
看板 → new-page + dashboard
设置 → settings
登录 → app/(auth)
```

## 选型权威

本表 + monorepo templates + Starter 双样板（approvals / accounts）。  
不依赖仓库外设计插件。
