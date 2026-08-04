# CRUD 模块模板（账号管理样板）

所有新业务域默认按此地图复制，再全局替换资源名。

## 文件地图（accounts 样板）

```text
lib/<resource>/types.ts          # 类型、状态 meta、校验辅助
lib/<resource>/service.ts        # Drizzle CRUD
lib/db/schema.ts                 # 增加 pgTable（并 pnpm db:push）
app/api/<resource>/route.ts      # GET list, POST create
app/api/<resource>/[id]/route.ts # GET one, PATCH, DELETE
components/<resource>-store.tsx  # 客户端 fetch 缓存（可参考 accounts-store）
components/<resource>-form-dialog.tsx
app/(app)/<resource>/page.tsx           # 列表
app/(app)/<resource>/[id]/page.tsx      # 详情
app/(app)/<resource>/new/page.tsx       # redirect ?create=1（可选兼容）
app/(app)/<resource>/[id]/edit/page.tsx # redirect ?edit=id（可选兼容）
config/menu.tsx                  # 注册侧栏
```

## 列表页必备区块

1. Page header：`h1` + `Breadcrumbs` + 主按钮「新建」  
2. 筛选（`ButtonGroup`）+ 搜索（`TextField`）  
3. `DataTable`：列、行操作（编辑/删除）、分页  
4. 空态：无数据 / 无匹配  
5. 弹窗：新建/编辑共用 form dialog  
6. 删除：`ConfirmationDialog` + 半透明遮罩  

## 表单弹窗

- 宿主：`components/ui/modal.tsx`（core 无通用 Modal）  
- 字段：`TextField` / `SelectOption` / `TextArea`  
- 多选：`SelectOption type="multiple"`  
- 校验：前端 + service 双端  
- 保存成功：关弹窗、刷新列表或跳详情  

## 详情页

- 面包屑 + 编辑/删除  
- 主栏信息 + 侧栏摘要（可参考 customers/[id]）  
- 不存在：空态 + 返回列表  

## API

- 需 `getSessionUser()`，未登录 401  
- `jsonOk` / `jsonError`（`lib/auth/http.ts`）  
- Zod 校验 body  
- 错误信息可展示给用户（中文）  

## 菜单

```tsx
{
  icon: <SomeBoldDuotone size={20} />,
  label: "某某管理",
  href: "/xxx/",
}
```

## 命名约定

| 概念 | 示例 |
|------|------|
| 路由段 | `orders` |
| 表名 | `orders` |
| 类型 | `Order` / `OrderInput` |
| 组件 | `OrderFormDialog` / `OrdersStore` |

## 自检清单

- [ ] schema push 成功  
- [ ] list/create/update/delete 均可演示  
- [ ] 刷新后数据仍在（Postgres）  
- [ ] 菜单可点、accent 为 blue  
- [ ] `pnpm typecheck`  
- [ ] 无假按钮  
