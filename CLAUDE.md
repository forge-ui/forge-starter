# Claude Code — Forge Starter

1. 始终遵循 **`AGENTS.md`**。  
2. 产品边界：**`PRODUCT.md`**；工作流：**`docs/agent-native.md`**。  
3. Skills（顺序：加业务时先 module 再 page）：  
   - `forge-starter-quick-start`  
   - `forge-starter-new-module`（只后端）  
   - `forge-starter-new-page`（只 UI）  
4. 样板：`accounts`（重）/ `approvals`（轻）。  
5. 写 UI 前读 `../forge/.agents/skills/forge/SKILL.md`（若旁路存在）。  
6. 交付：`pnpm typecheck`；改 UI 后浏览器点主路径。  

禁止：支付全家桶、第二 UI 库、假按钮、写死详情形态、只 curl 验收。  
缺 Forge 组件 → `FORGE-GAP`。
