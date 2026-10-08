import { initializeRbacDefaults } from "../lib/rbac/seed";

initializeRbacDefaults().then(() => process.exit(0)).catch(() => {
  console.error("RBAC 初始化失败，请检查数据库配置");
  process.exit(1);
});
