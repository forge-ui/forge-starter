import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { retrieveKnowledge, type KnowledgeEntry, type KnowledgeQuery } from "../../lib/harness/knowledge";
import { getStarterKnowledge, retrieveStarterKnowledge, STARTER_PLATFORM_ID } from "../../lib/harness/starter-knowledge";
import { APPLICATION_BUILD_ID } from "../../lib/semantic/contracts";

const scope = { platformId: "example", buildId: "build-1" };
function entry(id: string, extra: Partial<KnowledgeEntry> = {}): KnowledgeEntry {
  return {
    id, ...scope, title: "查询记录", summary: "从工具查询实际记录", keywords: ["查询", "记录"],
    capabilityIds: ["records.list"], source: { path: "records.ts", version: scope.buildId }, ...extra,
  };
}
function request(extra: Partial<KnowledgeQuery> = {}): KnowledgeQuery {
  return { ...scope, query: "查询记录", allowedCapabilityIds: ["records.list"], ...extra };
}

test("knowledge fails closed for missing or partially allowed capabilities", () => {
  const catalog = [entry("read"), entry("write", { capabilityIds: ["records.update"] }),
    entry("joined", { capabilityIds: ["records.list", "records.update"] }), entry("unscoped", { capabilityIds: [] })];
  assert.deepEqual(retrieveKnowledge(catalog, request()).entries.map((item) => item.id), ["read"]);
  assert.equal(retrieveKnowledge(catalog, request({ allowedCapabilityIds: [] })).entries.length, 0);
});

test("knowledge strips unauthorized follow-up suggestions from both objects and prompt", () => {
  const catalog = [entry("read", { nextSteps: [
    { label: "查看", question: "查看记录", capabilityIds: ["records.list"] },
    { label: "修改", question: "修改秘密记录", capabilityIds: ["records.update"] },
    { label: "未登记", question: "未登记操作", capabilityIds: [] },
  ] })];
  const result = retrieveKnowledge(catalog, request());
  assert.deepEqual(result.entries[0].nextSteps?.map((step) => step.label), ["查看"]);
  assert(!result.context.includes("秘密记录"));
  assert.equal(catalog[0].nextSteps?.length, 3);
});

test("knowledge never crosses platform or build boundaries", () => {
  const catalog = [entry("correct"), entry("other-platform", { platformId: "medical" }), entry("old", { buildId: "build-0" })];
  assert.deepEqual(retrieveKnowledge(catalog, request()).entries.map((item) => item.id), ["correct"]);
  assert.equal(retrieveKnowledge(catalog, request({ buildId: "missing" })).context, "");
});

test("knowledge ranks specific authored keywords over generic context", () => {
  const catalog = [entry("general", { keywords: ["记录"] }), entry("specific", { keywords: ["记录", "导出"] })];
  assert.deepEqual(retrieveKnowledge(catalog, request({ query: "如何导出记录" })).entries.map((item) => item.id), ["specific", "general"]);
  assert.deepEqual(retrieveKnowledge([...catalog].reverse(), request({ query: "如何导出记录" })).entries.map((item) => item.id), ["specific", "general"]);
});

test("knowledge uses stable IDs to resolve ranking ties", () => {
  const catalog = [entry("b"), entry("a")];
  assert.deepEqual(retrieveKnowledge(catalog, request()).entries.map((item) => item.id), ["a", "b"]);
});

test("current capability supplies relevant context without permitting unrelated knowledge", () => {
  const catalog = [entry("current"), entry("other", { capabilityIds: ["other.list"] })];
  assert.deepEqual(retrieveKnowledge(catalog, request({ query: "下一步呢", currentCapabilityIds: ["records.list"] })).entries.map((item) => item.id), ["current"]);
  assert.equal(retrieveKnowledge(catalog, request({ query: "完全无关的问题" })).entries.length, 0);
});

test("knowledge obeys exact context and entry budgets without truncating evidence", () => {
  const catalog = [entry("a"), entry("b"), entry("c")];
  const one = retrieveKnowledge(catalog, request({ maxEntries: 1 }));
  const bounded = retrieveKnowledge(catalog, request({ maxChars: one.usedChars }));
  assert.equal(bounded.entries.length, 1);
  assert.equal(bounded.usedChars, bounded.context.length);
  assert.equal(JSON.parse(bounded.context).source.version, "build-1");
  assert.equal(retrieveKnowledge(catalog, request({ maxChars: one.usedChars - 1 })).entries.length, 0);
  assert.equal(retrieveKnowledge(catalog, request({ maxEntries: 2 })).entries.length, 2);
});

test("oversized records do not starve smaller relevant records", () => {
  const small = entry("small");
  const budget = retrieveKnowledge([small], request()).usedChars;
  const result = retrieveKnowledge([entry("large", { summary: "查询记录".repeat(1000) }), small], request({ maxChars: budget }));
  assert.deepEqual(result.entries.map((item) => item.id), ["small"]);
});

test("invalid and zero retrieval budgets return no context", () => {
  for (const maxChars of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(retrieveKnowledge([entry("a")], request({ maxChars })).context, "");
  }
  assert.equal(retrieveKnowledge([entry("a")], request({ maxEntries: 0 })).context, "");
});

test("knowledge context survives a real JSON round trip", () => {
  const result = retrieveKnowledge(JSON.parse(JSON.stringify([entry("a", { summary: "引号\"和换行\n仍是事实数据" })])), request());
  assert.equal(JSON.parse(result.context).summary, "引号\"和换行\n仍是事实数据");
  assert.deepEqual(JSON.parse(JSON.stringify(result)).entries[0].source, { path: "records.ts", version: "build-1" });
});

test("Starter catalog is deployment bound and rejects stale caller builds", () => {
  const catalog = getStarterKnowledge();
  assert(catalog.every((item) => item.platformId === STARTER_PLATFORM_ID && item.buildId === APPLICATION_BUILD_ID && item.source.version === APPLICATION_BUILD_ID));
  assert.equal(retrieveStarterKnowledge({ query: "账号", allowedCapabilityIds: ["accounts.list"], buildId: "stale-build" }).entries.length, 0);
});

test("Starter read-only knowledge never recommends ungranted account mutations", () => {
  const result = retrieveStarterKnowledge({ query: "账号下一步", allowedCapabilityIds: ["accounts.list"] });
  assert(result.entries.some((item) => item.id === "accounts.overview"));
  assert(!result.entries.some((item) => ["accounts.create", "accounts.update", "accounts.delete"].includes(item.id)));
  assert(!result.context.includes('"label":"新建账号"'));
});

test("Starter knowledge references existing source anchors and registered tool IDs", () => {
  const repo = resolve(import.meta.dirname, "../..");
  const toolFiles = ["lib/accounts/agent.ts", "lib/roles/agent.ts", "lib/permissions/agent.ts", "lib/menus/agent.ts", "lib/models/agent.ts", "lib/semantic/page-tools.ts"];
  const toolIds = new Set(toolFiles.flatMap((file) => [...readFileSync(resolve(repo, file), "utf8").matchAll(/id:\s*"([\w.]+)"/g)].map((match) => match[1])));
  for (const module of ["accounts", "roles", "permissions", "menus", "models"]) toolIds.add(`${module}.navigate`);
  for (const item of getStarterKnowledge()) {
    for (const id of [...item.capabilityIds, ...(item.nextSteps ?? []).flatMap((step) => step.capabilityIds)]) assert(toolIds.has(id), `unregistered tool: ${id}`);
    for (const source of [item.source, ...(item.relatedSources ?? [])]) {
      const path = resolve(repo, source.path);
      assert(existsSync(path), `missing source: ${source.path}`);
      if (source.symbol) assert(readFileSync(path, "utf8").includes(source.symbol), `missing source symbol: ${source.symbol}`);
    }
  }
});
