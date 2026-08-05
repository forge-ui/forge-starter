---
name: forge-starter-new-module
description: >
  Add a new admin CRUD module to Forge Starter (list + form + API + Drizzle).
  Chooses detail presentation by content weight — modal or full page, neither
  is the universal default. Use when the user wants a new resource manager.
---

# Forge Starter New Module

**不要无脑复制 accounts，也不要无脑全弹窗。** 先定信息架构，再抄对应样板。

权威：`docs/module-template.md`、`docs/page-roles.md`。  
不依赖外部设计插件。

## When to use

- 「加一个 xxx 管理」「新模块」「CRUD」「列表增删改」

## Step 0 — 选型（写代码前必做，问不清就问用户）

### 详情呈现：modal 还是全页？

这是 **产品决策**，不是固定默认值。按内容与任务选：

| 倾向 **详情弹窗** | 倾向 **全页详情** |
|------------------|-------------------|
| 字段少，扫一眼能审完 | 多区块、Tab、图表、时间线、关联表 |
| 从列表进、处理完立刻回列表 | 需要沉浸阅读 / 对照多栏信息 |
| 主操作短（通过/驳回/简单改） | 详情上还要继续逛子资源 |
| 例：审批单、轻量订单行 | 例：客户档案、账号、项目 |

用户若指定形态 → 听用户。  
用户没说 → 用上表对照字段与操作，**写进实现说明里为什么选这个**。  
两边都说得通时：**先问一句**，别替用户拍死。

Starter 对照样板（都是合法路径，不是优先级）：

- `approvals`：列表 + 发起弹窗 + 详情弹窗  
- `accounts`：列表 + 表单弹窗 + 全页详情  

### 新建/编辑

- 字段不多 → **form-modal**（常见）  
- 字段极多、分步 → form-page（少用，需理由）  

### 列表筛选

- **一行**：`ButtonGroup` + 右侧搜索（布局抄 `accounts/page.tsx`）  
- **禁止**纵向叠两行 `ButtonGroup`  
- 多维度：合并进一组 pills，或主维度 pills、次维度靠列 badge / 搜索  

## Inputs

- 资源英文复数路由：`orders`  
- 中文名：`订单`  
- 字段与枚举  
- **详情形态**（modal | page | 未定要推断/询问）  

## Source files

### 共用

```text
lib/accounts/types.ts               → lib/<res>/types.ts
lib/accounts/service.ts             → lib/<res>/service.ts
app/api/accounts/**                 → app/api/<res>/**
components/accounts-store.tsx       → components/<res>-store.tsx
components/account-form-dialog.tsx  → components/<res>-form-dialog.tsx
app/(app)/accounts/page.tsx         → 列表结构参考（筛选行务必单行）
```

### 按选型抄详情

**详情弹窗** → 参考 `approvals`：

```text
components/approval-detail-dialog.tsx → components/<res>-detail-dialog.tsx
# 列表行点击 / ?id= 打开弹窗
# 可选 [id]/page.tsx redirect → /<res>/?id=
```

**全页详情** → 参考 `accounts`：

```text
app/(app)/accounts/[id]/page.tsx → app/(app)/<res>/[id]/page.tsx
# 顶栏主操作；侧栏只读 meta；禁止侧栏塞「返回列表」
```

全局 rename + 改字段。`lib/db/schema.ts` → `pnpm db:push`。

## Required UX

| 区块 | 要求 |
|------|------|
| 列表 | Header + 新建 + **单行**筛选/搜索 + DataTable + 空态 |
| 新建/编辑 | 默认 modal（`components/ui/modal.tsx`） |
| 详情·modal | 字段 + 状态 + 底栏关闭/主操作；关窗 = 回列表 |
| 详情·page | 顶栏主操作；侧栏只读；页内返回（见下） |
| API | session + zod + 中文错误 |

### 全页详情与返回

Starter 列表/详情常 `hideHeader: true`，此时 AppLayout **不渲染** 壳 `onBack`。  
全页详情必须：页内 `←` 和/或可点面包屑；**不要**把「返回列表」塞进侧栏摘要卡。

## Menu / shell

1. `config/menu.tsx`：`BoldDuotone` size 20  
2. `config/site.ts`：列表 `hideHeader: true`  
3. 全页详情才配详情 title / shell `onBack`（仍须页内返回兜底）  

## Forbidden

1. 不经选型直接抄 `accounts/[id]` 或直接全弹窗  
2. 两行筛选 pills  
3. 侧栏摘要卡里塞导航（返回列表等）  
4. 依赖 `onBack` 却 `hideHeader: true` 且页内无返回  
5. 整页表单当默认新建（除非字段极多）  
6. 假按钮 / 第二 UI 库 / 业务表并进 `users`  
7. **只 curl API 验收** — 必须浏览器看列表与详情  

## Validation

```bash
pnpm typecheck
pnpm db:push   # 若改 schema
```

浏览器：

1. 筛选只有一行  
2. 新建 → 持久化 → 刷新还在  
3. 点行进详情，形态与选型一致，操作可用  
4. 回列表路径清晰（关弹窗 或 页内返回/面包屑）  

## After done

- 路由、表名  
- **详情选了 modal 还是 page，一句话理由**  
- 对照样板写明 approvals 或 accounts  
