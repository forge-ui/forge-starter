# 模块与页面文件地图

**后端切片**与 **页面切片**分开做。  
Skill：`forge-starter-new-module` → `forge-starter-new-page`。

## 双样板（无默认）

| 样板 | UI | 适合 |
|------|-----|------|
| `accounts` | 列表 + 表单弹窗 + **全页详情** | 重内容、档案、多区块 |
| 轻详情 | `/ref/detail-modal` + `Modal` + `?id=` | 字段少、处理完回列表 |

选型：用户指定 → 听用户；否则按内容；拿不准 → 问。理由写进交付说明。

## A. 后端切片（new-module）

```text
lib/<resource>/types.ts
lib/<resource>/service.ts
lib/db/schema.ts              # + pnpm db:push
app/api/<resource>/route.ts
app/api/<resource>/[id]/route.ts
components/<resource>-store.tsx   # 可选；列表页若 client fetch 需要
```

- session 守卫、`jsonOk`/`jsonError`、Zod、中文错误  
- **不**在此 skill 里规定详情全页或弹窗  

## B. 页面切片（new-page）

### 共用

```text
app/(app)/<resource>/page.tsx     # 列表（collection）
components/<resource>-form-dialog.tsx
config/menu.tsx
config/site.ts                    # hideHeader: true
```

### 详情弹窗（抄 `/ref/detail-modal`，宿主用本仓 Modal）

```text
components/<resource>-detail-dialog.tsx
# 行点击或 ?id= 打开；可选 [id]/page.tsx redirect → ?id=
# 不要去找已删除的 approvals
```

### 全页详情（抄 accounts）

```text
app/(app)/<resource>/[id]/page.tsx
# 顶栏主操作；侧栏只 meta；页内返回；禁止侧栏塞导航
```

## 列表 UX

### 表格列表（accounts / list-table）

1. `h1` + Breadcrumbs + 主按钮  
2. **单行** `ButtonGroup` + 搜索  
3. DataTable + 分页 + 空态  
4. 新建/编辑：form modal（`components/ui/modal.tsx`）  

### 资源工作台（第三样板 · 卡片 + 可选文件夹）

适合：模型 / 工具 / 知识库 / Agent 等「资源台」，不是行表 CRUD。

1. `h1` + Breadcrumbs + 主按钮（+ 可选顶栏 `KebabMenu` 多类型创建）  
2. **可选** `WorkspaceSplit`：左 `FolderNav`，右主区  
3. 主区：**单行** `ButtonGroup` + 搜索 + 计数  
4. `ResourceCard` 网格 + 空态  
5. 反馈：`toast.success/error`（禁止页内绿条）  

参考页：`/ref/resource-workspace`（假数据）。

```text
components/workspace-split.tsx   # WorkspaceSplit + FolderNav
components/resource-card.tsx     # ResourceCard
lib/toast.ts                     # 全站 toast
lib/format/datetime.ts           # formatTime / formatDateOnly
```

## 组件

写 UI 前读 `../forge/.agents/skills/forge/SKILL.md`。  
Modal 宿主：`components/ui/modal.tsx`。  
操作反馈：`import { toast } from "@/lib/toast"`。

## 自检

- [ ] 先有 API/service，再接页面（或同会话严格按此序）  
- [ ] 详情形态有选择与理由  
- [ ] 筛选单行  
- [ ] typecheck + 浏览器主路径  
