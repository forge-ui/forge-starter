# Agent-native 工作流

Coding Agent 是第一开发界面。理念对齐 [ShipAny Next](https://docs.shipany.ai/zh/shipany-next)，**业务域只做 Forge 后台**。

## 学 Next 什么 / 不学什么

| 学（方法） | 不学（产品） |
|------------|--------------|
| skill 拆分：后端 vs 页面 | 支付 / 积分 / CMS / OAuth 全家桶 |
| 仓库里真页面当抄写样板 | 把 Next 的 settings/admin 页原样搬来 |
| AGENTS 写清规矩 | 多框架 sync-upstream |
| 做完 typecheck + 浏览器点主路径 | Landing 克隆 / 营销站流水线 |

## 双样板（无全局默认）

| 样板 | 适合 | 路径 |
|------|------|------|
| **accounts** | 重详情：Tab / 多区块 / 档案 | 列表 + 表单弹窗 + **全页** `accounts/[id]` |
| **approvals** | 轻详情：字段少、看完回列表 | 列表 + 表单弹窗 + **详情弹窗** |

详情弹窗还是全页：**按内容选**，用户指定听用户，拿不准就问。  
禁止 skill 写死「默认全页」或「默认弹窗」。

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

路径：`.agents/skills/`（canonical）；`.claude/skills/` 必须同步。

## Forge 组件怎么查

写任何业务 UI 前：

1. 读旁路 monorepo **`../forge/.agents/skills/forge/SKILL.md`**（没有旁路则按 AGENTS 铁律 + 现有样板页）  
2. props / token / 缺组件：`forge/references/*`  
3. 缺能力 → `FORGE-GAP`，禁止手搓 Kit 已有物  

Starter skill 只给后台常用捷径，**不**复制整本组件百科。

## 质量门禁

- 像 Forge 官方后台，不像玩具 UI  
- 列表筛选 **一行** pills + 搜索  
- 侧栏摘要卡 **不** 塞「返回列表」  
- `pnpm typecheck`；改 UI 要浏览器点过，**禁止只 curl**  
- 不引入第二 UI 库 / 支付 / 假按钮  

本仓库胜负手：**Forge-only + 清晰 skill 边界 + 可抄样板**。
