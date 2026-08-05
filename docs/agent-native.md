# Agent-native 工作流

Forge Starter 把 **Coding Agent** 当作第一开发界面（对齐 [ShipAny Next](https://docs.shipany.ai/zh/shipany-next) 的 agent-native 理念，业务域限定在 **Forge 后台**）。

## 推荐流程

```text
1. clone + pnpm install + .env +（local 时）docker compose + db:push
2. 打开 Agent，加载 AGENTS.md
3. 产品 brief → skill: forge-starter-quick-start
4. 每个业务对象 → skill: forge-starter-new-module
5. 特殊单页（看板变体等）→ skill: forge-starter-new-page
6. pnpm typecheck（必要时 pnpm build）
```

## 产品 brief 应包含

- 产品名（中英文）
- 主色（默认 blue；可用 purple / black）
- 首期模块列表（名词：订单、客户…）
- 每个模块：字段、状态枚举、是否要详情页
- 部署目标（仅文档；实现可后置）

## Skills 与人类指令对照

| 人类说法 | Skill |
|----------|--------|
| 新开一个后台项目 / 改成某某品牌 | `forge-starter-quick-start` |
| 加一个「xxx 管理」 | `forge-starter-new-module` |
| 照着 ecommerce-2 做一个页 | `forge-starter-new-page` |

写页前先定角色，查对照表：`docs/page-roles.md`（不依赖任何外部设计插件）。

## 质量门禁

- 视觉：像 Forge 官方 template，不像自定义玩具 UI  
- 结构：CRUD 文件地图完整（见 `module-template.md`）  
- 工程：`pnpm typecheck` 绿  
- 边界：不引入支付/IM/第二 UI 库  

## 与 ShipAny 的关系

| 可借鉴 | 不要抄作业 |
|--------|------------|
| skills 驱动 0→1 | 支付、积分、CMS 全家桶 |
| `/quick-start` 式 brief | 默认云邮件 SaaS |
| 模块化文档 | 多框架 hub 同步 |

本仓库胜负手：**Forge-only + CRUD 范式 + skills**，不是功能数量。
