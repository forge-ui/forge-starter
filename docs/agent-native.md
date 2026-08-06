# Agent-native 工作流

Coding Agent 是第一开发界面，专注 **Forge 管理后台**：skills 拆模块、真页面当样板、交付可浏览器验收。

## 核心做法

| 做法 | 价值 |
|------|------|
| skill 拆分：后端 vs 页面 | 接口与 UI 边界清晰，Agent 不容易一次抄乱 |
| 仓库里真页面当抄写样板 | accounts / approvals / `/ref` 可直接对照 |
| AGENTS 写清规矩 | 颜色、组件、详情形态有据可依 |
| typecheck + 浏览器点主路径 | 交付质量可感知 |

## 双样板（无全局默认）

| 样板 | 适合 | 路径 |
|------|------|------|
| **accounts** | 重详情：Tab / 多区块 / 档案 | 列表 + 表单弹窗 + **全页** `accounts/[id]` |
| **approvals** | 轻详情：字段少、看完回列表 | 列表 + 表单弹窗 + **详情弹窗** |

详情弹窗还是全页：**按内容选**，用户指定听用户，拿不准就问。  
禁止 skill 写死「默认全页」或「默认弹窗」。

## AI 参考页（真实页面 · 不进菜单）

开发环境打开 **`/ref/`**：表格列表、卡片列表、全页/弹窗详情、主从分屏、设置、时间线、队列、空态、KPI 等。  
说明：`docs/reference-pages.md`。生产默认 404（`SHOW_REF_PAGES=true` 可开）。  
写 UI 时：**/ref 定范式 → accounts/approvals 接业务**。

## 推荐流程

```text
1. clone → pnpm install → .env →（local）db:push
2. 读 AGENTS.md（含 Forge UI skill 指针）
3. 品牌/env → forge-starter-quick-start
4. 每个业务对象：
     a. forge-starter-new-module  → schema + service + API
     b. forge-starter-new-page    → 列表/表单/详情 UI + 菜单
5. 纯看板/非 CRUD 单页 → 只跑 new-page
6. pnpm typecheck；改 UI 后浏览器点一遍
```

人类一句「加 xxx 管理」时：agent 按 **a→b** 两步做，但必须用两个 skill 的边界，不要又揉成「无脑抄 accounts 全套」。

## Skills

| 说法 | Skill | 边界 |
|------|--------|------|
| 新开后台 / 改品牌 | `forge-starter-quick-start` | 只 brand + env |
| 加数据与接口 | `forge-starter-new-module` | **只后端** |
| 加列表/详情/看板页 | `forge-starter-new-page` | **只 UI** + 菜单 |

路径：`.agents/skills/`（canonical）；`.claude/skills` → symlink，勿双份维护。

## Forge 组件怎么查

写任何业务 UI 前：

1. **`docs/forge-components.md`**（角色 → 组件 → 样板 → case）  
2. 旁路 monorepo：`../forge/.agents/skills/forge/SKILL.md` + `cases/<name>`  
3. 缺能力 → `FORGE-GAP`  

没有 monorepo 时仍可用 forge-components + Starter 样板；不要猜 props。
## 环境注意（Codex 交叉测试结论）

- `AUTH_MODE=demo` **只**简化登录，**不**提供业务表内存存储。  
- 凡 CRUD 必须有 `DATABASE_URL` + `pnpm db:push`。  
- `DataTable.sortable` 未接排序逻辑时不要开。  
- store 归 **new-page**；new-module 只保证 API。  

## 质量门禁

- 像 Forge 官方后台，不像玩具 UI  
- 列表筛选 **一行** pills + 搜索  
- 侧栏摘要卡 **不** 塞「返回列表」  
- `pnpm typecheck`；改 UI 要浏览器点过，**禁止只 curl**  
- 不引入第二 UI 库 / 支付 / 假按钮  

本仓库胜负手：**Forge-only + 清晰 skill 边界 + 可抄样板**。
