# 模块与页面文件地图

对齐 ShipAny Next：**后端切片**与 **页面切片**分开做。  
Skill：`forge-starter-new-module` → `forge-starter-new-page`。

## 双样板（无默认）

| 样板 | UI | 适合 |
|------|-----|------|
| `accounts` | 列表 + 表单弹窗 + **全页详情** | 重内容、档案、多区块 |
| `approvals` | 列表 + 表单弹窗 + **详情弹窗** | 字段少、处理完回列表 |

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

### 详情弹窗（抄 approvals）

```text
components/<resource>-detail-dialog.tsx
# 行点击 / ?id= 打开；可选 [id]/page.tsx redirect → ?id=
```

### 全页详情（抄 accounts）

```text
app/(app)/<resource>/[id]/page.tsx
# 顶栏主操作；侧栏只 meta；页内返回；禁止侧栏塞导航
```

## 列表 UX

1. `h1` + Breadcrumbs + 主按钮  
2. **单行** `ButtonGroup` + 搜索  
3. DataTable + 分页 + 空态  
4. 新建/编辑：form modal（`components/ui/modal.tsx`）  

## 组件

写 UI 前读 `../forge/.agents/skills/forge/SKILL.md`。  
Modal 宿主：`components/ui/modal.tsx`。

## 自检

- [ ] 先有 API/service，再接页面（或同会话严格按此序）  
- [ ] 详情形态有选择与理由  
- [ ] 筛选单行  
- [ ] typecheck + 浏览器主路径  
