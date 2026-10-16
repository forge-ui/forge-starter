import { spawn } from "node:child_process";

if (process.env.NODE_ENV === "production" && process.env.ALLOW_DB_PUSH?.trim().toLowerCase() !== "true") {
  console.error(
    "db:push 只用于开发库。它按当前 schema 直接改表，不留下可重复执行的迁移记录。生产环境请用 pnpm db:migrate。确要推生产库时设置 ALLOW_DB_PUSH=true。",
  );
  process.exit(1);
}

console.error("db:push 只建议对开发库使用。新环境和生产用 pnpm db:migrate。");

const child = spawn("pnpm", ["exec", "drizzle-kit", "push"], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));

child.on("error", (error) => {
  console.error(`无法启动 drizzle-kit：${error.message}`);
  process.exit(1);
});
