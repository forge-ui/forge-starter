# AI 参考页（真实路由 · 不进菜单）

路径前缀：**`/ref/*`**

- 真实 Next 页面，可打开、可抄结构  
- 专供布局对照，默认不进产品侧栏  
- 生产默认 404；需要时设 `SHOW_REF_PAGES=true`  

## 索引

打开 **`/ref/`**。

| 路由 | 范式 | 官网/模板对照 | 精简后看哪里 |
|------|------|----------------|--------------|
| `/ref/list-table` | 列表 · 表格 | ecommerce/customers | Screen `ecommerce/customers` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/list-table) |
| `/ref/list-cards` | 列表 · 卡片 | project/projects | Screen `project-template/projects` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/list-cards) |
| `/ref/detail` | 业务对象详情 | ecommerce/customers/[id] | Screen `ecommerce/customers/[id]` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/detail) |
| `/ref/person` | **CRM 人物详情**（多 Tab） | [customers/john-bushmill](https://www.forgeui.org/templates/crm-template/customers/john-bushmill) | Screen `crm-template/customers/[id]` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/person) |
| `/ref/profile` | 项目成员详情 | project/members/[id] | Screen `project-template/members/[id]` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/profile) |
| `/ref/product` | **产品详情**（多 Tab） | ecommerce/products/[id] | Screen `ecommerce/products/[id]` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/product) |
| `/ref/detail-modal` | 详情弹窗 | 官网列表 view dialog | 保留 |
| `/ref/form-page` | **整页表单** | [crm leads/new](https://www.forgeui.org/templates/crm-template/leads/new) | Screen `crm-template/leads/new` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/form-page) |
| `/ref/form-modal` | 表单弹窗 | customers Add Modal | Screen `ecommerce/customers`（新建弹窗） · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/form-modal) |
| `/ref/split` | 主从分屏 | project/clients | Screen `project-template/clients` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/split) |
| `/ref/calendar` | **日历** | micellaneous/calendar | Screen `micellaneous-template/calendar` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/calendar) |
| `/ref/chat` | **对话** | micellaneous/chat | Screen `micellaneous-template/chat` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/chat) |
| `/ref/agent` | **Agent 组件** | [cases/agent](https://www.forgeui.org/cases/agent) | [forgeui.org/components/agent](https://forgeui.org/components/agent) · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/agent) |
| `/ref/checklist` | **Checklist** | [cases/checklist](https://www.forgeui.org/cases/checklist) | [forgeui.org/components/checklist](https://forgeui.org/components/checklist) · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/checklist) |
| `/ref/files` | **文件清单** | micellaneous/files | Screen `micellaneous-template/files` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/files) |
| `/ref/dashboard-board` | Dashboard · 通用条 | ecommerce-2 骨架 | Screen `dashboards/ecommerce-2` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/dashboard-board) |
| `/ref/dashboard-kpi` | Dashboard · 精简 KPI | ecommerce-2 | Screen `dashboards/ecommerce-2` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/dashboard-kpi) |
| `/ref/dashboard-crm` | **Dashboard · CRM** | [dashboards/crm](https://www.forgeui.org/templates/dashboards/crm) | Screen `dashboards/crm` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/dashboard-crm) |
| `/ref/dashboard-analytics` | **Dashboard · Analytics** | [dashboards/analytics](https://www.forgeui.org/templates/dashboards/analytics) | Screen `dashboards/analytics` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/dashboard-analytics) |
| `/ref/dashboard-project` | **Dashboard · Project** | [dashboards/project-1](https://www.forgeui.org/templates/dashboards/project-1) | Screen `dashboards/project-1` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/dashboard-project) |
| `/ref/invoice` | **发票/单据详情** | finance-template/invoices/[id] | Screen `finance-template/invoices/[id]` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/invoice) |
| `/ref/task` | **任务详情** | project-template/tasks/[id] | Screen `project-template/tasks/[id]` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/task) |
| `/ref/project` | **项目详情（多 Tab）** | project-template/projects/[id] | Screen `project-template/projects/[id]` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/project) |
| `/ref/kanban` | **Kanban 泳道** | 项目详情 Task tab 内嵌，抽出独立页 | Screen `task-board/tasks` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/kanban) |
| `/ref/tickets` | **工单线程** | 工单线程范式 | [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/tickets) |
| `/ref/api-keys` | **API Keys** | API Key 生命周期 | [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/api-keys) |
| `/ref/credits` | **积分账本** | 积分账本 | [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/credits) |
| `/ref/billing` | **订阅账单** | 订阅账单 | [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/billing) |
| `/ref/settings` | 设置 | settings/* | [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/settings) |
| `/ref/activity` | 时间线 | crm/activity | Screen `crm-template/activity` · [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/activity) |
| `/ref/queue` | 待办队列 | — | [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/queue) |
| `/ref/resource-workspace` | 资源工作台 · 文件夹 + 卡片 | `/models` 模型卡片台 | 保留 |
| `/ref/empty` | 空态 | accounts empty | [上游源码](https://github.com/forge-ui/forge-starter/tree/main/app/(app)/ref/empty) |

源码：`app/(app)/ref/**` · 目录：`lib/reference/catalog.ts`

## 精简模式

不需要这些参考页时运行 `pnpm simple`（先预览）和 `pnpm simple --yes`（执行，要求工作区已提交）。只保留 `/ref` 索引、`/ref/detail-modal`（轻详情唯一样板）和 `/ref/resource-workspace`（资源工作台样板），只被删除页面使用的演示文件一并删掉；账号管理等业务模块不动。

删掉的页面看上表「精简后看哪里」：`Screen` 用 Forge MCP 的 `get_screen` 查源码，或在 forgeui.org/templates 下打开；没有官网对照的看上游源码。

## Agent 用法

1. 定角色 → 打开对应 `/ref/...`  
2. 接业务时抄 **accounts** 的数据层；轻详情接线用本仓 `Modal` + `?id=`  
3. props 查 `../forge/docs/for-agents/` 与 cases  

**视觉优先级：** 主仓 Screens / template 是基准，尤其看板；按角色选一个主 Screen。**集成优先级：** Starter 可运行业务样板负责数据、query、宿主和权限接线，`/ref/*` 仅示范布局。

通用标准：[forge-skill](https://github.com/forge-ui/forge/tree/main/skills/forge-skill)，版本副本见 [forge-skill/README.md](forge-skill/README.md)。

## 对照证据元数据

现有目录对应 core 0.4.7 依赖目标；并不表示已完成该版本全页面浏览器验收。按 `page-roles.md` 映射逐页建记录：角色、主 Screen 源码路径或 node、core 实际安装版本、截图日期、已验收/仅静态/已知债。尚无本轮截图的页面统一记“仅静态，截图日期未记录”，不得补造通过。看板缺主 Screen 测量基线时不能交付视觉通过。
