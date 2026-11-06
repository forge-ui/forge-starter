---
name: forge-skill
description: 使用 Forge / forge-ui 设计与实现看板、后台、管理系统及 starter 页面；按 Screen、Blocks、Components 复用模板和组件，核对 API、内容布局、交互与验收边界。
---

# Forge 页面设计与实施

## 唯一入口与阅读顺序

唯一通用入口是本文件 `forge-skill/SKILL.md`，不同时拼读全局安装版与项目同步版。优先级：用户指定的版本/checkout > starter 已校验的 `docs/forge-skill/upstream/SKILL.md` > 全局安装的 forge-skill。项目内没有同步副本时才用全局版；版本不符应先同步并核对 manifest，不能静默混用。

在 starter 内先读该仓 AGENTS.md 与本任务对应的 quick-start / new-module / new-page，然后读项目 `docs/forge-skill/upstream/SKILL.md`；依次读 Screens → 主对照 Screen 源码 → Blocks 配方及单项 Props → 所用 Components 契约 → audit-checklist。全局 skill 在 starter 中仅负责找到并转入这一入口；starter 的路由、RBAC、数据与工程规则仍以 starter 专用 skill 为准。

## 先确定范围

只交付用户授权的页面或系统；单页请求不自动扩成工作台、多模块或治理系统。先说明用户、对象、任务、页面角色、数据来源及完成标准。在 forge-starter 内先走该仓的 quick-start / new-module / new-page / audit skills：主 skill 提供通用规范，starter 负责路由、权限、数据库与工程约定。

## Screen → Blocks → Components

1. **Screen**：先选同角色、同业务密度的真实模板，记录源码路径与版本。看板必须从 [10 个 Screen](references/screens.md) 起步，不从四张指标卡自由拼页。
2. **Blocks**：复用模板中职责明确的区块；[区块目录](references/blocks.md) 列出 17 类已实现的可复制源码（blocks/ 与 public/r/），不是 core 导出；发布状态和截图验收另行核实。
3. **Components**：使用安装版本真实导出与 Props；查看 [生成 API](references/components/button.md) 和 [组件选型](references/component-recommended-standard.md)。不要猜测组件、图标、密度或交互参数。

缺失能力记录 **FORGE-GAP**：业务用途、已查组件与版本、缺口、影响、候选方案。标记并询问用户，不自行手搓公共原语或改 core。

## 模板和源码

- 看板：analytics、ecommerce-1、ecommerce-2、finance-1、finance-2、finance-3、project-1、project-2、crm、ecommerce-3；以 [Screen 目录](references/screens.md) 的实际路径为准。
- 业务模板：ecommerce、project-template、crm-template、finance-template、micellaneous-template、task-board、agent、dashboard-builder；[Screen 目录](references/screens.md) 覆盖全部 85 个页面源码（10 个看板、看板入口、74 个其他页面），动态示例使用真实 mock ID；不把模板演示当后端能力。
- 认证页使用 forge-starter 的实际路由，见 [认证模板](references/templates/auth.md)；不要引用不存在的 templates/auth；业务模板里的认证演示不提供真实会话能力。
- 运行 `node skills/forge-skill/scripts/list.mjs templates` 查看完整路由；`get-template.mjs dashboards/analytics` 同时输出 wrapper 和它引用的内容源；`get-component.mjs Button DataTable` 查询真实文档页。
- 脚本优先本地 `FORGE_REPO_DIR` 或当前 checkout，再只读回退 forge-ui/forge 的 main。离线缺源应报错，不能编造模板。

## 采用规则

- [页面规范](references/page-recommended-standard.md) 定布局与看板几何；[Grid](references/layout-grid.md) 定 API 和固定/比例列边界；[多维图方法](references/page-design-dimensional.md) 可随包使用，不依赖本机其他 skill。
- 组件来自 `@forge-ui-official/core`，图标来自 `@forge-ui-official/core/icons`。AppLayout 标识使用 `appName`；不要使用已弃用 teamName 或不存在的 FormField。
- 默认 accent/focus 为 blue，purple/black 仅为可选主题。7 个色族加 grey/white；token `fg-violet` 对应组件颜色 `"purple"`，见 [Tokens](references/tokens.md)。
- 状态默认 soft StatusBadge，分类/角色普通文字；一张表通常最多一个状态胶囊列，见 [状态表达](references/status-presentation.md)。
- 核对 [内容契约](references/component-content-contracts.md)、[弹层焦点](references/overlay-focus.md)、[动效](references/motion.md)。技术检查不等于浏览器和面向使用者的 验收。

## 交付前

按 [统一审计清单](references/audit-checklist.md) 逐条记录通过、违规、不适用或未验证及证据。跑项目已有 typecheck、lint、测试和文档自检；需要数据库、浏览器、读屏器或实机而未执行的检查明确列出原因。不得把构建通过当视觉/真实操作验收。

接入专项：[Ask AI 宿主契约](references/ask-ai-host-contract.md)、[交互接入边界](references/interaction-adoption.md)。
