import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { harnessRuns, semanticOperations } from "@/lib/db/schema";
import { APPLICATION_BUILD_ID } from "@/lib/semantic/contracts";
import { HarnessError, type Run } from "./types";
import { postgresTaskStore } from "./postgres-store";

export type TaskBinding = { runId: string; requestId: string };
type Tx = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];

/** Lock the task in the same transaction as operation registration/commit. */
export async function lockActiveHarness(tx: Tx, binding: TaskBinding, ownerId: string, actionId: string) {
  const [row] = await tx.select().from(harnessRuns).where(and(eq(harnessRuns.id, binding.runId), eq(harnessRuns.ownerId, ownerId), eq(harnessRuns.applicationId, "forge-starter"))).for("update");
  const run = row?.state as Run | undefined;
  if (!run || row.buildId !== APPLICATION_BUILD_ID || row.updatedAt.getTime() < Date.now() - 30 * 60_000 || run.lastRequestId !== binding.requestId || run.status !== "waiting-external" || run.pending?.capability !== actionId.replaceAll(".", "_")) {
    throw new HarnessError("这份操作已取消、被替换或版本已变化，请重新提出请求");
  }
  return run;
}

export async function assertActiveHarness(binding: TaskBinding, ownerId: string, actionId: string) {
  return getDb().transaction(tx => lockActiveHarness(tx, binding, ownerId, actionId));
}

export async function retireStarterOperations(run: Run) {
  await getDb().update(semanticOperations).set({ state: "cancelled", updatedAt: new Date() }).where(and(
    eq(semanticOperations.userId, run.ownerId), eq(semanticOperations.harnessRunId, run.id),
    eq(semanticOperations.harnessRequestId, run.lastRequestId), inArray(semanticOperations.state, ["confirmed", "awaiting-save"]),
  ));
}

/** A page cancellation is also a task state transition, not just an operation flag. */
export async function recordPageCancellation(operationId: string, ownerId: string) {
  const [operation] = await getDb().select().from(semanticOperations).where(and(eq(semanticOperations.id, operationId), eq(semanticOperations.userId, ownerId)));
  if (operation?.state !== "cancelled" || !operation.harnessRunId || !operation.harnessRequestId) return;
  const run = await postgresTaskStore.load(operation.harnessRunId, ownerId, "forge-starter");
  if (!run || run.lastRequestId !== operation.harnessRequestId || run.status !== "waiting-external") return;
  const expected = run.revision;
  run.revision += 1;
  run.status = "cancelled";
  delete run.pending;
  run.messages = [];
  run.updatedAt = new Date().toISOString();
  run.output = { text: "已在页面取消这次操作。可以继续提问。", data: { live: false } };
  run.events = [...run.events, { kind: "cancelled", label: "页面操作已取消", at: run.updatedAt }].slice(-30);
  run.exchanges = [...run.exchanges, { id: `page-cancel:${operationId}`, question: "取消页面操作", output: run.output }].slice(-30);
  await postgresTaskStore.save(run, expected); // A concurrent new goal wins safely.
}
