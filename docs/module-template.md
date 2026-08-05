# CRUD 模块模板

**先选型，再抄代码。** 不要默认整包复制 `accounts`（含全页详情）。

| 形态 | 样板 | 适用 |
|------|------|------|
| 轻模块（默认） | `approvals` | 字段少、看完就走、审批/单据/简单资源 |
| 重模块 | `accounts` | Tab、图表、关联列表、档案式详情 |

Skill：`.agents/skills/forge-starter-new-module/SKILL.md`。

## 决策：详情弹窗 vs 全页

```text
字段一眼看完、主操作 1～3 个？
  └─ 是 → detail-modal（列表上叠弹窗）     样板: approvals
  └─ 否 → 有多 Tab / 图 / 关联表？
           └─ 是 → detail-page             样板: accounts
           └─ 否 → 仍优先 modal
```

## 文件地图

### 共用

```text
lib/<resource>/types.ts
lib/<resource>/service.ts
lib/db/schema.ts                 # + pgTable → pnpm db:push
app/api/<resource>/route.ts      # GET list, POST create
app/api/<resource>/[id]/route.ts # GET one, PATCH/POST actions, DELETE
components/<resource>-store.tsx
components/<resource>-form-dialog.tsx   # 新建/编辑
app/(app)/<resource>/page.tsx           # 列表
config/menu.tsx
config/site.ts                          # hideHeader: true
```

### detail-modal（默认）

```text
components/<resource>-detail-dialog.tsx
# page.tsx：行点击 / ?id= / 创建成功 → 开详情弹窗
# 可选 [id]/page.tsx：redirect → /<resource>/?id=
```

### detail-page

```text
app/(app)/<resource>/[id]/page.tsx
# 顶栏主操作；侧栏只读；页内返回（hideHeader 时壳 onBack 不显示）
```

## 列表页必备

1. Header：`h1` + `Breadcrumbs` + 主按钮「新建」  
2. **单行**筛选：`ButtonGroup` + 搜索 `TextField`（**禁止两行 pills**）  
3. `DataTable` + 分页 + 空态  
4. 新建/编辑：form modal  
5. 删除：`ConfirmationDialog`（若有）  

参考：`app/(app)/accounts/page.tsx` 的筛选行布局。

## 表单弹窗

- 宿主：`components/ui/modal.tsx`  
- 字段：`TextField` / `SelectOption` / `TextArea`  
- 校验：前端 + service  
- 保存成功：关弹窗；轻模块可紧接着开详情弹窗  

## 详情

### modal

- 字段 + 状态 badge + 底栏关闭/主操作  
- 关弹窗 = 回列表，不需要「返回列表」按钮  

### page

- 顶栏：编辑/删除等主操作（对齐 accounts）  
- 侧栏：**只** 只读摘要，**禁止** 塞返回/导航  
- 返回：页内 `←` 或面包屑（因列表/详情通常 `hideHeader: true`）  
- 不存在：空态 + 返回列表  

## API

- `getSessionUser()`，未登录 401  
- `jsonOk` / `jsonError`  
- Zod + 中文错误  

## 命名

| 概念 | 示例 |
|------|------|
| 路由段 | `orders` / `approvals` |
| 表名 | `orders` / `approval_requests` |
| 组件 | `OrderFormDialog` / `ApprovalDetailDialog` |

## 自检清单

- [ ] 详情形态已显式选择（modal | page）且合理  
- [ ] 列表筛选只有 **一行**  
- [ ] schema push；CRUD/关键动作可演示；刷新仍在  
- [ ] **浏览器**打开过列表与详情，不是只 curl  
- [ ] 菜单可点、`color={siteConfig.accent}`  
- [ ] `pnpm typecheck`  
- [ ] 无假按钮  
