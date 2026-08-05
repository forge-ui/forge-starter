# CRUD 模块模板

**先选型，再抄代码。**  
详情用弹窗还是全页 **没有全局默认**，按内容与任务选；两种在 Starter 里都有合法样板。

| 样板 | 路径特征 | 适合 |
|------|----------|------|
| `approvals` | 列表 + 表单弹窗 + **详情弹窗** | 字段少、处理完回列表 |
| `accounts` | 列表 + 表单弹窗 + **全页详情** | Tab/图/关联/档案式 |

Skill：`.agents/skills/forge-starter-new-module/SKILL.md`。

## 选型（必做）

```text
用户指定了详情形态？ → 听用户
否则：
  字段少、短操作、强「看完回列表」？ → 详情弹窗（参考 approvals）
  多区块 / Tab / 图 / 关联列表？     → 全页详情（参考 accounts）
  仍拿不准？ → 问用户，不要替他写死
```

把选择和理由写在交付说明里。

## 文件地图

### 共用

```text
lib/<resource>/types.ts
lib/<resource>/service.ts
lib/db/schema.ts
app/api/<resource>/route.ts
app/api/<resource>/[id]/route.ts
components/<resource>-store.tsx
components/<resource>-form-dialog.tsx
app/(app)/<resource>/page.tsx
config/menu.tsx
config/site.ts
```

### 详情弹窗

```text
components/<resource>-detail-dialog.tsx
# 行点击 / ?id= / 创建成功后打开
# 可选 [id]/page.tsx → redirect /<resource>/?id=
```

### 全页详情

```text
app/(app)/<resource>/[id]/page.tsx
# 顶栏主操作；侧栏只读；页内返回
```

## 列表

1. `h1` + Breadcrumbs + 主按钮  
2. **单行** `ButtonGroup` + 搜索（禁止两行 pills）  
3. DataTable + 分页 + 空态  
4. 新建/编辑 form modal  
5. 删除 ConfirmationDialog（若有）  

## 表单弹窗

- `components/ui/modal.tsx`  
- TextField / SelectOption / TextArea  
- 双端校验  

## 详情

**弹窗**：字段 + 状态 + 底栏关闭/主操作；关窗回列表。  

**全页**：顶栏主操作；侧栏只 meta；返回用页内 `←`/面包屑（`hideHeader` 时壳 onBack 不出现）；禁止侧栏塞返回。  

## API

session、`jsonOk`/`jsonError`、Zod、中文错误。  

## 自检

- [ ] 详情形态有明确选择与理由（非默认教条）  
- [ ] 列表筛选单行  
- [ ] 浏览器验过，不只 curl  
- [ ] typecheck；有 schema 则 db:push  
