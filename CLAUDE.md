# Claude Code — Forge Starter

1. 始终遵循 **`AGENTS.md`**。  
2. 产品说明：**`PRODUCT.md`**；工作流：**`docs/agent-native.md`**。  
3. Skills 在 **`.agents/skills/`**（本目录 `.claude/skills` 是 symlink）：  
   - `forge-starter-quick-start`  
   - `forge-starter-new-module`（只后端）  
   - `forge-starter-new-page`（只 UI）  
4. 样板：`accounts`（重详情）、`approvals`（轻详情弹窗）。  
5. 写 UI 前：`docs/forge-components.md`。  
6. 组件只走 Forge；缺组件 → `FORGE-GAP`。  
7. 交付：`pnpm typecheck`；改 UI 后浏览器点主路径。  
8. 文档：[README.md](./README.md)。  
