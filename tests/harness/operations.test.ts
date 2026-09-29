import { after, test } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { getDb, closeDb } from "../../lib/db";
import { adminAccounts, harnessRuns, semanticOperations } from "../../lib/db/schema";
import { postgresTaskStore } from "../../lib/harness/postgres-store";
import { retireStarterOperations } from "../../lib/harness/starter-operations";
import { HARNESS_VERSION, type Run } from "../../lib/harness/types";
import { APPLICATION_BUILD_ID } from "../../lib/semantic/contracts";
import { commitOperation, readOperation } from "../../lib/semantic/operations";
import { prepareContinuationReadback } from "../../lib/semantic/continuation";
import { verifyOperation } from "../../lib/semantic/verify";
import { executeConfirmedIntent } from "../../lib/agent/confirm";
import { readAgentIntent, signAgentIntent } from "../../lib/agent/intent";
import { createAdminAccount } from "../../lib/accounts/service";
import type { AccountInput } from "../../lib/accounts/types";
import type { AccessContext } from "../../lib/rbac/access";

const enabled = (() => {
  try {
    const url = new URL(process.env.DATABASE_URL ?? "");
    return url.hostname === "127.0.0.1" && url.pathname.startsWith("/forge_semantic_test_");
  } catch { return false; }
})();
const previousSemantic = process.env.SEMANTIC_ENABLED;
if (enabled) process.env.SEMANTIC_ENABLED = "true";
const owner = "demo-user";
const runIds: string[] = [];
const operationIds: string[] = [];
const accountIds: string[] = [];
const access: AccessContext = { roleCode: "test-operator", roleName: "测试操作员", isSuperAdmin: false, allowedModules: ["accounts"], permissionCodes: ["accounts:read", "accounts:create", "accounts:update", "accounts:delete"] };

function account(): AccountInput {
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 14);
  return { name: "Harness 操作测试", username: `hrn_${suffix}`, email: `${suffix}@example.test`, phone: "test-phone", role: "运营", department: "平台", status: "active", notes: "isolated test fixture" };
}

async function pending(overrides: Partial<Run> = {}) {
  const id = crypto.randomUUID(), requestId = crypto.randomUUID();
  runIds.push(id);
  operationIds.push(requestId);
  const run: Run = {
    version: HARNESS_VERSION, id, ownerId: owner, applicationId: "forge-starter", buildId: APPLICATION_BUILD_ID,
    revision: 0, status: "waiting-external", goal: "新建业务账号后核对", capabilityNames: ["accounts_create", "accounts_get"],
    messages: [], output: { text: "核对账号信息后填入页面", data: {} }, exchanges: [], events: [], lastRequestId: requestId,
    pending: { id: crypto.randomUUID(), kind: "external", title: "创建账号", options: [], allowText: false, toolCallId: "call-create", capability: "accounts_create" },
    updatedAt: new Date().toISOString(), ...overrides,
  };
  await postgresTaskStore.create(run);
  return run;
}

function binding(run: Run) { return { harness: { runId: run.id, requestId: run.lastRequestId } }; }
function sign(run: Run, data = account(), userId = owner) { return signAgentIntent(userId, "accounts.create", data, binding(run)); }
async function replace(run: Run, patch: Partial<Run>) {
  const next = { ...run, ...patch, revision: run.revision + 1, updatedAt: new Date().toISOString() };
  assert.equal(await postgresTaskStore.save(next, run.revision), true);
  return next;
}

after(async () => {
  if (!enabled) return;
  for (const id of accountIds) await getDb().delete(adminAccounts).where(eq(adminAccounts.id, id));
  for (const id of operationIds) await getDb().delete(semanticOperations).where(eq(semanticOperations.id, id));
  for (const id of runIds) await getDb().delete(harnessRuns).where(eq(harnessRuns.id, id));
  await closeDb();
  if (previousSemantic === undefined) delete process.env.SEMANTIC_ENABLED;
  else process.env.SEMANTIC_ENABLED = previousSemantic;
});

test("signed proposals cannot be confirmed after cancellation or changing the task goal", { skip: !enabled }, async () => {
  for (const change of ["cancel", "replace"]) {
    const run = await pending(), token = await sign(run);
    await replace(run, change === "cancel"
      ? { status: "cancelled", pending: undefined }
      : { goal: "新建另外一个账号", lastRequestId: crypto.randomUUID() });
    await assert.rejects(executeConfirmedIntent(token, owner, access), /取消|替换|版本/);
    await assert.rejects(readOperation(run.lastRequestId, owner), /不存在/);
  }
});

test("confirmed proposal cannot commit after its task is cancelled", { skip: !enabled }, async () => {
  const run = await pending(), data = account();
  const confirmed = await executeConfirmedIntent(await sign(run, data), owner, access);
  assert.equal(confirmed.fill?.operationId, run.lastRequestId);
  await replace(run, { status: "cancelled", pending: undefined });
  // The task lock must protect the commit even before operation retirement runs.
  assert.equal((await readOperation(run.lastRequestId, owner)).state, "confirmed");
  let executed = false;
  await assert.rejects(commitOperation({ id: run.lastRequestId, userId: owner, actionId: "accounts.create", payload: data, confirmed: true }, async () => {
    executed = true;
    return { entityId: "never-created", result: {} };
  }), /取消|替换|版本/);
  assert.equal(executed, false);
  await retireStarterOperations(run);
  assert.equal((await readOperation(run.lastRequestId, owner)).state, "cancelled");
});

test("repeated signing and confirmation share one operation identity without writing an account", { skip: !enabled }, async () => {
  const run = await pending(), data = account();
  const [first, second] = await Promise.all([sign(run, data), sign(run, data)]);
  assert.equal((await readAgentIntent(first, owner)).jti, run.lastRequestId);
  assert.equal((await readAgentIntent(second, owner)).jti, run.lastRequestId);
  const results = await Promise.all([executeConfirmedIntent(first, owner, access), executeConfirmedIntent(second, owner, access)]);
  assert.deepEqual(results.map(result => result.fill?.operationId), [run.lastRequestId, run.lastRequestId]);
  const operations = await getDb().select().from(semanticOperations).where(eq(semanticOperations.harnessRunId, run.id));
  assert.equal(operations.length, 1);
  assert.equal(operations[0].harnessRequestId, run.lastRequestId);
  assert.equal(operations[0].state, "confirmed");
  assert.equal((await getDb().select().from(adminAccounts).where(eq(adminAccounts.username, data.username))).length, 0);
});

test("task ownership, application, build, stale task and current permissions bind confirmations", { skip: !enabled }, async () => {
  for (const override of [
    { ownerId: "other-user" },
    { applicationId: "other-platform" },
    { buildId: `${APPLICATION_BUILD_ID}-old` },
    { updatedAt: new Date(Date.now() - 31 * 60_000).toISOString() },
  ]) {
    const run = await pending(override);
    await assert.rejects(executeConfirmedIntent(await sign(run), owner, access), /取消|替换|版本/);
    await assert.rejects(readOperation(run.lastRequestId, owner), /不存在/);
  }
  const run = await pending(), token = await sign(run);
  await assert.rejects(executeConfirmedIntent(token, "other-user", access), /不属于/);
  await assert.rejects(executeConfirmedIntent(token, owner, { ...access, permissionCodes: ["accounts:read"] }), /没有权限/);
  await assert.rejects(readOperation(run.lastRequestId, owner), /不存在/);
});

test("a verified real save is resumable, retries have one effect, changed payload is rejected", { skip: !enabled }, async () => {
  const run = await pending(), data = account();
  const confirmed = await executeConfirmedIntent(await sign(run, data), owner, access);
  const id = confirmed.fill!.operationId!;
  await assert.rejects(prepareContinuationReadback(id, owner, access), /尚未保存/);
  let executed = 0;
  const commit = () => commitOperation({ id, userId: owner, actionId: "accounts.create", payload: data, confirmed: true }, async tx => {
    executed += 1;
    const created = await createAdminAccount(data, tx);
    accountIds.push(created.id);
    return { entityId: created.id, revision: created.revision, result: { account: created } };
  });
  const [a, b] = await Promise.all([commit(), commit()]);
  assert.deepEqual(a, b);
  assert.equal(executed, 1);
  assert.equal((await verifyOperation(id, owner))?.status, "verified");
  await assert.rejects(commitOperation({ id, userId: owner, actionId: "accounts.create", payload: { ...data, name: "different" }, confirmed: true }, async () => {
    throw new Error("changed payload must not execute");
  }), /内容不同/);
  const readback = await prepareContinuationReadback(id, owner, access);
  assert.equal(JSON.parse(readback.summary).id, a.entityId);
  assert.equal(JSON.parse(readback.summary).username, data.username);
  assert.equal(readback.blocks?.[0]?.type, "table");
  await assert.rejects(prepareContinuationReadback(id, "other-user", access), /不存在/);
  await assert.rejects(prepareContinuationReadback(id, owner, { ...access, permissionCodes: [] }), /没有账号读取权限/);
  await closeDb();
  assert.equal((await prepareContinuationReadback(id, owner, access)).summary, readback.summary);
});
