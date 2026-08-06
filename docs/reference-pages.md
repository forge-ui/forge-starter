# AI 参考页（真实路由 · 不进菜单）

路径前缀：**`/ref/*`**

- **是** 真实 Next 页面，可打开、可抄结构  
- **不是** 产品功能：不在 `config/menu.tsx` 侧栏  
- **生产** 默认 404；本地开发默认可访问  
- 生产若需打开：环境变量 `SHOW_REF_PAGES=true`

## 索引

打开 **`/ref/`** 查看全部范式卡片。

| 路由 | 范式 | 对照 |
|------|------|------|
| `/ref/list-table` | 列表 · 表格 | ecommerce/customers、accounts |
| `/ref/list-cards` | 列表 · 卡片网格 | project projects |
| `/ref/detail` | 详情 · 全页业务档案 | accounts/[id] |
| `/ref/profile` | 详情 · **个人/成员**（左资料卡 + 右 KPI/Tab） | project members/[id] |
| `/ref/detail-modal` | 详情 · 弹窗 | approvals |
| `/ref/form-page` | 表单 · 整页 | products/new |
| `/ref/form-modal` | 表单 · 弹窗 | form dialogs |
| `/ref/split` | 主从分屏 | project clients |
| `/ref/settings` | 设置分组 | settings/* |
| `/ref/activity` | 时间线 | crm activity |
| `/ref/queue` | 待办队列 | 行内通过/驳回 |
| `/ref/empty` | 空态 | accounts empty |
| `/ref/dashboard-kpi` | 看板 KPI | ecommerce-2（完整见 /dashboard） |

源码：`app/(app)/ref/**`，目录元数据：`lib/reference/catalog.ts`。

## Agent 怎么用

1. 定角色（`docs/page-roles.md`）  
2. 打开对应 `/ref/...` **对照布局与组件组合**  
3. 业务数据接 `new-module` API，交互抄可运行样板 accounts/approvals  
4. 组件 props 再查 `../forge/docs/for-agents/` 与 cases  

**优先级：** 可运行业务样板（accounts/approvals）> `/ref/*` 范式页 > monorepo templates 全文。
