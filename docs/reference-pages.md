# AI 参考页（真实路由 · 不进菜单）

路径前缀：**`/ref/*`**

- **是** 真实 Next 页面，可打开、可抄结构  
- **不是** 产品功能：不在侧栏  
- **生产** 默认 404；`SHOW_REF_PAGES=true` 可开  

## 索引

打开 **`/ref/`**。

| 路由 | 范式 | 官网/模板对照 |
|------|------|----------------|
| `/ref/list-table` | 列表 · 表格 | ecommerce/customers |
| `/ref/list-cards` | 列表 · 卡片 | project/projects |
| `/ref/detail` | 业务对象详情 | ecommerce/customers/[id] |
| `/ref/person` | **CRM 人物详情**（多 Tab） | [customers/john-bushmill](https://www.forgeui.org/templates/crm-template/customers/john-bushmill) |
| `/ref/profile` | 项目成员详情 | project/members/[id] |
| `/ref/product` | **产品详情**（多 Tab） | ecommerce/products/[id] |
| `/ref/detail-modal` | 详情弹窗 | approvals |
| `/ref/form-page` | **整页表单** | [crm leads/new](https://www.forgeui.org/templates/crm-template/leads/new) |
| `/ref/form-modal` | 表单弹窗 | customers Add Modal |
| `/ref/split` | 主从分屏 | project/clients |
| `/ref/calendar` | **日历** | micellaneous/calendar |
| `/ref/chat` | **对话** | micellaneous/chat |
| `/ref/files` | **文件清单** | micellaneous/files |
| `/ref/dashboard-board` | Dashboard · 通用条 | ecommerce-2 骨架 |
| `/ref/dashboard-kpi` | Dashboard · 精简 KPI | ecommerce-2 |
| `/ref/dashboard-crm` | **Dashboard · CRM** | [dashboards/crm](https://www.forgeui.org/templates/dashboards/crm) |
| `/ref/dashboard-analytics` | **Dashboard · Analytics** | [dashboards/analytics](https://www.forgeui.org/templates/dashboards/analytics) |
| `/ref/dashboard-project` | **Dashboard · Project** | [dashboards/project-1](https://www.forgeui.org/templates/dashboards/project-1) |
| `/ref/invoice` | **发票/单据详情** | finance-template/invoices/[id] |
| `/ref/task` | **任务详情** | project-template/tasks/[id] |
| `/ref/project` | **项目详情（多 Tab）** | project-template/projects/[id] |
| `/ref/kanban` | **Kanban 泳道** | 项目详情 Task tab 内嵌，抽出独立页 |
| `/ref/tickets` | **工单线程** | ShipAny Next settings/tickets |
| `/ref/api-keys` | **API Keys** | ShipAny Next settings/apikeys |
| `/ref/credits` | **积分账本** | ShipAny Next settings/credits |
| `/ref/billing` | **订阅账单** | ShipAny Next settings/billing |
| `/ref/settings` | 设置 | settings/* |
| `/ref/activity` | 时间线 | crm/activity |
| `/ref/queue` | 待办队列 | approvals todo |
| `/ref/empty` | 空态 | accounts empty |

源码：`app/(app)/ref/**` · 目录：`lib/reference/catalog.ts`

## Agent 用法

1. 定角色 → 打开对应 `/ref/...`  
2. 接业务时抄 **accounts / approvals** 的数据层  
3. props 查 `../forge/docs/for-agents/` 与 cases  

**优先级：** 可运行业务样板 > `/ref/*` > monorepo 全文 template。
