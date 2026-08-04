# Claude Code — Forge Starter

本仓库是 **Agent-native Forge 后台脚手架**。

1. 始终遵循根目录 **`AGENTS.md`**（铁律 + 仓库地图）。  
2. 产品边界见 **`PRODUCT.md`**。  
3. 优先使用 skills：  
   - `forge-starter-quick-start`  
   - `forge-starter-new-module`  
   - `forge-starter-new-page`  
4. CRUD 样板：`app/(app)/accounts` + `docs/module-template.md`。  
5. 交付前：`pnpm typecheck`。  

不要引入支付/第二 UI 库/假按钮；缺 Forge 组件时声明 `FORGE-GAP` 并询问用户。
