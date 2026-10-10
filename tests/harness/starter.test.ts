import assert from "node:assert/strict";
import { test } from "node:test";
import { createStarterPorts, answerWithHarness, publicHarness, readStarterRunProgress } from "../../lib/harness/starter";
import { postgresTaskStore } from "../../lib/harness/postgres-store";
import { advanceRun } from "../../lib/harness/engine";
import { HARNESS_VERSION, HarnessError, ToolInputError, jsonValue, type Run, type TaskStore, type Message } from "../../lib/harness/types";
import { agentToolById } from "../../lib/agent/registry";
import { APPLICATION_BUILD_ID } from "../../lib/semantic/contracts";
import type { AccessContext } from "../../lib/rbac/access";

const model = { id: "test-model", name: "测试模型", provider: "openai", modelName: "test-model", apiBase: "https://model.example.test/v1", apiKey: "test-only-placeholder" };
const ownerId = "harness-adapter-test-user";
const applicationId = "forge-starter";
const buildId = APPLICATION_BUILD_ID;

function access(resources: AccessContext["allowedModules"], permissions: string[]): AccessContext {
  return { roleCode: "harness-test", roleName: "测试角色", isSuperAdmin: false, allowedModules: resources, permissionCodes: permissions };
}

function run(patch: Partial<Run> = {}): Run {
  return {
    version: HARNESS_VERSION, id: crypto.randomUUID(), ownerId, applicationId, buildId,
    revision: 1, status: "running", goal: "查看账号", capabilityNames: [], messages: [],
    output: { text: "", data: {} }, exchanges: [], events: [], lastRequestId: crypto.randomUUID(),
    updatedAt: new Date().toISOString(), ...patch,
  };
}

class MemoryStore implements TaskStore {
  rows = new Map<string, Run>();
  async create(value: Run) { assert(!this.rows.has(value.id)); this.rows.set(value.id, jsonValue(value)); }
  async load(id: string, owner: string, app: string) {
    const value = this.rows.get(id);
    return value?.ownerId === owner && value.applicationId === app ? jsonValue(value) : null;
  }
  async save(value: Run, expected: number) {
    const prior = this.rows.get(value.id);
    if (!prior || prior.revision !== expected || prior.ownerId !== value.ownerId || prior.applicationId !== value.applicationId || prior.buildId !== value.buildId) return false;
    this.rows.set(value.id, jsonValue(value));
    return true;
  }
  async list(owner: string, app: string, limit: number) {
    return [...this.rows.values()].filter(value => value.ownerId === owner && value.applicationId === app).slice(0, limit).map(value => jsonValue(value));
  }
}

test("cancellation does not require a configured or reachable model", async () => {
  let resolved = false;
  const ports = createStarterPorts({ userId: ownerId, access: access(["accounts"], ["accounts:read", "accounts:create"]), model: async () => { resolved = true; throw new Error("model unavailable"); } });
  const store = new MemoryStore();
  ports.store = store;
  ports.operations.retire = async () => undefined;
  const pending = run({ status: "waiting-external", capabilityNames: (await ports.capabilities.list()).map(c => c.name).sort(), pending: { id: "confirm-one", kind: "external", title: "确认草稿", options: [], allowText: false, toolCallId: "create", capability: "accounts_create" } });
  await store.create(pending);
  const cancelled = await advanceRun({ ownerId, applicationId, buildId, runId: pending.id, expectedRevision: pending.revision, requestId: crypto.randomUUID(), question: "", reply: { interactionId: pending.pending!.id, cancel: true } }, ports);
  assert.equal(cancelled.status, "cancelled");
  assert.equal(resolved, false);
});

test("progress reads are scoped to owner, application, build and capabilities without exposing page effects", async () => {
  const grant = access(["accounts"], ["accounts:read"]);
  const ports = createStarterPorts({ userId: ownerId, access: grant, model: async () => { assert.fail("progress reads must not resolve a model"); } });
  const stored = run({
    capabilityNames: (await ports.capabilities.list()).map(capability => capability.name).sort(),
    tasks: [{ id: "task-current", title: "查询账号", status: "running" }],
    output: { text: "internal answer", data: { navigation: { href: "/must-not-replay" }, fill: { commandId: "must-not-apply" } } },
  });
  const originalLoad = postgresTaskStore.load;
  postgresTaskStore.load = async (id, owner, app) => {
    assert.equal(app, applicationId);
    return id === stored.id && owner === stored.ownerId ? jsonValue(stored) : null;
  };
  try {
    const value = await readStarterRunProgress(stored.id, ownerId, grant);
    assert.equal(value.requestId, stored.lastRequestId);
    assert.equal(value.harness.tasks[0].status, "running");
    assert.equal(JSON.stringify(value).includes("must-not-"), false);
    assert.deepEqual(Object.keys(value).sort(), ["harness", "requestId"]);
    await assert.rejects(readStarterRunProgress(stored.id, "another-owner", grant), (error: unknown) => error instanceof HarnessError && error.status === 404);
    await assert.rejects(readStarterRunProgress(stored.id, ownerId, access(["roles"], ["roles:read"])), (error: unknown) => error instanceof HarnessError && error.status === 403);
    stored.buildId = "old-build";
    await assert.rejects(readStarterRunProgress(stored.id, ownerId, grant), (error: unknown) => error instanceof HarnessError && error.status === 409);
  } finally { postgresTaskStore.load = originalLoad; }
});

test("public progress retains recent tool calls through later errors while bounding events without mutation", () => {
  const at = "2026-09-30T00:00:00.000Z";
  const obsolete = Array.from({ length: 5 }, (_, index) => ({ kind: "message", label: `旧记录 ${index}`, at }));
  const recent = [
    { kind: "tool", label: "查询模型", at },
    { kind: "tool", label: "查询角色", at },
    { kind: "tool", label: "整理交互内容", at },
    ...Array.from({ length: 25 }, (_, index) => ({ kind: index % 2 ? "message" : "tool-error", label: `后续处理 ${index}`, at })),
    { kind: "verified", label: "已核实页面保存回执", at },
    { kind: "completed", label: "本轮处理完成", at },
  ];
  const state = run({ status: "completed", events: [...obsolete, ...recent] });
  const before = jsonValue(state);
  const exposed = publicHarness(state);
  assert.equal(exposed.events.length, 30);
  assert.deepEqual(exposed.events, recent);
  assert.deepEqual(exposed.events.filter(event => event.kind === "tool").map(event => event.label), ["查询模型", "查询角色", "整理交互内容"]);
  assert.deepEqual(state, before, "reading public progress must not truncate or rewrite persisted events");
  exposed.events.pop();
  assert.deepEqual(state, before, "the returned event array must not alias the stored array");
});

test("Starter adapter grants tools and knowledge from current permissions across modules", async () => {
  const ports = createStarterPorts({ userId: ownerId, access: access(["roles", "models"], ["roles:read", "models:read"]), model });
  const capabilities = await ports.capabilities.list();
  assert(capabilities.some(cap => cap.name === "roles_list"));
  assert(capabilities.some(cap => cap.name === "models_open" && cap.effect === "page"));
  assert(!capabilities.some(cap => cap.name.startsWith("accounts_")));
  await assert.rejects(ports.capabilities.invoke("accounts_create", {}, run()), ToolInputError);
  const context = await ports.context.resolve("角色和模型下一步怎么做", capabilities);
  assert(context.includes('"id":"roles.overview"'));
  assert(context.includes('"id":"models.overview"'));
  assert(!context.includes('"id":"accounts.create"'));
});

test("Starter adapter routes role reads through registered tools with owned execution context", async () => {
  const tool = agentToolById("roles.list");
  assert(tool?.mode === "read");
  const original = tool.run;
  let called = 0;
  tool.run = async (_input, context) => {
    called += 1;
    assert.equal(context.userId, ownerId);
    return { summary: "真实角色读取结果", blocks: [{ type: "table", title: "角色", columns: [{ key: "name", label: "角色" }], rows: [{ id: "role-a", name: "审计" }] }] };
  };
  try {
    const ports = createStarterPorts({ userId: ownerId, access: access(["roles"], ["roles:read"]), model });
    const result = await ports.capabilities.invoke("roles_list", {}, run());
    assert.equal(called, 1);
    assert.deepEqual(JSON.parse(result.summary), { resource: "roles", facts: "真实角色读取结果", records: [{ id: "role-a", name: "审计" }] });
    await assert.rejects(ports.capabilities.invoke("roles_list", { unknown: "field" }, run()), ToolInputError);
    assert.equal(called, 1);
  } finally { tool.run = original; }
});

test("Starter model adapter sends actual tool definitions and repairs bare tool names once", async () => {
  const original = globalThis.fetch;
  const sent: Array<Record<string, unknown>> = [];
  globalThis.fetch = async (url, init) => {
    assert.equal(String(url), "https://model.example.test/v1/chat/completions");
    const body = JSON.parse(String(init?.body));
    sent.push(body);
    return Response.json({ choices: [{ message: sent.length === 1
      ? { content: "(models_navigate)" }
      : { content: null, tool_calls: [{ id: "navigate", type: "function", function: { name: "models_navigate", arguments: "{}" } }] } }] });
  };
  try {
    const ports = createStarterPorts({ userId: ownerId, access: access(["models"], ["models:read"]), model });
    const result = await ports.model.next([{ role: "user", content: "打开模型服务" }], await ports.capabilities.list());
    assert.equal(sent.length, 2);
    assert.equal(sent[1].tool_choice, "required");
    assert.equal(result.toolCalls[0].name, "models_navigate");
    assert(JSON.stringify(sent[0].tools).includes("models_list"));
    assert(!JSON.stringify(sent[0].tools).includes("accounts_create"));
  } finally { globalThis.fetch = original; }
});

test("Starter navigation produces an unacknowledged page command without claiming success", async () => {
  const ports = createStarterPorts({ userId: ownerId, access: access(["models"], ["models:read"]), model });
  const result = await ports.capabilities.invoke("models_navigate", {}, run({ goal: "打开模型服务" }));
  assert.equal(result.stop, true);
  assert.equal((result.data?.navigation as { href: string }).href, "/models/");
  assert.match(result.summary, /等待客户端确认/);
  assert.doesNotMatch(result.summary, /已打开|已跳转/);
});

test("Starter accepts a direct clarification without forcing a respond tool or protocol retry", async () => {
  const original = globalThis.fetch;
  const sent: Array<{ tool_choice?: string; tools?: Array<{ function: { name: string } }>; messages: Array<{ role: string; content: string }> }> = [];
  globalThis.fetch = async (_url, init) => {
    sent.push(JSON.parse(String(init?.body)));
    return Response.json({ choices: [{ message: { content: "请告诉我想查看哪个账号。" } }] });
  };
  try {
    const ports = createStarterPorts({ userId: ownerId, access: access(["accounts"], ["accounts:read"]), model });
    ports.store = new MemoryStore();
    const result = await advanceRun({ ownerId, applicationId, buildId, requestId: crypto.randomUUID(), question: "看看账号" }, ports);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].tool_choice, "auto");
    assert.match(sent[0].messages.at(-1)!.content, /本轮尚未查询任何实时业务数据/);
    assert.match(sent[0].messages.at(-1)!.content, /不得沿用历史数字或示例/);
    assert.equal(sent[0].tools?.some(tool => tool.function.name === "respond"), false);
    assert.equal(result.status, "completed");
    assert.equal(result.output.text, "请告诉我想查看哪个账号。");
    assert.equal(result.pending, undefined);
  } finally { globalThis.fetch = original; }
});

test("Starter never treats a choice from a completed earlier goal as the new target", async () => {
  const id = "10000000-0000-4000-8000-000000000001";
  const tool = agentToolById("accounts.get");
  assert(tool?.mode === "read");
  const original = tool.run;
  let called = 0;
  tool.run = async () => { called += 1; return { summary: "旧目标不应被读取" }; };
  try {
    const ports = createStarterPorts({ userId: ownerId, access: access(["accounts"], ["accounts:read"]), model });
    const state = run({ goal: "改为找另外一个账号", messages: [
      { role: "user", content: "查看一个账号" },
      { role: "assistant", content: "", toolCalls: [{ id: "old-choice", name: "ask_user", arguments: "{}" }] },
      { role: "tool", toolCallId: "old-choice", content: JSON.stringify({ choice: { id, label: "旧目标" } }) },
      { role: "assistant", content: "已完成查看" },
      { role: "user", content: "改为找另外一个账号" },
    ] });
    let safelyStopped = false;
    try {
      const output = await ports.capabilities.invoke("accounts_get", { id }, state);
      safelyStopped = Boolean(output.wait);
    } catch (error) { if (error instanceof ToolInputError) safelyStopped = true; else throw error; }
    assert.equal(called, 0, "历史选择不能绕过当前目标确认");
    assert.equal(safelyStopped, true);
  } finally { tool.run = original; }
});

const selectionCandidates = [
  { id: "10000000-0000-4000-8000-000000000001", name: "语义测试甲", username: "semantic_alpha" },
  { id: "10000000-0000-4000-8000-000000000002", name: "语义测试乙", username: "semantic_beta" },
];

function selectionState(records: Array<Record<string, string>>, replies: unknown[]) {
  return run({ goal: "打开一个账号详情，让我选择哪一个，也允许输入指定账号", messages: [
    { role: "user", content: "打开一个账号详情，让我选择哪一个，也允许输入指定账号" },
    { role: "assistant", content: "", toolCalls: [{ id: "list-current", name: "accounts_list", arguments: "{}" }] },
    { role: "tool", toolCallId: "list-current", content: JSON.stringify({ resource: "accounts", records }) },
    ...replies.map((reply, index) => ({ role: "tool" as const, toolCallId: `choice-${index}`, content: JSON.stringify(reply) })),
  ] });
}

test("Starter accepts an exact unique specified ID, name or username in real current candidates", async () => {
  const tool = agentToolById("accounts.get");
  assert(tool?.mode === "read");
  const original = tool.run;
  const called: string[] = [];
  tool.run = async input => {
    called.push((input as { id: string }).id);
    return { summary: "读取已指定账号" };
  };
  try {
    const ports = createStarterPorts({ userId: ownerId, access: access(["accounts"], ["accounts:read"]), model });
    const row = selectionCandidates[0];
    for (const specified of [row.id, row.name, row.username, ` ${row.name} `]) {
      const state = selectionState(selectionCandidates, [{ choice: null, specified }]);
      const facts = state.messages.find(m => m.role === "tool" && m.toolCallId === "list-current")!;
      facts.content = JSON.stringify({ sourceToolCallId: "list-current", summary: facts.content, data: {} });
      const result = await ports.capabilities.invoke("accounts_get", { id: row.id }, state);
      assert.equal(result.wait, undefined, specified);
    }
    assert.deepEqual(called, [row.id, row.id, row.id, row.id]);
  } finally { tool.run = original; }
});

test("Starter refuses ambiguous or partial specified names in real current candidates", async () => {
  const tool = agentToolById("accounts.get");
  assert(tool?.mode === "read");
  const original = tool.run;
  let called = 0;
  tool.run = async () => { called += 1; return { summary: "不应读取未确认目标" }; };
  try {
    const ports = createStarterPorts({ userId: ownerId, access: access(["accounts"], ["accounts:read"]), model });
    const duplicate = selectionCandidates.map(row => ({ ...row, name: "同名账号" }));
    for (const [records, specified] of [[duplicate, "同名账号"], [selectionCandidates, "语义测试"], [selectionCandidates, "不存在的账号"]] as const) {
      const result = await ports.capabilities.invoke("accounts_get", { id: records[0].id }, selectionState([...records], [{ choice: null, specified }]));
      assert.equal(result.wait?.kind, "question");
      assert.equal(result.wait?.options.length, 2);
    }
    assert.equal(called, 0);
  } finally { tool.run = original; }
});

test("Starter uses only the latest structured selection reply", async () => {
  const tool = agentToolById("accounts.get");
  assert(tool?.mode === "read");
  const original = tool.run;
  const called: string[] = [];
  tool.run = async input => { called.push((input as { id: string }).id); return { summary: "读取最新确认目标" }; };
  try {
    const ports = createStarterPorts({ userId: ownerId, access: access(["accounts"], ["accounts:read"]), model });
    const [a, b] = selectionCandidates;
    const replies = [
      [{ choice: { id: a.id }, specified: null }, { choice: null, specified: b.name }],
      [{ choice: null, specified: a.username }, { choice: { id: b.id }, specified: null }],
    ];
    for (const history of replies) {
      const state = selectionState(selectionCandidates, history);
      assert.equal((await ports.capabilities.invoke("accounts_get", { id: a.id }, state)).wait?.kind, "question");
      assert.equal((await ports.capabilities.invoke("accounts_get", { id: b.id }, state)).wait, undefined);
    }
    const unmatched = selectionState(selectionCandidates, [{ choice: { id: a.id }, specified: null }, { choice: null, specified: "没有匹配的最新输入" }]);
    assert.equal((await ports.capabilities.invoke("accounts_get", { id: a.id }, unmatched)).wait?.kind, "question");
    assert.deepEqual(called, [b.id, b.id]);
  } finally { tool.run = original; }
});

test("a failed tool invocation does not leave dangling calls in the retry model request", async () => {
  const ports = createStarterPorts({ userId: ownerId, access: access(["roles"], ["roles:read"]), model });
  const store = new MemoryStore();
  ports.store = store;
  ports.operations.retire = async () => undefined;
  const abort = new AbortController();
  let turn = 0;
  let retryMessages: Message[] = [];
  ports.model.next = async (messages) => {
    turn += 1;
    if (turn === 1) return { content: "", toolCalls: [{ id: "interrupted-read", name: "roles_list", arguments: "{}" }] };
    retryMessages = jsonValue(messages);
    return { content: "可以继续查询", toolCalls: [] };
  };
  ports.capabilities.invoke = async () => {
    abort.abort();
    throw new Error("request interrupted");
  };
  const failed = await advanceRun({ ownerId, applicationId, buildId, requestId: crypto.randomUUID(), question: "查看角色", signal: abort.signal }, ports);
  assert.equal(failed.status, "failed");
  const retry = await advanceRun({ ownerId, applicationId, buildId, requestId: crypto.randomUUID(), runId: failed.id, expectedRevision: failed.revision, question: "再试一次" }, ports);
  assert.equal(retry.status, "completed");
  const unanswered = new Set<string>();
  for (const message of retryMessages) {
    if (message.role === "assistant") for (const call of message.toolCalls ?? []) unanswered.add(call.id);
    if (message.role === "tool") unanswered.delete(message.toolCallId);
  }
  assert.equal(unanswered.size, 0, "重试不得将缺少工具结果的消息历史发送给模型");
  await assert.rejects(advanceRun({ ownerId: "other-user", applicationId, buildId, runId: retry.id, requestId: crypto.randomUUID(), expectedRevision: retry.revision, question: "继续" }, ports), HarnessError);
});

const isolatedDatabase = (() => {
  try { const url = new URL(process.env.DATABASE_URL ?? ""); return url.hostname === "127.0.0.1" && url.pathname.startsWith("/forge_semantic_test_"); }
  catch { return false; }
})();

test("Starter resumes an owned real page save and exports without repeating the creation", { skip: !isolatedDatabase }, async () => {
  const { eq } = await import("drizzle-orm");
  const { getDb, closeDb } = await import("../../lib/db");
  const { adminAccounts, harnessRuns, semanticOperations } = await import("../../lib/db/schema");
  const { executeConfirmedIntent } = await import("../../lib/agent/confirm");
  const { signAgentIntent } = await import("../../lib/agent/intent");
  const { commitOperation } = await import("../../lib/semantic/operations");
  const { createAdminAccount } = await import("../../lib/accounts/service");
  const previousFetch = globalThis.fetch, previousSemantic = process.env.SEMANTIC_ENABLED;
  const requestId = crypto.randomUUID();
  const suffix = requestId.replaceAll("-", "").slice(0, 12);
  const values = { name: "Harness 续办测试", username: `resume_${suffix}`, email: `${suffix}@example.test`, phone: "test-phone", role: "运营" as const, department: "测试", status: "active" as const, notes: "isolated adapter test" };
  let turn = 0, runId: string | undefined, accountId: string | undefined;
  const grant = access(["accounts"], ["accounts:read", "accounts:create"]);
  const signal = new AbortController().signal;
  process.env.SEMANTIC_ENABLED = "true";
  globalThis.fetch = async (_url, init) => {
    const request = JSON.parse(String(init?.body));
    turn += 1;
    if (turn === 1) return Response.json({ choices: [{ message: { content: null, tool_calls: [{ id: "create-once", type: "function", function: { name: "accounts_create", arguments: JSON.stringify({ username: values.username }) } }] } }] });
    if (turn === 2) {
      assert(request.messages.some((message: { role: string; content?: string }) => message.role === "tool" && message.content?.includes("保存已由服务器核实") && message.content.includes(values.username)));
      return Response.json({ choices: [{ message: { content: null, tool_calls: [{ id: "export-after-save", type: "function", function: { name: "accounts_export", arguments: JSON.stringify({ query: values.username }) } }] } }] });
    }
    assert.equal(turn, 3, "续办只应查询导出一次");
    return Response.json({ choices: [{ message: { tool_calls: [{ id: "finished", type: "function", function: { name: "respond", arguments: JSON.stringify({ outcome: "answer", text: "保存已核实，CSV 已生成。", options: [], allowText: false }) } }] } }] });
  };
  try {
    const first = await answerWithHarness({ harness: { requestId }, question: `新建账号 ${values.username} 后导出这个账号`, model, userId: ownerId, access: grant, signal });
    runId = first.harness.id;
    assert.equal(first.harness.status, "waiting-external");
    const binding = { runId, requestId };
    const confirmed = await executeConfirmedIntent(await signAgentIntent(ownerId, "accounts.create", values, { harness: binding }), ownerId, grant);
    assert.equal(confirmed.fill?.operationId, requestId);
    await commitOperation({ id: requestId, userId: ownerId, actionId: "accounts.create", payload: values, confirmed: true }, async tx => {
      const account = await createAdminAccount(values, tx);
      accountId = account.id;
      return { entityId: account.id, revision: account.revision, result: { account } };
    });
    const result = await answerWithHarness({ harness: { requestId: crypto.randomUUID(), runId, expectedRevision: first.harness.revision }, question: "页面保存完成，请继续", continuationOperationId: requestId, model, userId: ownerId, access: grant, signal });
    assert.equal(result.harness.status, "completed");
    assert.equal(turn, 3);
    const blocks = (result as typeof result & { blocks?: Array<{ type: string; href?: string }> }).blocks ?? [];
    assert(blocks.some(block => block.type === "download" && block.href?.startsWith("/api/ask-ai/export/?token=")));
    const records = await getDb().select().from(adminAccounts).where(eq(adminAccounts.username, values.username));
    assert.equal(records.length, 1);
    assert.equal(records[0].id, accountId);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousSemantic === undefined) delete process.env.SEMANTIC_ENABLED; else process.env.SEMANTIC_ENABLED = previousSemantic;
    if (accountId) await getDb().delete(adminAccounts).where(eq(adminAccounts.id, accountId));
    await getDb().delete(semanticOperations).where(eq(semanticOperations.id, requestId));
    if (runId) await getDb().delete(harnessRuns).where(eq(harnessRuns.id, runId));
    await closeDb();
  }
});


test("disabled assistant writes offer a page fallback without exposing configuration", async () => {
  const previous = process.env.SEMANTIC_ENABLED;
  process.env.SEMANTIC_ENABLED = "false";
  try {
    const ports = createStarterPorts({ userId: ownerId, access: access(["accounts"], ["accounts:read", "accounts:create"]), model });
    const result = await ports.capabilities.invoke("accounts_create", {}, run());
    assert.equal(result.stop, true);
    assert.match(result.summary, /暂时无法通过助手办理/);
    assert.doesNotMatch(JSON.stringify(result), /SEMANTIC_ENABLED|操作回执/);
    assert.equal(result.data?.fill, undefined);
    assert.match(JSON.stringify(result.data), /打开账号管理页面/);
  } finally {
    if (previous === undefined) delete process.env.SEMANTIC_ENABLED;
    else process.env.SEMANTIC_ENABLED = previous;
  }
});

test("registered presentation tool assembles a sourced table through the actual adapter", async () => {
  const ports = createStarterPorts({ userId: ownerId, access: access(["dashboard","accounts"], ["dashboard:read","accounts:read"]), model });
  const sourceRun = run({observations:[{toolCallId:"query-a",summary:"one",data:{blocks:[{type:"table",title:"账号",columns:[{key:"name",label:"姓名"}],rows:[{name:"测试员"}]}]}}]});
  const result = await ports.capabilities.invoke("assistant_present",{blocks:[{type:"table",title:"账号",sourceToolCallId:"query-a",columns:[],rows:[]}]},sourceRun,new AbortController().signal);
  assert.equal((result.data?.blocks as Array<{rows:Array<{name:string}>}>)[0].rows[0].name,"测试员");
});


test("Starter repairs an unsupported live count with an actual tool call", async () => {
  const original = globalThis.fetch;
  const choices: string[] = [];
  const streamed: string[] = [];
  globalThis.fetch = async (_url, init) => {
    const request = JSON.parse(String(init?.body));
    choices.push(request.tool_choice);
    if (choices.length === 1) return Response.json({ choices: [{ message: { content: "正在查询账号总数……当前共有 12 条业务账号记录。" } }] });
    return Response.json({ choices: [{ message: { content: null, tool_calls: [{ id: "real-count", type: "function", function: { name: "accounts_list", arguments: "{}" } }] } }] });
  };
  try {
    const ports = createStarterPorts({ userId: ownerId, access: access(["accounts"], ["accounts:read"]), model, onText: text => streamed.push(text) });
    const turn = await ports.model.next([{ role: "user", content: "账号有多少条？" }], await ports.capabilities.list(), new AbortController().signal);
    assert.deepEqual(choices, ["auto", "required"]);
    assert.equal(turn.toolCalls[0].name, "accounts_list");
    assert.equal(turn.content, "");
    assert.equal(streamed.some(text => text.includes("12 条")), false);
  } finally { globalThis.fetch = original; }
});
