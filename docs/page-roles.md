# 页面角色 → 官方 Template 对照表

Agent / 人类写后台页时 **先定角色，再抄 template**。  
不依赖任何已废弃的设计插件；唯一权威是 **Forge monorepo 模板源码** + 本表 + `docs/module-template.md`。

## 模板源码位置

本机旁路 monorepo（常见）：

```text
../forge/src/app/templates/
  (dashboards)/dashboards/          # 各业务看板
  (dashboard)/ecommerce/            # 电商 CRUD（customers/products/orders…）
  crm-template/                     # CRM 线索/客户
  finance-template/
  project-template/
  micellaneous-template/            # 日历/聊天/文件等
  _shared/                          # Modal 等宿主壳（仅参考，非 Kit 导出）
```

若路径不存在：用 [forgeui.org/templates](https://www.forgeui.org/templates) 对照视觉，仍以 Kit 组件拼装。

## 角色判定（先选一个）

| 角色 | 用户意图关键词 | 页内主结构 |
|------|----------------|------------|
| **dashboard** | 工作台、概览、指标、趋势 | 指标卡 + 图表 + 次级列表 |
| **collection** | 列表、管理、筛选、批量 | Header + 筛选/搜索 + DataTable + 空态 |
| **form-modal** | 新建、编辑（字段不多） | Modal + TextField/Select + 底栏保存 |
| **form-page** | 新建/编辑字段极多 | 页内分区卡片表单（少用） |
| **detail** | 详情、档案、侧栏信息 | 主栏 + 侧栏 + Tab/时间线 |
| **settings** | 资料、偏好、注册表配置 | 窄卡片 / 或 collection（如应用管理） |
| **auth** | 登录注册找回 | `app/(auth)`，勿重做 |

## 推荐 Template（默认抄这些）

| 角色 | 首选官方路径 | Starter 内已有样板 |
|------|--------------|-------------------|
| dashboard | `(dashboards)/dashboards/ecommerce-2` | `app/(app)/dashboard` |
| collection | `(dashboard)/ecommerce/customers` | `app/(app)/accounts`、`settings/apps` |
| form-modal | ecommerce customers **Add Modal**（`_shared/modal` + 表单） | `account-form-dialog` / `app-form-dialog` |
| form-page | ecommerce `products/new` | 仅字段很多时用 |
| detail | ecommerce `customers/[id]` | `accounts/[id]` |
| settings-单卡 | — | `settings/profile` 等 panel |
| settings-列表 | 同 collection | `settings/apps` |
| auth | finance/crm 登录页视觉 | `app/(auth)/*` |

### 备选（按业务域）

| 场景 | 可参考 |
|------|--------|
| CRM 线索详情/表单 | `crm-template/leads` |
| 发票/交易 | `finance-template/invoices`、`transactions` |
| 项目/任务/成员 | `project-template/*` |
| 日历/文件/聊天 | `micellaneous-template/*`（消息类默认不做真 IM） |
| 其它看板 | `ecommerce-1/3`、`finance-2/3`、`crm` dashboard |

## Starter 铁律（选型后）

1. 组件只来自 `@forge-ui-official/core`；Modal 宿主用 `components/ui/modal.tsx`。  
2. `color={siteConfig.accent}`（默认 blue）。  
3. CRUD 整域 → 走 **collection + form-modal + detail + API**（见 `module-template.md`），不要只抄 dashboard。  
4. 页内自带 Header 时：`config/site.ts` 对应路由 `hideHeader: true`。  
5. 官方模板里的假按钮/英文装饰 → 删掉或接真逻辑。  
6. 缺组件 → `FORGE-GAP`，不手搓 Kit 已有能力。

## Agent 决策速查

```text
用户要「xxx 管理」整域？
  └─ 是 → forge-starter-new-module（角色: collection + form-modal + detail）
  └─ 否 → 单页看板？ → new-page + dashboard 角色
         └─ 单页设置？ → settings 角色
         └─ 登录相关？ → 改 app/(auth)，不要新建 UI 体系
```

## 选型权威

选型只认：**本表 + monorepo `templates/` 源码 + accounts 样板代码**。  
不依赖任何仓库外的设计插件。
