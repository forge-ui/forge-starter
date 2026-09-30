import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { eq } from "drizzle-orm";
import { getDb, closeDb } from "../../lib/db";
import { adminAccounts, aiModels, harnessRuns, semanticOperations } from "../../lib/db/schema";
import { createSessionToken } from "../../lib/auth/session";
import { SESSION_COOKIE } from "../../lib/auth/config";
import type { AgentBlock, AgentFormFill } from "../../lib/agent/types";
import type { Interaction } from "../../lib/harness/types";
import type { Receipt } from "../../lib/semantic/operations";
import type { AdminAccount } from "../../lib/accounts/types";

const base = process.env.SEMANTIC_HTTP_ORIGIN;
const enabled = (() => {
  try {
    const db = new URL(process.env.DATABASE_URL ?? "");
    return Boolean(base && /^http:\/\/127\.0\.0\.1:316[78]$/.test(base) && db.hostname === "127.0.0.1" && db.pathname.startsWith("/forge_semantic_test_"));
  } catch { return false; }
})();
type Ref = { id: string; revision: number; status: string; pending?: Interaction };
type WireMessage = { role: string; content: string | null; tool_call_id?: string };
type ModelRequest = { model: string; messages: WireMessage[]; tools: Array<{ function: { name: string } }> };
type ModelReply = { content?: string; tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }> };
type ApiData = {
  ok: boolean; error?: string; text?: string; harness?: Ref; blocks?: AgentBlock[]; intent?: string;
  fill?: AgentFormFill; navigation?: { href: string; label: string }; account?: AdminAccount; receipt?: Receipt;
  runs?: Array<Ref & { exchanges: Array<{ id: string; question: string; output: { text: string; data: Record<string, unknown> } }> }>;
};
const modelId = crypto.randomUUID();
const runIds = new Set<string>(), operationIds = new Set<string>(), accountIds = new Set<string>(), accountNames = new Set<string>();
const scripted: Array<(request: ModelRequest) => ModelReply> = [];
const modelRequests: ModelRequest[] = [];
const stubErrors: string[] = [];
let server: Server | undefined;
let cookie = "", otherCookie = "";

function tool(name: string, args: Record<string, unknown>, id = name): ModelReply {
  return { tool_calls: [{ id, type: "function", function: { name, arguments: JSON.stringify(args) } }] };
}
function requestId() { return crypto.randomUUID(); }
function trackRun(id: string) { runIds.add(id); operationIds.add(id); return id; }
function account() {
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 14);
  const username = `http_h_${suffix}`;
  accountNames.add(username);
  return { name: "HTTP Harness 测试", username, email: `${suffix}@example.test`, phone: "123", role: "运营", department: "客服", status: "active", notes: "isolated HTTP test" };
}
async function req(path: string, method = "GET", body?: unknown, session = cookie, extra: Record<string, string> = {}) {
  const response = await fetch(`${base}${path}`, { method, headers: { Cookie: session, "Content-Type": "application/json", ...extra }, body: body === undefined ? undefined : JSON.stringify(body) });
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("ndjson")) {
    const events = (await response.text()).split("\n").filter(line => line.trim()).map(line => JSON.parse(line) as ApiData & { type?: string; status?: number });
    const done = [...events].reverse().find(event => event.type === "done");
    const failure = [...events].reverse().find(event => event.type === "error");
    if (!done && failure) return { status: failure.status ?? response.status, data: { ok: false, error: failure.error } as ApiData };
    const data = { ...(done ?? { ok: false, error: "empty stream" }) };
    delete data.type;
    delete data.status;
    return { status: response.status, data: data as ApiData };
  }
  return { status: response.status, data: await response.json() as ApiData };
}
function ask(body: Record<string, unknown>, session = cookie) {
  return req("/api/ask-ai/", "POST", { modelId, ...body }, session);
}
function next(run: Ref, extra: Record<string, unknown> = {}) {
  return { requestId: requestId(), runId: run.id, expectedRevision: run.revision, ...extra };
}

before(async () => {
  if (!enabled) return;
  server = createServer(async (request, response) => {
    try {
      assert.equal(request.url, "/v1/chat/completions");
      if (request.headers.authorization !== "Bearer harness-test-key") throw new Error("unexpected test model authentication");
      let raw = "";
      for await (const chunk of request) raw += chunk.toString();
      const body = JSON.parse(raw) as ModelRequest;
      assert.equal(body.model, "harness-http-fixture");
      const script = scripted.shift();
      assert.ok(script, "unexpected model invocation");
      modelRequests.push(body);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ choices: [{ message: { role: "assistant", ...script(body) } }] }));
    } catch (error) {
      stubErrors.push(error instanceof Error ? error.message : "stub failed");
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "test stub rejected unexpected input" }));
    }
  });
  await new Promise<void>((resolve, reject) => { server!.once("error", reject); server!.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  await getDb().insert(aiModels).values({ id: modelId, name: `Harness HTTP ${modelId}`, provider: "openai", modelName: "harness-http-fixture", apiBase: `http://127.0.0.1:${address.port}/v1`, apiKey: "harness-test-key", status: "active", isDefault: false });
  const response = await fetch(`${base}/api/auth/login/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ login: "harness_http", password: "test-only" }) });
  assert.equal(response.status, 200);
  cookie = response.headers.get("set-cookie")!.split(";")[0];
  otherCookie = `${SESSION_COOKIE}=${await createSessionToken({ id: `harness-other-${modelId}`, username: "harness_other", email: "other@example.test", displayName: "Other test owner", roleCode: "super_admin" })}`;
});

after(async () => {
  if (!enabled) return;
  try {
    for (const id of accountIds) await getDb().delete(adminAccounts).where(eq(adminAccounts.id, id));
    for (const username of accountNames) await getDb().delete(adminAccounts).where(eq(adminAccounts.username, username));
    for (const id of operationIds) await getDb().delete(semanticOperations).where(eq(semanticOperations.id, id));
    for (const id of runIds) await getDb().delete(harnessRuns).where(eq(harnessRuns.id, id));
    await getDb().delete(aiModels).where(eq(aiModels.id, modelId));
  } finally {
    await closeDb();
    if (server) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
  }
  assert.deepEqual(stubErrors, []);
  assert.equal(scripted.length, 0, "all expected model responses should be consumed");
});

test("HTTP: first request replay, persisted choice recovery, scoped errors and structured reply navigation", { skip: !enabled }, async () => {
  const callsBefore = modelRequests.length;
  scripted.push(body => {
    assert.ok(body.tools.some(entry => entry.function.name === "ask_user"));
    return tool("ask_user", { title: "你想先查看哪个模块？", options: [{ id: "models", label: "模型服务" }, { id: "accounts", label: "业务账号" }], allowText: true }, "choose-module");
  });
  const firstRequest = trackRun(requestId());
  const body = { question: "我想看看系统已有配置", harness: { requestId: firstRequest } };
  const first = await ask(body);
  assert.equal(first.status, 200, JSON.stringify(first.data));
  assert.equal(first.data.harness?.status, "waiting-user");
  const waiting = first.data.harness!;
  assert.equal(waiting.id, firstRequest);
  const replay = await ask(body);
  assert.equal(replay.status, 200);
  assert.deepEqual(replay.data, first.data);
  assert.equal(modelRequests.length, callsBefore + 1);

  const recovered = await req("/api/ask-ai/runs/");
  const saved = recovered.data.runs?.find(run => run.id === waiting.id);
  assert.ok(saved);
  assert.deepEqual(saved.pending, waiting.pending);
  assert.equal(saved.exchanges.at(-1)?.output.text, first.data.text);
  const notVisible = await req("/api/ask-ai/runs/", "GET", undefined, otherCookie);
  assert.equal(notVisible.status, 200);
  assert.equal(notVisible.data.runs?.some(run => run.id === waiting.id), false);

  const reply = { interactionId: waiting.pending!.id, optionId: "models" };
  assert.equal((await ask({ question: "", harness: next(waiting, { reply: { ...reply, optionId: "invalid" } }) })).status, 400);
  assert.equal((await ask({ question: "", harness: next(waiting, { expectedRevision: 0, reply }) })).status, 409);
  assert.equal((await ask({ question: "", harness: next(waiting, { reply }) }, otherCookie)).status, 404);
  assert.equal(modelRequests.length, callsBefore + 1);

  scripted.push(modelBody => {
    const answer = modelBody.messages.find(message => message.role === "tool" && message.tool_call_id === "choose-module");
    assert.ok(answer?.content);
    assert.deepEqual(JSON.parse(answer.content).choice, { id: "models", label: "模型服务" });
    return tool("models_navigate", {});
  });
  const replyBody = { question: "", harness: next(waiting, { reply }) };
  const navigated = await ask(replyBody);
  assert.equal(navigated.status, 200, JSON.stringify(navigated.data));
  assert.equal(navigated.data.harness?.status, "completed");
  assert.match(navigated.data.navigation?.href ?? "", /^\/models\/?$/);
  assert.ok(!navigated.data.blocks?.some(block => block.type === "confirm"));
  assert.deepEqual((await ask(replyBody)).data, navigated.data);
  assert.equal(modelRequests.length, callsBefore + 2);
});

test("HTTP: chat form confirmation is retired by cancel and cannot save with its prior operation", { skip: !enabled }, async () => {
  const data = account(), firstRequest = trackRun(requestId());
  scripted.push(() => tool("accounts_create", { username: data.username }));
  const proposed = await ask({ question: `新建账号 ${data.username}`, harness: { requestId: firstRequest } });
  assert.equal(proposed.status, 200, JSON.stringify(proposed.data));
  assert.equal(proposed.data.harness?.status, "waiting-external");
  const form = proposed.data.blocks?.find(block => block.type === "form");
  assert.ok(form?.type === "form");
  assert.equal(form.values.username, data.username);
  assert.deepEqual(form.harness, { runId: firstRequest, requestId: firstRequest });
  const formBody = { formId: "accounts.create", values: data, harness: form.harness };
  const signed = await req("/api/ask-ai/forms/", "POST", formBody);
  assert.equal(signed.status, 200);
  const confirmed = await req("/api/ask-ai/confirm/", "POST", { intent: signed.data.intent });
  assert.equal(confirmed.status, 200, JSON.stringify(confirmed.data));
  const operationId = confirmed.data.fill!.operationId!;
  operationIds.add(operationId);
  assert.equal(operationId, firstRequest);
  const waiting = proposed.data.harness!;
  const cancelled = await ask({ question: "", harness: next(waiting, { reply: { interactionId: waiting.pending!.id, cancel: true } }) });
  assert.equal(cancelled.status, 200, JSON.stringify(cancelled.data));
  assert.equal(cancelled.data.harness?.status, "cancelled");
  assert.equal(cancelled.data.harness?.pending, undefined);
  assert.equal((await req("/api/ask-ai/forms/", "POST", formBody)).status, 409);
  assert.equal((await req("/api/ask-ai/confirm/", "POST", { intent: signed.data.intent })).status, 400);
  const blocked = await req("/api/accounts/", "POST", data, cookie, { "x-operation-id": operationId });
  assert.ok([400, 409].includes(blocked.status), JSON.stringify(blocked.data));
  assert.equal((await getDb().select().from(adminAccounts).where(eq(adminAccounts.username, data.username))).length, 0);
});

test("HTTP: real page save returns an idempotent receipt and resumes with server readback", { skip: !enabled }, async () => {
  const data = account(), firstRequest = trackRun(requestId());
  scripted.push(() => tool("accounts_create", { username: data.username }));
  const proposed = await ask({ question: `新建账号 ${data.username}，保存后核对`, harness: { requestId: firstRequest } });
  assert.equal(proposed.status, 200, JSON.stringify(proposed.data));
  const form = proposed.data.blocks?.find(block => block.type === "form");
  assert.ok(form?.type === "form");
  const signed = await req("/api/ask-ai/forms/", "POST", { formId: "accounts.create", values: data, harness: form.harness });
  assert.equal(signed.status, 200);
  const confirmed = await req("/api/ask-ai/confirm/", "POST", { intent: signed.data.intent });
  assert.equal(confirmed.status, 200);
  const operationId = confirmed.data.fill!.operationId!;
  operationIds.add(operationId);
  const final = { ...data, name: "用户在页面最终修改的姓名" };
  const saved = await req("/api/accounts/", "POST", final, cookie, { "x-operation-id": operationId });
  if (saved.data.account?.id) accountIds.add(saved.data.account.id);
  assert.equal(saved.status, 201, JSON.stringify(saved.data));
  assert.equal(saved.data.receipt?.status, "verified");
  assert.equal(saved.data.account?.name, final.name);
  const retry = await req("/api/accounts/", "POST", final, cookie, { "x-operation-id": operationId });
  assert.equal(retry.status, 201);
  assert.equal(retry.data.account?.id, saved.data.account!.id);
  assert.equal((await req("/api/accounts/", "POST", data, cookie, { "x-operation-id": operationId })).status, 409);

  scripted.push(modelBody => {
    const readback = modelBody.messages.findLast(message => message.role === "tool");
    assert.ok(readback?.content?.includes("保存已由服务器核实"));
    assert.ok(readback?.content?.includes(final.name));
    assert.ok(readback?.content?.includes(saved.data.account!.id));
    return tool("respond", { outcome: "answer", text: "已核实页面保存的最终账号信息。可以继续查看账号列表。", options: [], allowText: false });
  });
  const continuation = { question: "已保存，请核对最终数据", continuationOperationId: operationId, harness: next(proposed.data.harness!) };
  const continued = await ask(continuation);
  assert.equal(continued.status, 200, JSON.stringify(continued.data));
  assert.equal(continued.data.harness?.status, "completed");
  assert.ok(continued.data.blocks?.some(block => block.type === "table" && block.rows.some(row => row.name === final.name && row.id === saved.data.account!.id)));
  const callsAfter = modelRequests.length;
  const duplicate = await ask(continuation);
  assert.equal(duplicate.status, 200, JSON.stringify(duplicate.data));
  assert.deepEqual(duplicate.data, continued.data);
  assert.equal(modelRequests.length, callsAfter);
});

test("HTTP: cancelling on the page retires the persisted task and restores a cancelled conversation", { skip: !enabled }, async () => {
  const data = account(), firstRequest = trackRun(requestId());
  scripted.push(() => tool("accounts_create", { username: data.username }));
  const proposed = await ask({ question: `准备新账号 ${data.username}`, harness: { requestId: firstRequest } });
  assert.equal(proposed.status, 200);
  const form = proposed.data.blocks?.find(block => block.type === "form");
  assert.ok(form?.type === "form");
  const signed = await req("/api/ask-ai/forms/", "POST", { formId: "accounts.create", values: data, harness: form.harness });
  assert.equal(signed.status, 200);
  const confirmed = await req("/api/ask-ai/confirm/", "POST", { intent: signed.data.intent });
  assert.equal(confirmed.status, 200);
  const id = confirmed.data.fill!.operationId!;
  operationIds.add(id);
  assert.equal((await req(`/api/ask-ai/operations/${id}/`, "POST", { state: "cancelled" })).status, 200);
  const restored = (await req("/api/ask-ai/runs/")).data.runs?.find(run => run.id === firstRequest);
  assert.equal(restored?.status, "cancelled");
  assert.equal(restored.pending, undefined);
  assert.ok(restored.revision > proposed.data.harness!.revision);
  assert.match(restored.exchanges.at(-1)!.output.text, /页面取消/);
  assert.equal((await req("/api/ask-ai/confirm/", "POST", { intent: signed.data.intent })).status, 400);
});

test("HTTP: real account candidates and a structured selection open the chosen detail without confirmation", { skip: !enabled }, async () => {
  const marker = `HTTP详情-${requestId().slice(0, 8)}`;
  const created: AdminAccount[] = [];
  for (const label of ["甲", "乙"]) {
    const key = requestId();
    operationIds.add(key);
    const saved = await req("/api/accounts/", "POST", { ...account(), name: `${marker}-${label}` }, cookie, { "idempotency-key": key });
    if (saved.data.account?.id) accountIds.add(saved.data.account.id);
    assert.equal(saved.status, 201, JSON.stringify(saved.data));
    created.push(saved.data.account!);
  }
  const selected = created[1];
  const callsBefore = modelRequests.length;
  scripted.push(body => {
    assert.ok(body.tools.some(entry => entry.function.name === "accounts_open"));
    return tool("accounts_list", { query: marker }, "list-real-accounts");
  });
  scripted.push(body => {
    const listed = body.messages.findLast(message => message.role === "tool" && message.tool_call_id === "list-real-accounts");
    assert.ok(listed?.content);
    const facts = JSON.parse(listed.content) as { resource: string; records: Array<{ id: string; name: string }> };
    assert.equal(facts.resource, "accounts");
    assert.deepEqual(facts.records.map(row => row.id).sort(), created.map(row => row.id).sort());
    return tool("respond", { outcome: "question", text: "请选择要打开的账号，也可以指定名称", options: facts.records.map(row => ({ id: row.id, label: row.name })), allowText: true }, "choose-real-account");
  });
  const firstRequest = trackRun(requestId());
  const first = await ask({ question: `查询 ${marker} 的账号，让我选择一个打开详情`, harness: { requestId: firstRequest } });
  assert.equal(first.status, 200, JSON.stringify(first.data));
  assert.equal(first.data.harness?.status, "waiting-user");
  assert.deepEqual(first.data.harness!.pending!.options.map(option => option.id).sort(), created.map(row => row.id).sort());
  scripted.push(body => {
    const answered = body.messages.findLast(message => message.role === "tool" && message.tool_call_id === "choose-real-account");
    assert.ok(answered?.content);
    assert.equal(JSON.parse(answered.content).choice.id, selected.id);
    return tool("accounts_open", { id: selected.id });
  });
  const waiting = first.data.harness!;
  const opened = await ask({ question: "", harness: next(waiting, { reply: { interactionId: waiting.pending!.id, optionId: selected.id } }) });
  assert.equal(opened.status, 200, JSON.stringify(opened.data));
  assert.equal(opened.data.harness?.status, "completed");
  assert.equal(opened.data.navigation?.href, `/accounts/${selected.id}/`);
  assert.equal(opened.data.navigation?.label, `${selected.name}详情`);
  assert.equal(opened.data.fill, undefined);
  assert.ok(!opened.data.blocks?.some(block => block.type === "confirm"));
  assert.match(opened.data.text ?? "", /等待客户端确认/);
  assert.equal(modelRequests.length, callsBefore + 3);
});
