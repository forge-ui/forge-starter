import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { databaseRequestScope } from "./request-scope";

let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDatabaseUrl() {
  const url = databaseRequestScope.getStore()?.connectionString ?? process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required when AUTH_MODE=local");
  }
  return url;
}

export function getDb() {
  const scope = databaseRequestScope.getStore();
  if (scope) {
    if (scope.database) return scope.database as ReturnType<typeof drizzle<typeof schema>>;
    const requestClient = postgres(getDatabaseUrl(), { max: 1, connect_timeout: 10, fetch_types: false });
    const requestDb = drizzle(requestClient, { schema });
    scope.database = requestDb;
    scope.close = () => requestClient.end({ timeout: 5 });
    return requestDb;
  }
  if (db) return db;
  const url = getDatabaseUrl();
  client = postgres(url, { max: 10 });
  db = drizzle(client, { schema });
  return db;
}

export async function closeDb() {
  if (client) {
    await client.end({ timeout: 5 });
    client = null;
    db = null;
  }
}
