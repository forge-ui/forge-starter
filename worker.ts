// @ts-ignore OpenNext generates this module during build:cloudflare.
import handler from "./.open-next/worker.js";
import { assertAuthConfig } from "./lib/auth/config";
import { closeDatabaseScope, databaseRequestScope, type DatabaseScope } from "./lib/db/request-scope";

export default {
  async fetch(
    request: Request,
    env: { HYPERDRIVE?: { connectionString: string } },
    ctx: { waitUntil(promise: Promise<unknown>): void },
  ) {
    // Workers 的密钥在 env 上。nodejs_compat 通常也会写进 process.env，这里补一次，避免只绑了 env 时被误判为没配密钥。
    const source = env as Record<string, unknown>;
    const runtimeEnv = process.env as Record<string, string | undefined>;
    for (const key of ["NODE_ENV", "AUTH_MODE", "AUTH_SECRET", "ALLOW_INSECURE_AUTH", "AUTH_GUARD"] as const) {
      const value = source[key];
      if (!runtimeEnv[key] && typeof value === "string") runtimeEnv[key] = value;
    }
    // 没有单独的进程启动钩子，第一次请求就是启动。配置不合格就拒绝服务。
    assertAuthConfig();
    const scope: DatabaseScope = { connectionString: env.HYPERDRIVE?.connectionString };
    return databaseRequestScope.run(scope, async () => {
      try {
        return await handler.fetch(request, env, ctx);
      } finally {
        // Streaming handlers return before their final database checkpoint.
        ctx.waitUntil(closeDatabaseScope(scope));
      }
    });
  },
};
