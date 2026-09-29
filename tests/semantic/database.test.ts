import { test, after } from "node:test";
import assert from "node:assert/strict";
import { getDb, closeDb } from "../../lib/db";
import { semanticOperations, adminAccounts } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { commitOperation, registerOperation, readOperation, acknowledgeOperation } from "../../lib/semantic/operations";
import { createAdminAccount, updateAdminAccount, getAdminAccountById, deleteAdminAccount } from "../../lib/accounts/service";
const enabled = process.env.DATABASE_URL?.includes("/forge_semantic_test_");
const ids: string[] = [], operations: string[] = [];
const input = () => ({ name: "语义测试", username: `t_${crypto.randomUUID().slice(0,8)}`, email: `${crypto.randomUUID()}@example.test`, phone: "123", role: "运营" as const, department: "平台", status: "active" as const, notes: "" });
after(async () => { if (!enabled) return; for (const id of ids) await getDb().delete(adminAccounts).where(eq(adminAccounts.id, id)); for (const id of operations) await getDb().delete(semanticOperations).where(eq(semanticOperations.id, id)); await closeDb(); });
function op() { const id = crypto.randomUUID(); operations.push(id); return id; }
test("D03 parallel duplicate creates have one effect and one receipt", { skip: !enabled }, async () => {
  const data = input(), id = op();
  const run = () => commitOperation({ id, userId: "test-a", actionId: "accounts.create", payload: data }, async (tx) => { const account = await createAdminAccount(data, tx); ids.push(account.id); return { entityId: account.id, revision: account.revision, result: { account } }; });
  const [a, b] = await Promise.all([run(), run()]); assert.equal(a.entityId, b.entityId); assert.equal(ids.filter((v) => v === a.entityId).length, 1);
  assert.deepEqual(await run(), a);
  await assert.rejects(commitOperation({ id, userId: "test-a", actionId: "accounts.create", payload: { ...data, name: "different" } }, async () => { throw new Error("must not execute"); }), /内容不同/);
  await assert.rejects(readOperation(id, "test-b"), /不存在/);
});
test("D02 concurrent revision update prevents lost writes", { skip: !enabled }, async () => {
  const data = input(); const row = await createAdminAccount(data); ids.push(row.id);
  const results = await Promise.allSettled([updateAdminAccount(row.id, { ...data, name: "A" }, row.revision), updateAdminAccount(row.id, { ...data, name: "B" }, row.revision)]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal((await getAdminAccountById(row.id))?.revision, row.revision + 1);
});
test("D06 rolled back business insert has no successful receipt", { skip: !enabled }, async () => {
  const data = input(), id = op();
  await assert.rejects(commitOperation({ id, userId: "test-a", actionId: "accounts.create", payload: data }, async (tx) => { await createAdminAccount(data, tx); throw new Error("forced rollback"); }));
  assert.equal((await getDb().select().from(adminAccounts).where(eq(adminAccounts.username, data.username))).length, 0);
  await assert.rejects(readOperation(id, "test-a"));
});
test("D01 edited draft is final receipt; D07 cancelled intent cannot save", { skip: !enabled }, async () => {
  const id = op(), data = input(); await registerOperation(id, "test-a", "accounts.create"); await acknowledgeOperation(id, "test-a", "awaiting-save");
  const receipt = await commitOperation({ id, userId: "test-a", actionId: "accounts.create", payload: { ...data, name: "用户最终值" }, confirmed: true }, async (tx) => { const account = await createAdminAccount({ ...data, name: "用户最终值" }, tx); ids.push(account.id); return { entityId: account.id, result: { account } }; });
  assert.equal((receipt.result.account as { name: string }).name, "用户最终值");
  const cancelled = op(); await registerOperation(cancelled, "test-a", "accounts.create"); await acknowledgeOperation(cancelled, "test-a", "cancelled");
  await assert.rejects(commitOperation({ id: cancelled, userId: "test-a", actionId: "accounts.create", payload: data, confirmed: true }, async () => { throw new Error("never"); }), /取消/);
});
test("S01 confirmation cannot be moved to a different entity or user", { skip: !enabled }, async () => {
  const id = op(); await registerOperation(id, "test-a", "accounts.update", "entity-a");
  const run = async () => ({ entityId: "entity-b", result: {} });
  await assert.rejects(commitOperation({ id, userId: "test-a", actionId: "accounts.update", entityId: "entity-b", payload: {}, confirmed: true }, run), /目标/);
  await assert.rejects(commitOperation({ id, userId: "test-b", actionId: "accounts.update", entityId: "entity-a", payload: {}, confirmed: true }, run), /用户/);
});
test("D08 receipt survives reconnect; stale delete conflicts", { skip: !enabled }, async () => {
  const data = input(), id = op(); const row = await createAdminAccount(data); ids.push(row.id);
  await commitOperation({ id, userId: "test-a", actionId: "accounts.update", entityId: row.id, payload: data }, async (tx) => { const account = await updateAdminAccount(row.id, data, row.revision, tx); return { entityId: account.id, result: { account } }; });
  await closeDb(); assert.equal((await readOperation(id, "test-a")).state, "committed");
  await assert.rejects(deleteAdminAccount(row.id, row.revision), /刷新/);
});
