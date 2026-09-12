# Agent-native 工作流

Coding Agent 是第一开发界面，专注 **Forge 管理后台**：skills 拆模块、真页面当样板、交付可浏览器验收。

人怎么把项目跑起来：[`docs/setup.md`](setup.md)。产品范围：[`docs/product.md`](product.md)。合约：[`AGENTS.md`](../AGENTS.md)。

## 核心做法

| 做法 | 价值 |
|------|------|
| skill 拆分：后端 vs 页面 | 接口与 UI 边界清晰，Agent 不容易一次抄乱 |
| 仓库里真页面当抄写样板 | accounts、`/ref` 可直接对照 |
| AGENTS 写清规矩 | 颜色、组件、详情形态有据可依 |
| typecheck + 浏览器点主路径 | 交付质量可感知 |

## 推荐流程

```text
1. clone → 按 docs/setup.md 起库、.env、install、db:push
2. 读 AGENTS.md；范围与 non-goals 见 docs/product.md
3. 品牌/env → forge-starter-quick-start
4. 每个业务对象：
     a. forge-starter-new-module  → schema + service + API
     b. forge-starter-new-page    → 列表/表单/详情 UI + 菜单
     c. forge-starter-audit       → 对照清单修规范
5. 纯看板/非 CRUD 单页 → 只跑 new-page，再 audit
6. pnpm check；改 UI 后浏览器点一遍
```

人类一句「加 xxx 管理」时：按 **a→b→c** 做，必须用各 skill 的边界，不要揉成「无脑抄 accounts 全套」。

## Skills

| 说法 | Skill | 边界 |
|------|--------|------|
| 新开后台、改品牌 | `forge-starter-quick-start` | 只 brand + env |
| 加数据与接口 | `forge-starter-new-module` | **只后端**（schema + service + API） |
| 加列表/详情/看板页 | `forge-starter-new-page` | **只 UI** + 菜单 |
| 页面写完/改完 | `forge-starter-audit` | 只审计与修规范，不重构业务 |

路径：`.agents/skills/<name>/SKILL.md`。Skills **只**维护在 `.agents/skills/`。

- store 归 **new-page**；new-module 只保证 API。  
- 选组件：`docs/forge-components.md` → Starter 样板 → 旁路 monorepo cases。

## 详情怎么选（无全局默认）

| 样板 | 适合 | 路径 |
|------|------|------|
| **accounts** | 重详情：Tab、多区块、档案 | 列表 + 表单弹窗 + **全页** `accounts/[id]` |
| 轻详情 | 字段少、看完回列表 | **暂无第二业务样板**；对照 `/ref/detail-modal` + `Modal` + `?id=` |

用户指定听用户；否则按内容；拿不准就问。  
禁止 skill 写死「默认全页」或「默认弹窗」。  
文件地图：`docs/module-template.md`。新菜单必须写**菜单三处**（`APP_MODULE_IDS` + `APP_MODULE_META` + `MODULE_MENU`），默认应用种子勾齐新 id；加完清 `forge-starter:app-registry`。无 `{module}:read` 直链业务页壳层 `replace` 回工作台，别只藏侧栏。见 `AGENTS.md`。别只改 `menu.tsx`。

## 可运行样板

| 路径 | 形态 |
|------|------|
| `/accounts` · `/accounts/[id]` | 列表 + 弹窗表单 + **全页详情**（重样板） |
| `/dashboard` | 工作台 |
| `/settings/apps` | 应用管理（collection）；资料/改密/系统偏好在头像菜单弹窗 |
| `/ref/` | 布局参考画廊（真路由，开发默认开、默认不进侧栏） |

## `/ref` 怎么用

开发环境打开 **`/ref/`**：表格、卡片、全页/弹窗详情、主从分屏、设置、时间线、队列、空态、KPI 等。  
完整目录：`docs/reference-pages.md`。生产默认 404（`SHOW_REF_PAGES=true` 可开）。

写 UI 时：**`/ref` 定范式 → accounts（或业务页）接数据**。`/ref` 里不少页是布局对照，不是已交付业务（发票、积分、订阅等不要当成开箱功能）。

## Forge 组件怎么查

写任何业务 UI 前：

1. **`docs/forge-components.md`**（角色 → 组件 → 样板 → case）  
2. 旁路 monorepo：`../forge/.agents/skills/forge/SKILL.md` + `cases/<name>`  
3. 缺能力 → `FORGE-GAP`  

没有 monorepo 时仍可用 forge-components + Starter 样板；不要猜 props。

## 环境注意

- `AUTH_MODE=demo` **只**简化登录，**不**提供业务表内存存储。  
- 凡 CRUD 必须有 `DATABASE_URL` + `pnpm db:push`。详见 `docs/setup.md`。  
- `DataTable.sortable` 未接排序逻辑时不要开。  

## 质量门禁

- 像 Forge 官方后台，不像玩具 UI  
- 颜色用 `fg-*`；业务控件 `color={siteConfig.accent}`  
- 列表筛选 **一行** pills + 搜索  
- 侧栏摘要卡 **不** 塞「返回列表」  
- 操作反馈用全站 `toast`，禁止页内绿条  
- `pnpm check`；改 UI 要浏览器点过，**禁止只 curl**  
- 不引入第二 UI 库、支付、假按钮  

本仓库胜负手：**Forge-only + 清晰 skill 边界 + 可抄样板**。
