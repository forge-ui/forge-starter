import { after, test } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { closeDb, getDb } from "../../lib/db";
import { harnessRuns } from "../../lib/db/schema";
import { createPostgresTaskStore } from "../../lib/harness/postgres-store";
import { HARNESS_VERSION, jsonValue, type Run } from "../../lib/harness/types";

const enabled = (() => {
  try {
    const url = new URL(process.env.DATABASE_URL ?? "");
    return url.hostname === "127.0.0.1" && url.pathname.startsWith("/forge_semantic_test_");
  } catch { return false; }
})();
const ids: string[] = [];
const store = createPostgresTaskStore();
const suite = crypto.randomUUID();
const ownerA = `harness-store-a-${suite}`;
const ownerB = `harness-store-b-${suite}`;

function run(overrides: Partial<Run> = {}): Run {
  const id = crypto.randomUUID();
  ids.push(id);
  return {
    version: HARNESS_VERSION,
    id,
    ownerId: ownerA,
    applicationId: "store-test-app",
    buildId: "test-build",
    revision: 0,
    status: "waiting-user",
    goal: "查看账号后选择目标",
    capabilityNames: ["accounts.list"],
    messages: [{ role: "user", content: "查看账号" }],
    pending: {
      id: "interaction-1", kind: "question", title: "选择账号", allowText: true,
      options: [{ id: "one", label: "账号甲", description: "运营" }],
      toolCallId: "call-1", capability: "harness.ask",
      payload: { source: "accounts.list", candidateIds: ["account-a", "account-b"] },
    },
    output: { text: "请选择账号", data: { count: 2, matched: true, empty: null, items: [{ id: "account-a" }] } },
    exchanges: [],
    events: [{ kind: "waiting", label: "等待选择", at: "2026-09-29T00:00:00.000Z" }],
    lastRequestId: "request-1",
    updatedAt: "2026-09-29T00:00:00.000Z",
    ...overrides,
  };
}

after(async () => {
  if (!enabled) return;
  for (const id of ids) await getDb().delete(harnessRuns).where(eq(harnessRuns.id, id));
  await closeDb();
});

test("store isolates load/list by authenticated owner and application", { skip: !enabled }, async () => {
  const app = `isolation-${suite}`;
  const a = run({ applicationId: app });
  const b = run({ ownerId: ownerB, applicationId: app });
  const otherApp = run({ applicationId: `${app}-other` });
  await Promise.all([a, b, otherApp].map(value => store.create(value)));

  assert.deepEqual(await store.load(a.id, ownerA, app), a);
  assert.equal(await store.load(a.id, ownerB, app), null);
  assert.equal(await store.load(a.id, ownerA, `${app}-other`), null);
  assert.deepEqual((await store.list(ownerA, app, 20)).map(value => value.id), [a.id]);
  assert.deepEqual((await store.list(ownerB, app, 20)).map(value => value.id), [b.id]);
});

test("store CAS permits one concurrent writer and binds owner/app/build", { skip: !enabled }, async () => {
  const original = run();
  await store.create(original);
  const next = { ...original, revision: 1, updatedAt: "2026-09-29T00:01:00.000Z" };
  assert.equal(await store.save({ ...next, ownerId: ownerB }, 0), false);
  assert.equal(await store.save({ ...next, applicationId: "different-app" }, 0), false);
  assert.equal(await store.save({ ...next, buildId: "different-build" }, 0), false);

  const results = await Promise.all([
    store.save({ ...next, goal: "writer-a" }, 0),
    store.save({ ...next, goal: "writer-b" }, 0),
  ]);
  assert.equal(results.filter(Boolean).length, 1);
  const loaded = await store.load(original.id, original.ownerId, original.applicationId);
  assert.equal(loaded?.revision, 1);
  assert.equal(loaded?.goal, results[0] ? "writer-a" : "writer-b");
  assert.equal(await store.save({ ...next, goal: "stale-writer" }, 0), false);
  await assert.rejects(store.save({ ...next, revision: 3 }, 1), /版本必须递增/);
});

test("store persists canonical JSONB state and survives a connection restart", { skip: !enabled }, async () => {
  const original = run();
  Object.assign(original.output.data, { omitted: undefined });
  await store.create(original);
  await closeDb();
  const loaded = await createPostgresTaskStore().load(original.id, original.ownerId, original.applicationId);
  assert.deepEqual(loaded, jsonValue(original));
  assert.equal(Object.hasOwn(loaded!.output.data, "omitted"), false);

  const changed: Run = { ...loaded!, revision: 1, pending: undefined, leaseUntil: undefined, status: "completed" };
  assert.equal(await store.save(changed, 0), true);
  const saved = await store.load(original.id, original.ownerId, original.applicationId);
  assert.deepEqual(saved, jsonValue(changed));
  assert.equal(Object.hasOwn(saved!, "pending"), false);
  await assert.rejects(store.create({ ...original, ownerId: ownerB }), /已存在/);
  assert.deepEqual(await store.load(original.id, original.ownerId, original.applicationId), saved);
});

test("store lists at most twenty recent runs with stable ordering", { skip: !enabled }, async () => {
  const app = `list-${suite}`;
  const rows = Array.from({ length: 22 }, (_, index) => run({ applicationId: app, updatedAt: new Date(Date.UTC(2026, 8, 29, 0, index)).toISOString() }));
  await Promise.all(rows.map(value => store.create(value)));
  const loaded = await store.list(ownerA, app, 100);
  assert.equal(loaded.length, 20);
  assert.deepEqual(loaded.map(value => value.id), rows.slice(2).reverse().map(value => value.id));
  assert.equal((await store.list(ownerA, app, 2)).length, 2);
  assert.deepEqual(await store.list(ownerA, app, 0), []);
});
