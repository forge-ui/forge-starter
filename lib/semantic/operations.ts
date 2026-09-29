import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { semanticOperations } from "@/lib/db/schema";
import { CONTRACT_VERSION } from "./contracts";
import { lockActiveHarness, type TaskBinding } from "@/lib/harness/starter-operations";

export type Transaction = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];
export type Receipt = { operationId: string; actionId: string; entityId: string; revision?: number; status: "committed" | "verified"; verifiedAt?: string; result: Record<string, unknown> };
export class OperationError extends Error { constructor(message: string, public status = 409) { super(message); } }
export function semanticEnabled() { return process.env.SEMANTIC_ENABLED === "true"; }

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  return JSON.stringify(value) ?? "null";
}
async function digest(value: unknown) {
  const data = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical(value)));
  return Array.from(new Uint8Array(data), (v) => v.toString(16).padStart(2, "0")).join("");
}

export async function registerOperation(id: string, userId: string, actionId: string, entityId?: string, harness?: TaskBinding) {
 return getDb().transaction(async db => {
  if (harness) await lockActiveHarness(db, harness, userId, actionId);
  await db.insert(semanticOperations).values({ id, userId, actionId, entityId, harnessRunId: harness?.runId, harnessRequestId: harness?.requestId, contractVersion: CONTRACT_VERSION, state: "confirmed", expiresAt: new Date(Date.now() + 600_000) }).onConflictDoNothing();
  const [row] = await db.select().from(semanticOperations).where(eq(semanticOperations.id, id));
  if (!row || row.userId !== userId || row.actionId !== actionId || row.entityId !== (entityId ?? null) || row.harnessRunId !== (harness?.runId ?? null) || row.harnessRequestId !== (harness?.requestId ?? null)) throw new OperationError("操作不属于当前用户或目标");
  if (row.state !== "confirmed" && row.state !== "awaiting-save") throw new OperationError("操作已结束，请查看执行回执");
  if (row.expiresAt < new Date()) throw new OperationError("操作已过期");
  return row;
 });
}

export async function readOperation(id: string, userId: string) {
  const [row] = await getDb().select().from(semanticOperations).where(and(eq(semanticOperations.id, id), eq(semanticOperations.userId, userId)));
  if (!row) throw new OperationError("操作不存在", 404);
  return row;
}

/** Business effect and durable receipt share one transaction. Duplicate calls serialize on the row. */
export async function commitOperation(input: { id: string; userId: string; actionId: string; entityId?: string; payload: unknown; confirmed?: boolean }, execute: (tx: Transaction) => Promise<{ entityId: string; revision?: number; result: Record<string, unknown> }>): Promise<Receipt> {
  const fingerprint = await digest({ actionId: input.actionId, entityId: input.entityId, payload: input.payload });
  return getDb().transaction(async (tx) => {
    // Task row always precedes operation row in lock order. Cancel and commit
    // have a defined winner; a cancelled task can never commit an old proposal.
    const [binding] = await tx.select().from(semanticOperations).where(eq(semanticOperations.id, input.id));
    if (binding?.harnessRunId && binding.harnessRequestId && !["committed", "verified"].includes(binding.state)) await lockActiveHarness(tx, { runId: binding.harnessRunId, requestId: binding.harnessRequestId }, input.userId, input.actionId);
    if (!input.confirmed) await tx.insert(semanticOperations).values({ id: input.id, userId: input.userId, actionId: input.actionId, entityId: input.entityId, contractVersion: CONTRACT_VERSION, state: "awaiting-save", expiresAt: new Date(Date.now() + 600_000) }).onConflictDoNothing();
    const [row] = await tx.select().from(semanticOperations).where(eq(semanticOperations.id, input.id)).for("update");
    if (!row || row.userId !== input.userId || row.actionId !== input.actionId) throw new OperationError("操作不属于当前用户或动作", 403);
    if (row.fingerprint && row.fingerprint !== fingerprint) throw new OperationError("重复操作的内容不同，请重新提交");
    if (["committed", "verified"].includes(row.state) && row.receipt) return row.receipt as Receipt;
    if (row.entityId !== (input.entityId ?? null)) throw new OperationError("确认目标与保存目标不同");
    if (row.contractVersion !== CONTRACT_VERSION || row.expiresAt < new Date() || !["confirmed", "awaiting-save"].includes(row.state)) throw new OperationError("操作已取消、过期或版本不兼容");
    const output = await execute(tx);
    const receipt: Receipt = { operationId: input.id, actionId: input.actionId, ...output, status: "committed" };
    await tx.update(semanticOperations).set({ state: "committed", fingerprint, receipt, entityId: output.entityId, updatedAt: new Date() }).where(eq(semanticOperations.id, input.id));
    return receipt;
  });
}

export async function acknowledgeOperation(id: string, userId: string, state: "awaiting-save" | "cancelled") {
  const db = getDb();
  await db.transaction(async (tx) => {
    const [row] = await tx.select().from(semanticOperations).where(and(eq(semanticOperations.id, id), eq(semanticOperations.userId, userId))).for("update");
    if (!row) throw new OperationError("操作不存在", 404);
    if (["confirmed", "awaiting-save"].includes(row.state) && (state === "cancelled" || row.expiresAt > new Date())) await tx.update(semanticOperations).set({ state, updatedAt: new Date() }).where(eq(semanticOperations.id, id));
  });
}
