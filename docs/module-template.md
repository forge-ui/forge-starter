# 模块与页面文件地图

**后端切片**与 **页面切片**分开做。  
Skill：`forge-starter-new-module` → `forge-starter-new-page`。

## 样板（无默认）

| 样板 | UI | 适合 |
|------|-----|------|
| `accounts` | 列表 + 表单弹窗 + **全页详情** | 重内容、档案、多区块 |

轻详情（字段少、看完回列表）**暂无第二业务样板**，对照 `/ref/detail-modal` + 本仓 `Modal` + `?id=`。  
选型：用户指定 → 听用户；否则按内容；拿不准 → 问。理由写进交付说明。

## A. 后端切片（new-module）

```text
lib/<resource>/types.ts
lib/<resource>/service.ts
lib/<resource>/agent.ts          # 要被 Ask AI 操作时；并登记到 lib/agent/registry.ts
lib/db/schema.ts              # 开发库可 pnpm db:push；提交用 db:generate，环境用 db:migrate
app/api/<resource>/route.ts
app/api/<resource>/[id]/route.ts
components/<resource>-store.tsx   # 默认 new-page；仅显式授权时在后端阶段提前做
```

- session 守卫、`jsonOk`/`jsonError`、Zod、中文错误  
- **不**在此 skill 里规定详情全页或弹窗  
- **API 齐 ≠ 侧栏有**；挂应用模块是 new-page 的菜单三处
- Ask AI 只调用已登记工具，不读源码。不登记 `agent.ts`，助手就不知道这个模块。工具入参用 API 同一份 Zod；读工具直接执行，写工具确认后把字段填进页面表单，不在工具里写库。页面保存成功后，同一会话继续原请求里还没做的查询或导出。

## B. 页面切片（new-page）

### 共用

```text
app/(app)/<resource>/page.tsx     # 列表（collection）
components/<resource>-form-dialog.tsx
# 菜单三处（缺一不可）
config/apps.ts                    # 1 APP_MODULE_IDS  2 APP_MODULE_META
config/menu.tsx                   # 3 MODULE_MENU
config/site.ts                    # hideHeader: true（页头，不是侧栏）
# 业务页头：core PageTitleToolbar；actions 内 ToolbarActions + AskAiEntry + 业务按钮（AskAiProvider 已挂 AppShell）
```

默认应用种子勾齐新 id。`rbac_menus` 可选，只写目录不进 `APP_MODULE_IDS` 侧栏仍看不见。  
加菜单后须清 Local Storage **`forge-starter:app-registry`**（或种子默认勾齐）。

### 详情弹窗（抄 `/ref/detail-modal`，宿主用本仓 Modal；暂无第二业务样板）

```text
components/<resource>-detail-dialog.tsx
# 行点击或 ?id= 打开；[id]/page.tsx redirect → ?id=
```

### 全页详情（抄 accounts）

```text
app/(app)/<resource>/[id]/page.tsx
# 顶栏主操作；侧栏只 meta；页内返回；禁止侧栏塞导航
```

## 列表 UX

### 表格列表（accounts / list-table）

1. `PageTitleToolbar` + Breadcrumbs + 主按钮
2. **单行** `ButtonGroup` + 搜索  
3. DataTable + 分页 + 空态  
4. 新建/编辑：form modal（`components/ui/modal.tsx`）  

### 资源工作台（第三样板 · 卡片 + 可选文件夹）

适合：模型 / 工具 / 知识库 / Agent 等「资源台」，不是行表 CRUD。

1. `PageTitleToolbar` + Breadcrumbs + 主按钮（+ 可选顶栏 `KebabMenu` 多类型创建）
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

写 UI 前读 [forge-skill](https://github.com/forge-ui/forge/tree/main/skills/forge-skill)（版本副本见 `docs/forge-skill/README.md`）。新业务页推荐 `PageTitleToolbar`；紧凑 h1 是现有合法例外，不为统一改旧页。
Modal 宿主：`components/ui/modal.tsx`。  
操作反馈：`import { toast } from "@/lib/toast"`。

## 自检

- [ ] 先有 API/service，再接页面（或同会话严格按此序）  
- [ ] 详情形态有选择与理由  
- [ ] 筛选单行  
- [ ] **菜单三处**：`APP_MODULE_IDS` + `APP_MODULE_META` + `MODULE_MENU`；默认应用勾齐新 id  
- [ ] 默认产品已合并新模块；自建应用已手动勾选（仅明确重置时清 Local Storage）
- [ ] 无 `{module}:read` 直链业务页会 `replace` 回工作台（壳层，不只藏侧栏）  
- [ ] 技术：`pnpm check`；规范：完整 forge-starter-audit；浏览器：从侧栏点主路径，分别记录，未验不冒充通过
