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
config/modules/<resource>.json   # 必做：知识、权限、入口、reader、可选草稿
lib/<resource>/input.ts         # API 与草稿共用 Zod
lib/<resource>/agent.ts         # 可选专用工具，由 manifest.tools 挂接
lib/db/schema.ts              # 开发库可 pnpm db:push；提交用 db:generate，环境用 db:migrate
app/api/<resource>/route.ts
app/api/<resource>/[id]/route.ts
components/<resource>-store.tsx   # 默认 new-page；仅显式授权时在后端阶段提前做
```

- session 守卫、`jsonOk`/`jsonError`、Zod、中文错误  
- **不**在此 skill 里规定详情全页或弹窗  
- **API 齐 ≠ 页面已完成**；模块 manifest 自动生成菜单，正式 UI 由 new-page 实现
- Ask AI 知识与读取从 manifest 自动登记，不读仓库源码。reader 复用现有列表服务并使用当前会话权限；可读字段白名单之外及 password/apiKey/secret/token/credential 等字段递归剔除。专用工具可选。写工具仍只提供确认单与页面草稿，不直接写库；页面保存成功后继续原请求。

### 声明与生成

`pnpm module:new inventory 库存管理` 生成 manifest、共享输入 schema、service、GET API 与页面骨架并刷新注册；service 在 PostgreSQL 实现前明确报错，不提供假业务数据，也不启用写操作。已有模块只需新增 `config/modules/<id>.json`，执行 `pnpm modules:generate`；不要编辑 `*.generated.ts`。`pnpm typecheck` / `pnpm check` 拒绝缺声明、空知识、不声明读取能力或生成结果过期。

读取声明为 `read: { service: "lib/inventory/service.ts", export: "listInventory", fields: ["id", "name", "updatedAt"] }`，函数返回记录数组，复用当前请求的会话；有行级隔离的模块必须在服务内部按当前会话过滤。`sensitiveFields` 可补充递归排除字段。确实不能读的模块使用 `read: { unavailable: "明确原因" }`。知识 `source` 指向真实源码页面；客户端目录只含声明，不包含服务或密钥。

写入可声明 `draft: { adapter: "generic", schema: { source: "lib/inventory/input.ts", export: "inputSchema" }, fields: ["name"], actions: ["create", "update", "delete"], pageAdapter: "components/inventory-form-dialog.tsx" }`。仅 schema 白名单字段能进入草稿，更新/删除要求真实记录及版本；共享 `useResourceAgent` / `resourceFormDraft` 能接收通用草稿。页面必须实现保存、删除确认与 `writeWithReceipt` 的事务适配，`If-Match` 或更新时间保护不可省略。声明存在适配文件不等于事务验收通过，脚手架不自动生成数据库迁移或安全的写入业务逻辑。通用模块保存后的续办按 manifest reader 重新读取并脱敏，内置模块保留专用读回。

## B. 页面切片（new-page）

### 共用

```text
app/(app)/<resource>/page.tsx     # 列表（collection）
components/<resource>-form-dialog.tsx
# 单一模块来源，不手改派生文件
config/modules/<resource>.json
# pnpm modules:generate 自动派生 apps/menu/知识/工具
config/site.ts                    # hideHeader: true（页头，不是侧栏）
# 业务页头：core PageTitleToolbar；actions 内 ToolbarActions + AskAiEntry + 业务按钮（AskAiProvider 已挂 AppShell）
```

默认产品自动合并新增模块；人工配置应用保留原勾选，须在应用管理选择。`rbac_menus` 仅为目录，不能代替 manifest。

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
- [ ] manifest 知识非空，reader 白名单或不可读理由完整；`pnpm modules:generate` 后 `pnpm modules:check` 通过
- [ ] 默认产品已合并新模块；人工配置应用已勾选
- [ ] 无 `{module}:read` 直链业务页会 `replace` 回工作台（壳层，不只藏侧栏）  
- [ ] 技术：`pnpm check`；规范：完整 forge-starter-audit；浏览器：从侧栏点主路径，分别记录，未验不冒充通过
