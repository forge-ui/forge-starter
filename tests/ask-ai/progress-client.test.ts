import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { test } from "node:test";
import { watchAskAiProgress } from "../../lib/ask-ai-progress-client";
import type { AskAiHarnessState } from "../../lib/ask-ai";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

function progress(requestId = "request-current", revision = 1, status = "running", id = "run-current") {
  return Response.json({ ok: true, requestId, harness: { id, revision, status, events: [], tasks: [{ id: "step-1", title: "查询账号", status }] }, navigation: { href: "/must-not-navigate" }, fill: { marker: "must-not-apply" } });
}

test("polling ignores another request's checkpoint and exposes only matching progress", async () => {
  const received = deferred<AskAiHarnessState>();
  const seen: AskAiHarnessState[] = [];
  let reads = 0;
  const stop = watchAskAiProgress({
    runId: "run-current", requestId: "request-current", signal: new AbortController().signal,
    isCurrent: () => true, intervalMs: 1,
    fetcher: async (url, init) => {
      assert.equal(url, "/api/ask-ai/runs/?runId=run-current");
      assert.equal(init?.cache, "no-store");
      reads += 1;
      if (reads === 1) return progress("request-old", 99);
      if (reads === 2) return progress("request-current", 99, "running", "run-other");
      return progress("request-current", 2, "completed");
    },
    onProgress: state => { seen.push(state); received.resolve(state); },
  });
  try {
    const state = await received.promise;
    assert.equal(state.revision, 2, "an unrelated high revision must not suppress current progress");
    assert.equal(state.status, "completed");
    assert.equal(seen.length, 1);
    assert.equal(reads, 3);
    assert.equal("navigation" in state, false);
    assert.equal("fill" in state, false);
  } finally { stop(); }
});

test("abort cancels the read and late responses cannot update a stopped turn", async () => {
  const entered = deferred<AbortSignal>();
  const response = deferred<Response>();
  const controller = new AbortController();
  const seen: AskAiHarnessState[] = [];
  const stop = watchAskAiProgress({
    runId: "run-current", requestId: "request-current", signal: controller.signal,
    isCurrent: () => true, intervalMs: 1,
    fetcher: async (_url, init) => { entered.resolve(init!.signal!); return response.promise; },
    onProgress: state => { seen.push(state); },
  });
  try {
    const signal = await entered.promise;
    controller.abort();
    assert.equal(signal.aborted, true);
    response.resolve(progress());
    await setImmediate();
    assert.deepEqual(seen, []);
  } finally { stop(); }
});

test("request replacement or a final POST result blocks an already-running checkpoint read", async () => {
  for (const reason of ["replacement", "final-result"]) {
    const entered = deferred<void>();
    const response = deferred<Response>();
    let current = true;
    let updates = 0;
    const stop = watchAskAiProgress({
      runId: "run-current", requestId: "request-current", signal: new AbortController().signal,
      isCurrent: () => current, intervalMs: 1,
      fetcher: async () => { entered.resolve(); return response.promise; },
      onProgress: () => { updates += 1; },
    });
    try {
      await entered.promise;
      if (reason === "replacement") current = false;
      else stop();
      response.resolve(progress());
      await setImmediate();
      assert.equal(updates, 0, reason);
    } finally { stop(); }
  }
});

test("permission loss terminates polling and an already-aborted request never polls", async () => {
  const entered = deferred<AbortSignal>();
  const stop = watchAskAiProgress({
    runId: "run-current", requestId: "request-current", signal: new AbortController().signal,
    isCurrent: () => true, intervalMs: 1,
    fetcher: async (_url, init) => { entered.resolve(init!.signal!); return Response.json({ ok: false }, { status: 403 }); },
    onProgress: () => assert.fail("an unauthorized response is not progress"),
  });
  try {
    const signal = await entered.promise;
    await setImmediate();
    assert.equal(signal.aborted, true);
  } finally { stop(); }
  const controller = new AbortController();
  controller.abort();
  const stopAborted = watchAskAiProgress({
    runId: "run-current", requestId: "request-current", signal: controller.signal,
    isCurrent: () => true, intervalMs: 1,
    fetcher: async () => { assert.fail("an aborted request must not fetch"); },
    onProgress: () => assert.fail("an aborted request must not update"),
  });
  await setImmediate();
  stopAborted();
});
