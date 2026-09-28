// @ts-ignore OpenNext generates this module during build:cloudflare.
import handler from "./.open-next/worker.js";
import { databaseRequestScope, type DatabaseScope } from "./lib/db/request-scope";

export default {
  async fetch(
    request: Request,
    env: { HYPERDRIVE?: { connectionString: string } },
    ctx: { waitUntil(promise: Promise<unknown>): void },
  ) {
    const scope: DatabaseScope = { connectionString: env.HYPERDRIVE?.connectionString };
    return databaseRequestScope.run(scope, async () => {
      try {
        return await handler.fetch(request, env, ctx);
      } finally {
        // All database work is awaited by the API handlers. Keep connection
        // cleanup alive after their response, including on error paths.
        if (scope.close) ctx.waitUntil(scope.close());
      }
    });
  },
};
