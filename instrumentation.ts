export async function register() {
  // Next 在 next build 期间不会调用这里。保留这道判断，避免以后运行时把构建误当成启动。
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { assertAuthConfig } = await import("./lib/auth/config");
  assertAuthConfig();
}
