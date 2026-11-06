# Starter 页面角色与接线目录

通用角色、线框和模板标准唯一正文：[forge-skill](https://github.com/forge-ui/forge/tree/main/skills/forge-skill)。同步入口见 [forge-skill/README.md](forge-skill/README.md)，同步后读 `forge-skill/upstream/references/page-recommended-standard.md` 与 `page-design-dimensional.md`。模板为风格基准，Starter 业务页为接线参考，二者不是同一验收。

## 选型与工作流

- 先确认角色与一个主 Screen，再选择已交付 Blocks / Components；看板记录模板路径、比例、gap、区块尺寸和并排截图。未发布的 Panel/Blocks 标 FORGE-GAP 并询问，不虚构 import。
- 重详情接 `accounts/[id]`；轻详情接 `/ref/detail-modal` + 本地 Modal + `?id=`，保留筛选上下文。暂无第二套完整业务轻详情样板。无全局默认，拿不准问用户。
- 新业务页推荐 `PageTitleToolbar`；accounts 紧凑 h1 是合法现有范式，不为统一重写。`hideHeader: true` 时壳 `onBack` 不渲染。
- 整域：`forge-starter-new-module` → `forge-starter-new-page` → `forge-starter-audit`；看板只需后两步。每步分别报告技术与浏览器结果。
- 菜单三处、应用勾选和 RBAC 按 AGENTS；壳与页面动效按 [page-motion.md](page-motion.md)。

## Starter 可渲染参考页（不进菜单）

开发环境打开 **`/ref/`**。生产默认关闭，见 `docs/reference-pages.md`。

| 角色 | `/ref/*` | 业务可运行样板 |
|------|----------|----------------|
| collection-table | `/ref/list-table` | accounts 列表 |
| collection-cards | `/ref/list-cards` | — |
| detail | `/ref/detail` | accounts/[id] |
| person（CRM 人物多 Tab） | `/ref/person` | — john-bushmill |
| profile（项目成员） | `/ref/profile` | — members/[id] |
| product（产品多 Tab） | `/ref/product` | — products/[id] |
| detail-modal | `/ref/detail-modal` | 暂无第二业务样板（抄 `/ref/detail-modal` + `Modal` + `?id=`） |
| form-page（整页） | `/ref/form-page` | — leads/new |
| form-modal | `/ref/form-modal` | *-form-dialog |
| split | `/ref/split` | — |
| calendar | `/ref/calendar` | — |
| chat | `/ref/chat` | — |
| agent | `/ref/agent` | Ask AI 示范问答 |
| checklist | `/ref/checklist` | `/ref/task` 清单 |
| files | `/ref/files` | — |
| settings | `/ref/settings` | `settings/apps` + 头像菜单弹窗 |
| activity | `/ref/activity` | — |
| queue | `/ref/queue` | — |
| empty | `/ref/empty` | 各列表空态 |
| dashboard | `/ref/dashboard-board` · `/ref/dashboard-kpi` · `/ref/dashboard-crm` · `/ref/dashboard-analytics` · `/ref/dashboard-project` | `/dashboard` |
| invoice 单据 | `/ref/invoice` | — |
| task 任务 | `/ref/task` | — |
| resource-workspace | `/ref/resource-workspace` | `/models` 模型卡片台 |
| project 项目 | `/ref/project` | — |
| kanban 泳道 | `/ref/kanban`（官方嵌在 project Task tab） | — |
| tickets 工单线程 | `/ref/tickets` | — |
| api-keys | `/ref/api-keys` | — |
| credits 积分账本 | `/ref/credits` | — |
| billing 订阅 | `/ref/billing` | — |


## 参考边界

本目录只存 Starter 角色到路由的映射，完整目录与证据元数据见 [reference-pages.md](reference-pages.md)。不把 `/ref` 假数据展示当完整业务，不以 accounts 覆盖主仓 Screens 的视觉规则。
