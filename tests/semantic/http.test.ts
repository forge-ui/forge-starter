import { test, after } from "node:test";
import assert from "node:assert/strict";
import { signAgentIntent } from "../../lib/agent/intent";
import { APPLICATION_BUILD_ID, CONTRACT_VERSION } from "../../lib/semantic/contracts";
import { getDb, closeDb } from "../../lib/db";
import { adminAccounts, semanticOperations } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
const base = process.env.SEMANTIC_HTTP_ORIGIN;
const enabled = Boolean(base && /^http:\/\/127\.0\.0\.1:316[78]$/.test(base) && process.env.DATABASE_URL?.includes("/forge_semantic_test_"));
const rows: string[] = [], ops: string[] = [];
after(async () => { if (!enabled) return; for (const id of rows) await getDb().delete(adminAccounts).where(eq(adminAccounts.id, id)); for (const id of ops) await getDb().delete(semanticOperations).where(eq(semanticOperations.id, id)); await closeDb(); });
async function login(name = "semantic_http") { const r = await fetch(`${base}/api/auth/login/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ login: name, password: "test-only" }) }); assert.equal(r.status, 200); return r.headers.get("set-cookie")!.split(";")[0]; }
async function req(path: string, cookie: string, method = "GET", body?: unknown, extra = {}) { const r = await fetch(`${base}${path}`, { method, headers: { Cookie: cookie, "Content-Type": "application/json", ...extra }, body: body === undefined ? undefined : JSON.stringify(body) }); return { status: r.status, data: await r.json() }; }
const data = () => ({ name: "HTTP 合成账号", username: `h_${crypto.randomUUID().slice(0,8)}`, email: `${crypto.randomUUID()}@example.test`, phone: "123", role: "运营", department: "客服", status: "active", notes: "保留备注" });
test("H01 real HTTP confirmation, draft edit, idempotency, readback, recovery and conflict", { skip: !enabled }, async () => {
 const cookie = await login(); const input = data();
 const page: import("../../lib/semantic/context").PageContext = { version: CONTRACT_VERSION, buildId: (await req("/api/ask-ai/", cookie)).data.buildId, pageId: "accounts.list" as const, instanceId: crypto.randomUUID(), revision: 1, query: {} };
 const intent = await signAgentIntent("demo-user", "accounts.create", input, { page });
 const stale = await req("/api/ask-ai/confirm/", cookie, "POST", { intent, page: { ...page, revision: 2 } }); assert.equal(stale.data.ok, false);
 const confirmed = await req("/api/ask-ai/confirm/", cookie, "POST", { intent, page }); assert.equal(confirmed.status, 200, JSON.stringify(confirmed.data));
 const id = confirmed.data.fill.operationId; ops.push(id); assert(id);
 const final = { ...input, name: "用户最终改值" };
 const save = await req("/api/accounts/", cookie, "POST", final, { "x-operation-id": id }); if (save.data.account?.id) rows.push(save.data.account.id); assert.equal(save.status, 201, JSON.stringify(save.data)); rows.push(save.data.account.id);
 assert.equal(save.data.receipt.status, "verified"); assert.equal(save.data.account.name, final.name);
 const replay = await req("/api/accounts/", cookie, "POST", final, { "x-operation-id": id }); assert.equal(replay.data.account.id, save.data.account.id);
 assert.equal((await req("/api/accounts/", cookie, "POST", input, { "x-operation-id": id })).status, 409);
 const recovered = await req(`/api/ask-ai/operations/${id}/`, cookie); assert.equal(recovered.data.operation.state, "verified");
 const continued = await req("/api/ask-ai/", cookie, "POST", { question: "已保存，请核对最终姓名和状态", continuationOperationId: id, page });
 assert.equal(continued.status, 200, JSON.stringify(continued.data));
 assert.ok(continued.data.blocks.some((block: { type: string; rows?: Array<{ name: string }> }) => block.type === "table" && block.rows?.some(row => row.name === final.name)));
 const key = crypto.randomUUID(); ops.push(key);
 const patch = await req(`/api/accounts/${save.data.account.id}/`, cookie, "PATCH", { ...final, status: "disabled" }, { "if-match": "1", "idempotency-key": key }); assert.equal(patch.status, 200); assert.equal(patch.data.account.revision, 2);
 const staleKey = crypto.randomUUID(); ops.push(staleKey);
 assert.equal((await req(`/api/accounts/${save.data.account.id}/`, cookie, "PATCH", final, { "if-match": "1", "idempotency-key": staleKey })).status, 409);
 assert.equal((await req(`/api/accounts/${save.data.account.id}/`, cookie, "PATCH", final)).status, 428);
});
test("H02 HTTP permissions and unregistered actions fail closed", { skip: !enabled }, async () => {
 const readonly = await login("readonly"), input = data();
 assert.equal((await req("/api/accounts/", readonly, "POST", input, { "idempotency-key": crypto.randomUUID() })).status, 403);
 const intent = await signAgentIntent("demo-user", "accounts.create", input);
 assert.equal((await req("/api/ask-ai/confirm/", readonly, "POST", { intent })).data.ok, false);
 const unknown = await signAgentIntent("demo-user", "unregistered.write", {});
 assert.equal((await req("/api/ask-ai/confirm/", await login(), "POST", { intent: unknown })).data.ok, false);
 assert.equal((await req("/api/accounts/", "")).status, 401);
});

test("H03 chat form validates permissions and fields before issuing a page-only intent", {skip: !enabled}, async()=>{
 const input=data(), cookie=await login(), readonly=await login("readonly");
 const body={formId:"accounts.create",values:input};
 assert.equal((await req("/api/ask-ai/forms/","", "POST",body)).status,401);
 assert.equal((await req("/api/ask-ai/forms/",readonly,"POST",body)).status,403);
 assert.equal((await req("/api/ask-ai/forms/",cookie,"POST",{...body,values:{username:"abc"}})).status,400);
 assert.equal((await req("/api/ask-ai/forms/",cookie,"POST",{...body,formId:"accounts.delete"})).status,400);
 const proposed=await req("/api/ask-ai/forms/",cookie,"POST",body);
 assert.equal(proposed.status,200);
 const accounts=await req("/api/accounts/",cookie); assert.ok(!JSON.stringify(accounts.data).includes(input.username));
 const confirmed=await req("/api/ask-ai/confirm/",cookie,"POST",{intent:proposed.data.intent});
 assert.equal(confirmed.status,200);assert.equal(confirmed.data.fill.fields.username,input.username);assert.equal(confirmed.data.fill.mode,"create");
 ops.push(confirmed.data.fill.operationId);
});
