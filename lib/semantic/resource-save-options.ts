import type { Receipt } from "./operations";
export type ResourceSaveOptions = { operationId?: string; key?: string; updatedAt?: string };
export type ResourceSaved<T> = T & { receipt?: Receipt };
export function resourceWriteHeaders(options?: ResourceSaveOptions) {
  return { "Content-Type": "application/json", "idempotency-key": options?.key ?? crypto.randomUUID(), ...(options?.operationId ? { "x-operation-id": options.operationId } : {}), ...(options?.updatedAt ? { "x-expected-updated-at": options.updatedAt } : {}) };
}
