import { AsyncLocalStorage } from "node:async_hooks";
import { getDb } from "@/lib/db";
import type { Transaction } from "./operations";

// Resource services, including their nested grant/default writes, share the
// receipt transaction. Never replace the request's connection or global DB.
const resourceTransaction = new AsyncLocalStorage<Transaction>();
export function resourceDb() { return resourceTransaction.getStore() ?? getDb(); }
export function inResourceTransaction<T>(tx: Transaction, run: () => Promise<T>) {
  return resourceTransaction.run(tx, run);
}
