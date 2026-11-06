# 全部模板 Screen 目录

以下为仓内实际页面，不承诺样例数据具有业务后端。先选最接近任务的一个作风格基准，再改内容与路由。

## 如何本地预览模板

在用户授权的 Forge 主仓 checkout 中运行（不要在 starter 目录运行模板服务）：

```sh
export PATH=~/.nvm/versions/node/v22.23.2/bin:$PATH
corepack pnpm dev --hostname 127.0.0.1 --port 3219
```

如依赖未安装，先 `corepack pnpm install --frozen-lockfile`。打开 `http://127.0.0.1:3219/templates/dashboards/ecommerce-3`；analytics 为 `/templates/dashboards/analytics`，项目成员页为 `/templates/project-template/members`。路由分组 `(dashboards)` 不进入 URL。完整路由可运行 `node skills/forge-skill/scripts/list.mjs templates`。

生产预览可先 `corepack pnpm build`，再 `corepack pnpm start --hostname 127.0.0.1 --port 3219`，只在本地监听，不发布。starter 的业务页与 Forge 模板是两个服务：对照时保持同视口、侧栏状态与字号，复用已有 Chrome，不启动系统 Chrome 新 profile。端口被占用时核对服务归属，不能杀其他任务；结束只停止自己创建的服务。没有可运行的源码/服务或浏览器权限时，报告未验证，静态源码不能冒充视觉验收。

| Screen | 适用场景 | 源码 |
|---|---|---|
| analytics | 经营指标、趋势与辅助分析 | src/app/templates/(dashboards)/dashboards/analytics/page.tsx |
| crm | 客户与销售概览 | src/app/templates/(dashboards)/dashboards/crm/page.tsx |
| ecommerce-1 | 电商经营概览 | src/app/templates/(dashboards)/dashboards/ecommerce-1/page.tsx |
| ecommerce-2 | 电商数据与明细并列 | src/app/templates/(dashboards)/dashboards/ecommerce-2/page.tsx |
| ecommerce-3 | 多维电商经营与渠道分析 | src/app/templates/(dashboards)/dashboards/ecommerce-3/page.tsx |
| finance-1 | 财务概览 | src/app/templates/(dashboards)/dashboards/finance-1/page.tsx |
| finance-2 | 账户与交易分析 | src/app/templates/(dashboards)/dashboards/finance-2/page.tsx |
| finance-3 | 窄侧栏加宽财务主区 | src/app/templates/(dashboards)/dashboards/finance-3/page.tsx |
| project-1 | 项目进展与协作概览 | src/app/templates/(dashboards)/dashboards/project-1/page.tsx |
| project-2 | 项目任务与资源概览 | src/app/templates/(dashboards)/dashboards/project-2/page.tsx |

具体布局与尺寸见 [页面规范](page-recommended-standard.md)；区块抽取状态见 [Blocks](blocks.md)。

## 实现分层

十个页面已直接使用 AppLayout；卡壳用 Panel，区块从 blocks/ 复制。原 dashboard-density、DashboardShell、Figma 前缀图表与私有 WalletGoalCard 已删除；公共图表与密度 API 见 [Blocks](blocks.md)。

这是源码迁移状态，不是截图验收结论：须逐页比较 1440 与 375 两档、同字体/侧栏/固定数据的前后截图，记录不同尺寸或有意差异，不能用 build 代替。

## 全部业务与工作区 Screens

以下 74 个页面源码与前述 10 个看板及看板入口共同构成 85 个 Screen。看板入口 `/templates/dashboards` 的源码为 `src/app/templates/(dashboards)/dashboards/page.tsx`。路由组不进入 URL；示例路径使用各模板 mock 中存在的 ID。认证页仅演示界面，创建/编辑和协作默认使用本地数据，不代表已接入后台。

### ecommerce

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/ecommerce/categories` | `/templates/ecommerce/categories` | src/app/templates/(dashboard)/ecommerce/categories/page.tsx |
| `/templates/ecommerce/categories/[id]` | `/templates/ecommerce/categories/1`、`/templates/ecommerce/categories/new` | src/app/templates/(dashboard)/ecommerce/categories/[id]/page.tsx |
| `/templates/ecommerce/categories/[id]/edit` | `/templates/ecommerce/categories/1/edit` | src/app/templates/(dashboard)/ecommerce/categories/[id]/edit/page.tsx |
| `/templates/ecommerce/categories/new` | `/templates/ecommerce/categories/new` | src/app/templates/(dashboard)/ecommerce/categories/new/page.tsx |
| `/templates/ecommerce/customers` | `/templates/ecommerce/customers` | src/app/templates/(dashboard)/ecommerce/customers/page.tsx |
| `/templates/ecommerce/customers/[id]` | `/templates/ecommerce/customers/1` | src/app/templates/(dashboard)/ecommerce/customers/[id]/page.tsx |
| `/templates/ecommerce/orders` | `/templates/ecommerce/orders` | src/app/templates/(dashboard)/ecommerce/orders/page.tsx |
| `/templates/ecommerce/orders/[id]` | `/templates/ecommerce/orders/1`、`/templates/ecommerce/orders/new` | src/app/templates/(dashboard)/ecommerce/orders/[id]/page.tsx |
| `/templates/ecommerce/orders/[id]/invoice` | `/templates/ecommerce/orders/1/invoice` | src/app/templates/(dashboard)/ecommerce/orders/[id]/invoice/page.tsx |
| `/templates/ecommerce/orders/new` | `/templates/ecommerce/orders/new` | src/app/templates/(dashboard)/ecommerce/orders/new/page.tsx |
| `/templates/ecommerce/products` | `/templates/ecommerce/products` | src/app/templates/(dashboard)/ecommerce/products/page.tsx |
| `/templates/ecommerce/products/[id]` | `/templates/ecommerce/products/1`、`/templates/ecommerce/products/new` | src/app/templates/(dashboard)/ecommerce/products/[id]/page.tsx |
| `/templates/ecommerce/products/[id]/edit` | `/templates/ecommerce/products/1/edit` | src/app/templates/(dashboard)/ecommerce/products/[id]/edit/page.tsx |
| `/templates/ecommerce/products/new` | `/templates/ecommerce/products/new` | src/app/templates/(dashboard)/ecommerce/products/new/page.tsx |
| `/templates/ecommerce/sellers` | `/templates/ecommerce/sellers` | src/app/templates/(dashboard)/ecommerce/sellers/page.tsx |
| `/templates/ecommerce/sellers/[id]` | `/templates/ecommerce/sellers/1` | src/app/templates/(dashboard)/ecommerce/sellers/[id]/page.tsx |

### agent

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/agent` | `/templates/agent` | src/app/templates/agent/page.tsx |

### crm-template

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/crm-template` | `/templates/crm-template` | src/app/templates/crm-template/page.tsx |
| `/templates/crm-template/activity` | `/templates/crm-template/activity` | src/app/templates/crm-template/activity/page.tsx |
| `/templates/crm-template/customers` | `/templates/crm-template/customers` | src/app/templates/crm-template/customers/page.tsx |
| `/templates/crm-template/customers/[id]` | `/templates/crm-template/customers/john-bushmill`、`/templates/crm-template/customers/new` | src/app/templates/crm-template/customers/[id]/page.tsx |
| `/templates/crm-template/customers/new` | `/templates/crm-template/customers/new` | src/app/templates/crm-template/customers/new/page.tsx |
| `/templates/crm-template/forgot-password` | `/templates/crm-template/forgot-password` | src/app/templates/crm-template/forgot-password/page.tsx |
| `/templates/crm-template/leads` | `/templates/crm-template/leads` | src/app/templates/crm-template/leads/page.tsx |
| `/templates/crm-template/leads/[id]` | `/templates/crm-template/leads/lead-john-bushmill`、`/templates/crm-template/leads/new` | src/app/templates/crm-template/leads/[id]/page.tsx |
| `/templates/crm-template/leads/new` | `/templates/crm-template/leads/new` | src/app/templates/crm-template/leads/new/page.tsx |
| `/templates/crm-template/overview` | `/templates/crm-template/overview` | src/app/templates/crm-template/overview/page.tsx |
| `/templates/crm-template/register` | `/templates/crm-template/register` | src/app/templates/crm-template/register/page.tsx |
| `/templates/crm-template/reset-password` | `/templates/crm-template/reset-password` | src/app/templates/crm-template/reset-password/page.tsx |
| `/templates/crm-template/sales` | `/templates/crm-template/sales` | src/app/templates/crm-template/sales/page.tsx |
| `/templates/crm-template/sales/[id]` | `/templates/crm-template/sales/sales-web-redesign-1`、`/templates/crm-template/sales/new` | src/app/templates/crm-template/sales/[id]/page.tsx |
| `/templates/crm-template/sales/new` | `/templates/crm-template/sales/new` | src/app/templates/crm-template/sales/new/page.tsx |

### dashboard-builder

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/dashboard-builder` | `/templates/dashboard-builder` | src/app/templates/dashboard-builder/page.tsx |
| `/templates/dashboard-builder/[variant]` | `/templates/dashboard-builder/light-topbar`、`/templates/dashboard-builder/light-sidebar`、`/templates/dashboard-builder/purple-topbar`、`/templates/dashboard-builder/purple-sidebar`、`/templates/dashboard-builder/blue-topbar`、`/templates/dashboard-builder/blue-sidebar`、`/templates/dashboard-builder/black-topbar`、`/templates/dashboard-builder/black-sidebar` | src/app/templates/dashboard-builder/[variant]/page.tsx |

### finance-template

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/finance-template` | `/templates/finance-template` | src/app/templates/finance-template/page.tsx |
| `/templates/finance-template/cards` | `/templates/finance-template/cards` | src/app/templates/finance-template/cards/page.tsx |
| `/templates/finance-template/forgot-password` | `/templates/finance-template/forgot-password` | src/app/templates/finance-template/forgot-password/page.tsx |
| `/templates/finance-template/invoices` | `/templates/finance-template/invoices` | src/app/templates/finance-template/invoices/page.tsx |
| `/templates/finance-template/invoices/[id]` | `/templates/finance-template/invoices/inv302012-lisa-greg`、`/templates/finance-template/invoices/new` | src/app/templates/finance-template/invoices/[id]/page.tsx |
| `/templates/finance-template/invoices/new` | `/templates/finance-template/invoices/new` | src/app/templates/finance-template/invoices/new/page.tsx |
| `/templates/finance-template/overview` | `/templates/finance-template/overview` | src/app/templates/finance-template/overview/page.tsx |
| `/templates/finance-template/register` | `/templates/finance-template/register` | src/app/templates/finance-template/register/page.tsx |
| `/templates/finance-template/reset-password` | `/templates/finance-template/reset-password` | src/app/templates/finance-template/reset-password/page.tsx |
| `/templates/finance-template/transactions` | `/templates/finance-template/transactions` | src/app/templates/finance-template/transactions/page.tsx |
| `/templates/finance-template/wallets` | `/templates/finance-template/wallets` | src/app/templates/finance-template/wallets/page.tsx |
| `/templates/finance-template/wealth` | `/templates/finance-template/wealth` | src/app/templates/finance-template/wealth/page.tsx |

### micellaneous-template

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/micellaneous-template` | `/templates/micellaneous-template` | src/app/templates/micellaneous-template/page.tsx |
| `/templates/micellaneous-template/actions` | `/templates/micellaneous-template/actions` | src/app/templates/micellaneous-template/actions/page.tsx |
| `/templates/micellaneous-template/calendar` | `/templates/micellaneous-template/calendar` | src/app/templates/micellaneous-template/calendar/page.tsx |
| `/templates/micellaneous-template/chat` | `/templates/micellaneous-template/chat` | src/app/templates/micellaneous-template/chat/page.tsx |
| `/templates/micellaneous-template/files` | `/templates/micellaneous-template/files` | src/app/templates/micellaneous-template/files/page.tsx |
| `/templates/micellaneous-template/forgot-password` | `/templates/micellaneous-template/forgot-password` | src/app/templates/micellaneous-template/forgot-password/page.tsx |
| `/templates/micellaneous-template/register` | `/templates/micellaneous-template/register` | src/app/templates/micellaneous-template/register/page.tsx |
| `/templates/micellaneous-template/reset-password` | `/templates/micellaneous-template/reset-password` | src/app/templates/micellaneous-template/reset-password/page.tsx |

### 模板入口

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates` | `/templates` | src/app/templates/page.tsx |

### project-template

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/project-template` | `/templates/project-template` | src/app/templates/project-template/page.tsx |
| `/templates/project-template/clients` | `/templates/project-template/clients` | src/app/templates/project-template/clients/page.tsx |
| `/templates/project-template/clients/[id]` | `/templates/project-template/clients/mary` | src/app/templates/project-template/clients/[id]/page.tsx |
| `/templates/project-template/files` | `/templates/project-template/files` | src/app/templates/project-template/files/page.tsx |
| `/templates/project-template/invoices` | `/templates/project-template/invoices` | src/app/templates/project-template/invoices/page.tsx |
| `/templates/project-template/members` | `/templates/project-template/members` | src/app/templates/project-template/members/page.tsx |
| `/templates/project-template/members/[id]` | `/templates/project-template/members/linda` | src/app/templates/project-template/members/[id]/page.tsx |
| `/templates/project-template/overview` | `/templates/project-template/overview` | src/app/templates/project-template/overview/page.tsx |
| `/templates/project-template/projects` | `/templates/project-template/projects` | src/app/templates/project-template/projects/page.tsx |
| `/templates/project-template/projects/[id]` | `/templates/project-template/projects/alpha` | src/app/templates/project-template/projects/[id]/page.tsx |
| `/templates/project-template/tasks/[id]` | `/templates/project-template/tasks/marketing-partnership` | src/app/templates/project-template/tasks/[id]/page.tsx |

### task-board

| 路由模式 | 可访问示例 | 源码 |
|---|---|---|
| `/templates/task-board` | `/templates/task-board` | src/app/templates/task-board/page.tsx |
| `/templates/task-board/agents` | `/templates/task-board/agents` | src/app/templates/task-board/agents/page.tsx |
| `/templates/task-board/agents/[agent]` | `/templates/task-board/agents/research` | src/app/templates/task-board/agents/[agent]/page.tsx |
| `/templates/task-board/library` | `/templates/task-board/library` | src/app/templates/task-board/library/page.tsx |
| `/templates/task-board/projects` | `/templates/task-board/projects` | src/app/templates/task-board/projects/page.tsx |
| `/templates/task-board/projects/[project]` | `/templates/task-board/projects/%E5%93%81%E7%89%8C%E7%84%95%E6%96%B0%E8%AE%A1%E5%88%92` | src/app/templates/task-board/projects/[project]/page.tsx |
| `/templates/task-board/tasks` | `/templates/task-board/tasks` | src/app/templates/task-board/tasks/page.tsx |
| `/templates/task-board/today` | `/templates/task-board/today` | src/app/templates/task-board/today/page.tsx |

## 复用与本地边界

- ecommerce：公开 core 控件、Panel / InfoRow 与模板共用弹窗；订单、商品、分类、客户和物流的 mock、字段规则与路由适配保留本地。
- crm-template：crm-summary Block 承担摘要与趋势，客户/线索/销售状态和活动演示保留本地。
- project-template：KpiMetrics / ProjectSection Blocks；项目、客户、成员、任务与甘特演示模型保留本地，品牌色集中在 `_mock-palette.ts`。
- finance-template：finance-workspace Block；账单/钱包/财富路由和 mock 保留本地。
- task-board：core SurfaceCard、Board、TaskCard 及各业务控件；任务存储、拖拽、工作区上下文、编辑器和协作演示保留本地，不冒充通用 Block。
- micellaneous-template：TemplateSurface Block；日历、聊天、文件和表格操作使用 core，页面导航、样例数据与本地状态保留。
- agent：ConversationHeader Block；AgentTurn、样例来源、流式演示与会话存储保留本地。
- dashboard-builder：core AppLayout，画廊使用 Panel custom/asChild 保留 Next Link 根节点；8 个变体的路由元数据保留本地。
- `_shared`：Panel / InfoRow 直接转出 core；Modal 仅保留 onClose 接口适配；Protask 身份、mock 筛选、活动/认证演示不进入 core。

以上为源码适配事实；1440/375 的前后截图、真实点击、移动端与辅助技术验收仍需逐条补齐，不以静态检查替代。
