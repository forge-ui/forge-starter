import { test } from "node:test";
import assert from "node:assert/strict";
import { accountCreateSchema, accountFilterSchema, accountUpdateToolSchema } from "../../lib/accounts/input";
import { toolParameters } from "../../lib/semantic/schema";
import { pageContextSchema, sameContext, contextForPermissions } from "../../lib/semantic/context";
import { APPLICATION_BUILD_ID, CONTRACT_VERSION, publicApplication, moduleForPage } from "../../lib/semantic/contracts";
import { matchesAccount } from "../../lib/accounts/filter";
import { bindPageArguments, needsRecordSelection } from "../../lib/semantic/bind";
import { canonical } from "../../lib/semantic/operations";
import type { AdminAccount } from "../../lib/accounts/types";
const valid = { name: "测试", username: " TEST_USER ", email: "USER@EXAMPLE.COM", phone: "123", role: "运营", department: "平台", status: "active", notes: "" };
const page = () => pageContextSchema.parse({ version: CONTRACT_VERSION, buildId: APPLICATION_BUILD_ID, instanceId: crypto.randomUUID(), pageId: "accounts.list", revision: 1, query: { status: "disabled", query: "客服" } });

test("C01 JSON schema is generated from input rules", () => {
  const schema = toolParameters(accountCreateSchema) as { properties: Record<string, { pattern?: string }> };
  assert.equal(schema.properties.username.pattern, "^[a-z0-9_]{3,32}$");
});
for (const username of ["ab", "a".repeat(33), "bad-name", "中文名"]) test(`C02 rejects username ${username}`, () => assert.equal(accountCreateSchema.safeParse({ ...valid, username }).success, false));
test("C02 normalization stays shared", () => { const data = accountCreateSchema.parse(valid); assert.equal(data.username, "test_user"); assert.equal(data.email, "user@example.com"); });
test("C02 unknown fields and role rejected", () => { assert.equal(accountCreateSchema.safeParse({ ...valid, role: "root" }).success, false); assert.equal(accountCreateSchema.safeParse({ ...valid, apiKey: "secret" }).success, false); });
test("P02 page filter is bound exactly, pagination absent", () => assert.deepEqual(bindPageArguments("accounts.export", { scope: "page", status: "active" }, page()), { status: "disabled", query: "客服" }));
test("P03 missing scope context never becomes all rows", () => assert.throws(() => bindPageArguments("accounts.export", { scope: "page" }), /上下文/));
test("P03 wrong module scope rejected", () => assert.throws(() => bindPageArguments("models.list", { scope: "page" }, page())));
test("P04 changed revision and page instance rejected", () => { const p = page(); assert(sameContext(p, p)); assert(!sameContext(p, { ...p, revision: 2 })); assert(!sameContext(p, { ...p, instanceId: crypto.randomUUID() })); });
test("S01 unauthorized context is removed", () => assert.equal(contextForPermissions(page(), ["models"]), undefined));
test("S03 secret and arbitrary fields forbidden", () => assert.equal(pageContextSchema.safeParse({ ...page(), apiKey: "secret" }).success, false));
test("S03 public projection omits sources and credentials", () => { const data = JSON.stringify(publicApplication); assert(!data.includes("sources")); assert(!data.includes("apiKey")); });
test("R03 protocol mismatch rejected", () => assert.equal(pageContextSchema.safeParse({ ...page(), version: "old" }).success, false));
test("R02 second module uses same context contract", () => { const p = pageContextSchema.parse({ ...page(), pageId: "models.workspace", query: { provider: "openai" } }); assert.equal(moduleForPage(p.pageId), "models"); assert.deepEqual(bindPageArguments("models.list", { scope: "page" }, p), { provider: "openai" }); });
test("P02 page and export match phone, role, department", () => {
  const row = { ...valid, username: "tester", phone: "123 456", department: "客服" } as AdminAccount;
  for (const query of ["客服", "运营", "123456"]) assert(matchesAccount(row, { query }));
  assert(!matchesAccount(row, { status: "disabled" }));
});
test("D04 canonical request hashes are order independent and valid JSON", () => { assert.equal(canonical({ a: 1, b: 2 }), canonical({ b: 2, a: 1 })); assert.deepEqual(JSON.parse(canonical({ a: [1, 2] })), { a: [1, 2] }); });
test("C01 tool filter schema retains explicit scope", () => assert.equal(accountFilterSchema.parse({ scope: "page" }).scope, "page"));

test("C03 partial update preserves omitted notes and rejects username edits", () => { assert.deepEqual(accountUpdateToolSchema.parse({ id: crypto.randomUUID(), status: "disabled" }).notes, undefined); assert.equal(accountUpdateToolSchema.safeParse({ id: crypto.randomUUID(), username: "other" }).success, false); });
test("P06 page mutation cannot inherit read scope", () => assert.throws(() => bindPageArguments("accounts.filter", { scope: "page", status: "active" }, page())));

test("P03 deictic writes require a selected record", () => { assert(needsRecordSelection("修改这条账号的备注", page())); assert(!needsRecordSelection("修改这条账号的备注", { ...page(), entityId: crypto.randomUUID() })); });
test("R03 stale deployment build is rejected", () => assert.equal(pageContextSchema.safeParse({ ...page(), buildId: "old-deployment" }).success, false));
test("S03 cross-module query fields rejected", () => assert.equal(pageContextSchema.safeParse({ ...page(), query: { provider: "openai" } }).success, false));
test("S03 form values never enter page context", () => assert.equal(pageContextSchema.safeParse({ ...page(), form: { mode: "edit", dirty: true, password: "not-real" } }).success, false));
test("P02 all scope keeps explicit conditions", () => assert.deepEqual(bindPageArguments("accounts.export", { scope: "all", status: "active" }, page()), { scope: "all", status: "active" }));
test("C03 partial update is wire-safe and retains only supplied fields", () => { const id = crypto.randomUUID(); assert.deepEqual(JSON.parse(JSON.stringify(accountUpdateToolSchema.parse({ id, status: "disabled" }))), { id, status: "disabled" }); });
test("M03 provider aliases and page search use identical filters", async () => {
 const { matchesModel } = await import("../../lib/models/filter");
 const row = { name: "测试", provider: "model_openai_provider", providerLabel: "OpenAI", modelName: "gpt-test" } as import("../../lib/models/types").AiModel;
 assert(matchesModel(row, { provider: "openai", query: "gpt-test" })); assert(matchesModel(row, { provider: "OpenAI" })); assert(matchesModel(row, { query: "openai" })); assert(!matchesModel(row, { provider: "anthropic" }));
});
