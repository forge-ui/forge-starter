import assert from "node:assert/strict";
import { test, beforeEach } from "node:test";
import {
  AGENT_PAGE_DONE_EVENT, abandonAgentContinuation, consumeAgentFormFill,
  notifyAgentPageDone, peekAgentFormFill, queueAgentContinuation, queueAgentFormFill,
} from "../lib/agent/fill";

const storage = new Map<string, string>();
const events = new EventTarget();
Object.defineProperty(globalThis, "window", { value: {
  sessionStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  },
  dispatchEvent: events.dispatchEvent.bind(events),
} });
beforeEach(() => storage.clear());

const continuation = { sessionId: "original-session", question: "保存后核对并导出", modelId: "original-model", mode: "edit" as const };

for (const mode of ["create", "edit", "delete"] as const) {
test(`a matching ${mode} continues the original session exactly once`, () => {
  const received: unknown[] = [];
  const handler = (event: Event) => received.push((event as CustomEvent).detail);
  events.addEventListener(AGENT_PAGE_DONE_EVENT, handler);
  try {
    const pending = { ...continuation, mode };
    queueAgentContinuation(pending);
    notifyAgentPageDone(mode === "delete" ? "edit" : "delete");
    assert.equal(received.length, 0);
    notifyAgentPageDone(mode);
    notifyAgentPageDone(mode);
    assert.deepEqual(received, [pending]);
  } finally { events.removeEventListener(AGENT_PAGE_DONE_EVENT, handler); }
});
}

test("cancelling an AI form prevents an unrelated manual save from continuing it", () => {
  queueAgentContinuation(continuation);
  abandonAgentContinuation();
  let called = false;
  const handler = () => { called = true; };
  events.addEventListener(AGENT_PAGE_DONE_EVENT, handler);
  try { notifyAgentPageDone("edit"); assert.equal(called, false); }
  finally { events.removeEventListener(AGENT_PAGE_DONE_EVENT, handler); }
});

test("page navigation can consume a queued form only once", () => {
  const fill = { formId: "accounts" as const, mode: "edit" as const, href: "/accounts/", recordId: "test-record", fields: { notes: "new notes" } };
  queueAgentFormFill(fill);
  assert.deepEqual(peekAgentFormFill("accounts"), fill);
  assert.deepEqual(consumeAgentFormFill("accounts"), fill);
  assert.equal(consumeAgentFormFill("accounts"), null);
});

test("corrupt stored continuation does not break saving", () => {
  storage.set("forge-starter:agent-continue", "invalid JSON");
  assert.doesNotThrow(() => notifyAgentPageDone("edit"));
  assert.equal(storage.size, 0);
});
