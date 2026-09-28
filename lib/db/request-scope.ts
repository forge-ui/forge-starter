import { AsyncLocalStorage } from "node:async_hooks";

export type DatabaseScope = {
  database?: unknown;
  close?: () => Promise<void>;
};

// OpenNext bundles the Worker entry and Next server separately. Share the
// request-local storage between those bundles, never the database connection.
const key = Symbol.for("forge-starter.database-request-scope");
const globals = globalThis as typeof globalThis & {
  [key]?: AsyncLocalStorage<DatabaseScope>;
};
export const databaseRequestScope =
  globals[key] ??= new AsyncLocalStorage<DatabaseScope>();
