import assert from "node:assert/strict";
import { test } from "node:test";
import { closeDatabaseScope, type DatabaseScope } from "../../lib/db/request-scope";

test("streaming request keeps its database open until the final checkpoint settles", async () => {
  let complete!: () => void;
  let closed = false;
  const scope: DatabaseScope = {
    pending: [new Promise<void>(resolve => { complete = resolve; })],
    close: async () => { closed = true; },
  };
  const cleanup = closeDatabaseScope(scope);
  await Promise.resolve();
  assert.equal(closed, false);
  complete();
  await cleanup;
  assert.equal(closed, true);
});

test("failed background work still closes the request database", async () => {
  let closed = false;
  await closeDatabaseScope({ pending: [Promise.reject(new Error("cancelled"))], close: async () => { closed = true; } });
  assert.equal(closed, true);
});
