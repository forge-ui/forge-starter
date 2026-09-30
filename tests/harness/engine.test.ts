import { test } from "node:test";
import assert from "node:assert/strict";
import { advanceRun } from "../../lib/harness/engine";
import { HarnessError, jsonValue, type Capability, type HarnessPorts, type Input, type JsonObject, type Message, type Run, type TaskStore, type ToolCall, type ToolResult } from "../../lib/harness/types";

/** Matches the persistent store's JSON boundary and atomic revision semantics. */
class MemoryStore implements TaskStore {
  rows = new Map<string, Run>();
  async create(run: Run) {
    if (this.rows.has(run.id)) throw new HarnessError("duplicate");
    this.rows.set(run.id, jsonValue(run));
  }
  async load(id: string, ownerId: string, applicationId: string) {
    const row = this.rows.get(id);
    return row?.ownerId === ownerId && row.applicationId === applicationId ? jsonValue(row) : null;
  }
  async save(run: Run, expectedRevision: number) {
    const row = this.rows.get(run.id);
    if (!row || row.ownerId !== run.ownerId || row.applicationId !== run.applicationId || row.buildId !== run.buildId || row.revision !== expectedRevision) return false;
    assert.equal(run.revision, expectedRevision + 1);
    this.rows.set(run.id, jsonValue(run));
    return true;
  }
  async list(ownerId: string, applicationId: string, limit: number) {
    return [...this.rows.values()].filter(row => row.ownerId === ownerId && row.applicationId === applicationId).slice(0, Math.min(20, limit)).map(row => jsonValue(row));
  }
}

const capabilities: Capability[] = [
  { name: "tickets.list", description: "查询工单", parameters: { type: "object" }, effect: "read" },
  { name: "tickets.assign", description: "准备工单分派", parameters: { type: "object", properties: { ticketId: { type: "string" } }, required: ["ticketId"] }, effect: "proposal" },
];
const tickets = [{ id: "ticket-a", name: "登录故障" }, { id: "ticket-b", name: "导出超时" }];
const call = (name: string, args: JsonObject, id = name): ToolCall => ({ id, name, arguments: JSON.stringify(args) });
const choose = () => call("ask_user", { title: "选择要分派的工单", options: tickets.map(row => ({ id: row.id, label: row.name })), allowText: true }, "choose-ticket");
const scope = { ownerId: "user-a", applicationId: "tickets-app", buildId: "tickets-build-1" };
const start = (requestId = "request-1"): Input => ({ ...scope, requestId, question: "查看工单，选好后分派" });
const follow = (run: Run, patch: Partial<Input> = {}): Input => ({ ...scope, requestId: "request-2", runId: run.id, expectedRevision: run.revision, question: "", ...patch });

function fixture(turns: Array<{ content?: string; toolCalls?: ToolCall[] }> = []) {
  const store = new MemoryStore();
  const seen: Message[][] = [];
  const invoked: Array<{ name: string; args: JsonObject }> = [];
  const retired: Run[] = [];
  let nextId = 0;
  const ports: HarnessPorts = {
    store,
    id: () => `generated-${++nextId}`,
    now: () => new Date("2026-09-29T01:00:00.000Z"),
    model: { async next(messages) {
      seen.push(jsonValue(messages));
      const next = turns.shift();
      assert.ok(next, "unexpected extra model turn");
      return { content: next.content ?? "", toolCalls: next.toolCalls ?? [] };
    } },
    capabilities: {
      async list() { return capabilities; },
      async invoke(name, args): Promise<ToolResult> {
        invoked.push({ name, args: jsonValue(args) });
        if (name === "tickets.list") return { summary: JSON.stringify(tickets), data: { tickets } };
        if (name !== "tickets.assign" || typeof args.ticketId !== "string" || !tickets.some(row => row.id === args.ticketId)) throw new Error("请提供有效工单编号");
        return { summary: "已准备分派，请在页面核对后保存", data: { selectedTicket: args.ticketId }, wait: {
          kind: "external", title: "核对工单分派", options: [], allowText: false,
          payload: { operationId: "operation-1", ticketId: args.ticketId },
        } };
      },
    },
    context: { async resolve() { return "工单操作由页面保存；事实以查询和执行回执为准。"; } },
    operations: { async retire(run) { retired.push(jsonValue(run)); } },
  };
  return { store, ports, seen, invoked, retired, turns };
}

test("independent tickets adapter completes query, structured choice, proposal and verified receipt", async () => {
  const f = fixture([
    { toolCalls: [call("tickets.list", {})] },
    { toolCalls: [choose()] },
    { toolCalls: [call("tickets.assign", { ticketId: "ticket-b" })] },
    { content: "分派结果已核实，可以查看工单详情。" },
  ]);
  const waiting = await advanceRun(start(), f.ports);
  assert.equal(waiting.status, "waiting-user");
  assert.deepEqual(waiting.pending?.options.map(option => option.id), tickets.map(row => row.id));
  assert.deepEqual(f.invoked.map(row => row.name), ["tickets.list"]);
  assert.equal(waiting.tasks?.find(task => task.id === "request-1:tool:0:0")?.status, "completed");
  const choiceTask = waiting.tasks?.find(task => task.interactionId === waiting.pending!.id);
  assert.equal(choiceTask?.status, "waiting-user");
  const proposed = await advanceRun(follow(waiting, { reply: { interactionId: waiting.pending!.id, optionId: "ticket-b" } }), f.ports);
  assert.equal(proposed.status, "waiting-external");
  assert.equal(proposed.pending?.payload?.ticketId, "ticket-b");
  assert.equal(proposed.tasks?.find(task => task.id === choiceTask!.id)?.status, "completed");
  assert.equal(proposed.tasks?.find(task => task.id === "request-2:tool:0:0")?.status, "completed", "preparing the proposal is complete");
  const saveTask = proposed.tasks?.find(task => task.interactionId === proposed.pending!.id);
  assert.equal(saveTask?.status, "waiting-external", "business save remains pending until a verified receipt");
  const choiceResult = f.seen[2].find(message => message.role === "tool" && message.toolCallId === "choose-ticket");
  assert.deepEqual(JSON.parse(choiceResult!.content).choice, { id: "ticket-b", label: "导出超时" });
  const completed = await advanceRun(follow(proposed, { requestId: "request-3", receipt: { interactionId: proposed.pending!.id, summary: "数据库确认工单 ticket-b 已分派给成员甲", data: { receipt: { operationId: "operation-1", verified: true } } } }), f.ports);
  assert.equal(completed.status, "completed");
  assert.equal(completed.pending, undefined);
  assert.equal(completed.exchanges.length, 3);
  assert.deepEqual(completed.output.data.receipt, { operationId: "operation-1", verified: true });
  assert.equal(completed.tasks?.find(task => task.id === saveTask!.id)?.status, "completed");
  assert.equal(completed.tasks?.find(task => task.id === saveTask!.id)?.meta, "已核实页面保存回执");
  assert.deepEqual(await f.store.load(completed.id, scope.ownerId, scope.applicationId), jsonValue(completed));
});

test("a pending interaction prevents all later tool calls in that model response", async () => {
  const f = fixture([{ toolCalls: [choose(), call("tickets.assign", { ticketId: "ticket-a" }, "must-not-run")] }]);
  const waiting = await advanceRun(start(), f.ports);
  assert.equal(waiting.status, "waiting-user");
  assert.deepEqual(f.invoked, []);
  assert.ok(waiting.messages.some(message => message.role === "tool" && message.toolCallId === "must-not-run" && message.content.includes("尚未执行")));
  assert.equal(waiting.tasks?.some(task => task.id === "request-1:tool:0:1"), false, "skipped calls must not appear as attempted execution");
});

test("existing runs reject another owner, app, build or changed capability permissions", async () => {
  const f = fixture([{ toolCalls: [choose()] }]);
  const waiting = await advanceRun(start(), f.ports);
  await assert.rejects(advanceRun(follow(waiting, { ownerId: "user-b", question: "继续" }), f.ports), (error: unknown) => error instanceof HarnessError && error.status === 404);
  await assert.rejects(advanceRun(follow(waiting, { applicationId: "another-app", question: "继续" }), f.ports), (error: unknown) => error instanceof HarnessError && error.status === 404);
  await assert.rejects(advanceRun(follow(waiting, { buildId: "new-build", question: "继续" }), f.ports), /应用版本/);
  f.ports.capabilities.list = async () => [capabilities[0]];
  await assert.rejects(advanceRun(follow(waiting, { question: "继续" }), f.ports), (error: unknown) => error instanceof HarnessError && error.status === 403);
  assert.equal(f.seen.length, 1);
});

test("duplicate request returns stored state without repeating model or tool calls", async () => {
  const f = fixture([{ toolCalls: [choose()] }]);
  const waiting = await advanceRun(start(), f.ports);
  const replay = await advanceRun(follow(waiting, { requestId: "request-1", expectedRevision: 0 }), f.ports);
  assert.deepEqual(replay, waiting);
  assert.equal(f.seen.length, 1);
  assert.deepEqual(f.invoked, []);
});

test("stale revisions, retired interactions, invalid choices and unmatched receipts cannot advance", async () => {
  const f = fixture([{ toolCalls: [choose()] }]);
  const waiting = await advanceRun(start(), f.ports);
  const reply = { interactionId: waiting.pending!.id, optionId: "ticket-a" };
  await assert.rejects(advanceRun(follow(waiting, { expectedRevision: 0, reply }), f.ports), /会话已更新/);
  await assert.rejects(advanceRun(follow(waiting, { reply: { ...reply, interactionId: "old-interaction" } }), f.ports), /交互已结束/);
  await assert.rejects(advanceRun(follow(waiting, { reply: { ...reply, optionId: "not-listed" } }), f.ports), /候选范围/);
  await assert.rejects(advanceRun(follow(waiting, { receipt: { interactionId: waiting.pending!.id, summary: "fake receipt", data: {} } }), f.ports), /回执与当前任务/);
  assert.deepEqual(await f.store.load(waiting.id, scope.ownerId, scope.applicationId), waiting);
});

test("concurrent replies acquire one CAS writer and invoke the model once", async () => {
  const f = fixture([{ toolCalls: [choose()] }, { content: "已收到选择" }]);
  const waiting = await advanceRun(start(), f.ports);
  const reply = { interactionId: waiting.pending!.id, optionId: "ticket-a" };
  const results = await Promise.allSettled([
    advanceRun(follow(waiting, { requestId: "concurrent-a", reply }), f.ports),
    advanceRun(follow(waiting, { requestId: "concurrent-b", reply }), f.ports),
  ]);
  assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
  const rejected = results.find(result => result.status === "rejected");
  assert.ok(rejected?.status === "rejected" && rejected.reason instanceof HarnessError);
  assert.equal(f.seen.length, 2);
});

test("cancel retires outstanding proposals and removes pending state", async () => {
  const f = fixture([{ toolCalls: [call("tickets.assign", { ticketId: "ticket-a" })] }]);
  const proposed = await advanceRun(start(), f.ports);
  const cancelled = await advanceRun(follow(proposed, { reply: { interactionId: proposed.pending!.id, cancel: true } }), f.ports);
  assert.equal(cancelled.status, "cancelled");
  assert.equal(cancelled.pending, undefined);
  assert.deepEqual(cancelled.messages, []);
  assert.deepEqual(f.retired, [proposed]);
  assert.equal(f.seen.length, 1);
  assert.equal(cancelled.tasks?.find(task => task.interactionId === proposed.pending!.id)?.status, "cancelled");
  assert.equal(cancelled.tasks?.find(task => task.id === "request-1:tool:0:0")?.status, "completed", "cancelling a save does not undo the completed preparation");
});

test("a new goal retires pending interaction before continuing", async () => {
  const f = fixture([{ toolCalls: [choose()] }, { content: "本轮只统计工单" }]);
  const waiting = await advanceRun(start(), f.ports);
  const next = await advanceRun(follow(waiting, { question: "改成只统计工单" }), f.ports);
  assert.equal(next.goal, "改成只统计工单");
  assert.equal(next.pending, undefined);
  assert.deepEqual(f.retired, [waiting]);
  assert.equal(f.seen[1].some(message => message.role === "assistant" && message.toolCalls?.length), false);
  assert.ok(next.tasks?.every(task => task.id.startsWith("request-2:")), "a new goal must not reuse old execution steps");
});

test("unregistered tools and invalid JSON/schema return errors and permit correction", async () => {
  const f = fixture([
    { toolCalls: [{ id: "bad-json", name: "tickets.assign", arguments: "{" }, call("not.registered", {}, "unknown"), call("tickets.assign", { ticketId: 42 }, "bad-schema")] },
    { toolCalls: [call("tickets.list", {})] },
    { content: "已查询工单" },
  ]);
  const completed = await advanceRun(start(), f.ports);
  assert.equal(completed.status, "completed");
  assert.deepEqual(f.invoked.map(row => row.name), ["tickets.assign", "tickets.list"]);
  const failures = f.seen[1].filter(message => message.role === "tool");
  assert.equal(failures.length, 3);
  assert.ok(failures.every(message => JSON.parse(message.content).error));
  assert.equal(completed.events.filter(event => event.kind === "tool-error").length, 3);
  assert.equal(completed.tasks?.filter(task => task.status === "failed").length, 3, "correcting a tool error must preserve the failed attempt");
  assert.equal(completed.tasks?.find(task => task.id === "request-1:tool:1:0")?.status, "completed");
});

test("model failure persists a safe message without provider credentials", async () => {
  const f = fixture();
  f.ports.model.next = async () => { throw new Error("provider failed: Bearer sk-do-not-persist-this-secret"); };
  const failed = await advanceRun(start(), f.ports);
  assert.equal(failed.status, "failed");
  assert.equal(failed.pending, undefined);
  assert.equal(failed.tasks?.find(task => task.id === "request-1:model:0")?.status, "failed");
  assert.equal(JSON.stringify(failed).includes("sk-do-not-persist"), false);
  assert.equal(JSON.stringify(await f.store.load(failed.id, scope.ownerId, scope.applicationId)).includes("sk-do-not-persist"), false);
});

test("deadline finishes even when a model adapter does not honor AbortSignal", async () => {
  const f = fixture();
  f.ports.limits = { timeoutMs: 10 };
  f.ports.model.next = async () => new Promise(() => undefined);
  const deadline = await Promise.race([
    advanceRun(start(), f.ports),
    new Promise<null>(resolve => setTimeout(() => resolve(null), 150)),
  ]);
  assert.notEqual(deadline, null, "harness must enforce its own execution deadline");
  assert.equal(deadline!.status, "failed");
  assert.equal(deadline!.leaseUntil, undefined);
  assert.equal(deadline!.tasks?.find(task => task.id === "request-1:model:0")?.status, "failed");
});

test("in-flight progress is checkpointed and uses the same ID when execution finishes", async () => {
  const f = fixture();
  let release!: () => void;
  let entered!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const started = new Promise<void>(resolve => { entered = resolve; });
  f.ports.model.next = async () => {
    entered();
    await gate;
    return { content: "已完成分析", toolCalls: [] };
  };
  const work = advanceRun(start(), f.ports);
  await started;
  const running = await f.store.load("request-1", scope.ownerId, scope.applicationId);
  const active = running?.tasks?.find(task => task.id === "request-1:model:0");
  assert.equal(running?.status, "running");
  assert.equal(active?.status, "running");
  release();
  const done = await work;
  assert.equal(done.tasks?.find(task => task.id === active!.id)?.status, "completed");
});

test("respond question persists a resumable interaction and consumes structured choice or text", async () => {
  for (const mode of ["option", "text"]) {
    const f = fixture([
      { toolCalls: [call("respond", { outcome: "question", text: "请选择工单，也可以指定名称", options: tickets.map(row => ({ id: row.id, label: row.name })), allowText: true }, "respond-question")] },
      { toolCalls: [call("respond", { outcome: "answer", text: "已收到明确目标，可以继续处理。", options: [], allowText: false }, "respond-answer")] },
    ]);
    const waiting = await advanceRun(start(), f.ports);
    assert.equal(waiting.status, "waiting-user");
    assert.equal(waiting.pending?.capability, "respond");
    assert.equal(waiting.pending?.toolCallId, "respond-question");
    assert.equal(waiting.pending?.allowText, true);
    const restored = await f.store.load(waiting.id, scope.ownerId, scope.applicationId);
    assert.deepEqual(restored, jsonValue(waiting));
    const reply = { interactionId: restored!.pending!.id, ...(mode === "option" ? { optionId: "ticket-b" } : { text: "指定导出超时工单" }) };
    const finished = await advanceRun(follow(restored!, { reply }), f.ports);
    assert.equal(finished.status, "completed");
    assert.equal(finished.pending, undefined);
    assert.equal(finished.output.text, "已收到明确目标，可以继续处理。");
    const answer = f.seen[1].find(message => message.role === "tool" && message.toolCallId === "respond-question");
    assert.ok(answer);
    assert.deepEqual(JSON.parse(answer.content), mode === "option"
      ? { choice: { id: "ticket-b", label: "导出超时" }, specified: null }
      : { choice: null, specified: "指定导出超时工单" });
    assert.deepEqual(f.invoked, []);
  }
});

test("respond answer terminates without executing later parallel business calls", async () => {
  const f = fixture([{ toolCalls: [
    call("respond", { outcome: "answer", text: "当前查询已完成。", options: [], allowText: false }, "answer-done"),
    call("tickets.assign", { ticketId: "ticket-a" }, "must-not-assign"),
  ] }]);
  const finished = await advanceRun(start(), f.ports);
  assert.equal(finished.status, "completed");
  assert.equal(finished.output.text, "当前查询已完成。");
  assert.equal(finished.pending, undefined);
  assert.deepEqual(f.invoked, []);
  assert.ok(finished.messages.some(message => message.role === "tool" && message.toolCallId === "must-not-assign" && message.content.includes("尚未执行")));
  assert.deepEqual(await f.store.load(finished.id, scope.ownerId, scope.applicationId), jsonValue(finished));
});

test("invalid respond parameters cannot complete or create an unusable interaction", async () => {
  const invalid: JsonObject[] = [
    { outcome: "done", text: "完成", options: [], allowText: false },
    { outcome: "answer", text: "", options: [], allowText: false },
    { outcome: "answer", text: "请选择", options: [{ id: "a", label: "甲" }], allowText: false },
    { outcome: "answer", text: "请选择", options: [], allowText: true },
    { outcome: "question", text: "", options: [], allowText: true },
    { outcome: "question", text: "选择工单", options: [{ id: "same", label: "甲" }, { id: "same", label: "乙" }], allowText: true },
    { outcome: "question", text: "选择工单", options: [], allowText: "yes" },
    { outcome: "question", text: "选择工单", options: [] },
    { outcome: "question", text: "选择工单", options: [], allowText: false },
  ];
  for (const args of invalid) {
    const f = fixture([{ toolCalls: [call("respond", args)] }]);
    f.ports.limits = { maxSteps: 1 };
    const failed = await advanceRun(start(), f.ports);
    assert.equal(failed.status, "failed", JSON.stringify(args));
    assert.equal(failed.pending, undefined);
    assert.ok(failed.events.some(event => event.kind === "tool-error"));
    assert.deepEqual(f.invoked, []);
  }
});

test("multi-select survives JSON storage and returns all selected objects to the model", async () => {
  const f = fixture([
    { toolCalls: [call("ask_user", { title: "选择检查范围", options: tickets.map(row => ({ id: row.id, label: row.name })), allowText: true, multiple: true })] },
    { content: "已收到两个范围，只提供建议。" },
  ]);
  const waiting = await advanceRun(start(), f.ports);
  assert.equal(waiting.pending?.multiple, true);
  const done = await advanceRun(follow(waiting, { reply: { interactionId: waiting.pending!.id, optionIds: ["ticket-b", "ticket-a"] } }), f.ports);
  assert.equal(done.status, "completed");
  const reply = f.seen[1].find(m => m.role === "tool");
  assert.ok(reply && reply.role === "tool");
  assert.deepEqual(JSON.parse(reply.content).choices.map((item: { id: string }) => item.id), ["ticket-a", "ticket-b"]);
  assert.equal(done.exchanges.at(-1)?.question, "登录故障、导出超时");
});

test("multi-select rejects invalid, duplicate, empty, mixed or single-question submissions before model invocation", async () => {
  const f = fixture([{ toolCalls: [call("ask_user", { title: "范围", options: tickets.map(row => ({ id: row.id, label: row.name })), allowText: true, multiple: true })] }]);
  const waiting = await advanceRun(start(), f.ports);
  for (const values of [{ optionIds: ["unknown"] }, { optionIds: ["ticket-a", "ticket-a"] }, { optionIds: [] }, { optionIds: ["ticket-a"], optionId: "ticket-a" }, { optionIds: ["ticket-a"], text: "other" }]) {
    await assert.rejects(advanceRun(follow(waiting, { reply: { interactionId: waiting.pending!.id, ...values } }), f.ports), HarnessError);
  }
  assert.equal(f.seen.length, 1);
  const single = fixture([{ toolCalls: [choose()] }]);
  const one = await advanceRun(start(), single.ports);
  await assert.rejects(advanceRun(follow(one, { reply: { interactionId: one.pending!.id, optionIds: ["ticket-a"] } }), single.ports), /仅支持单选/);
});
