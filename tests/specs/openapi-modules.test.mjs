import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import { loadSpec, pageRoles, planModules, renderFiles } from "../../scripts/openapi-modules.mjs";

const root = resolve(import.meta.dirname, "../..");
const spec = await loadSpec(resolve(root, "tests/fixtures/openapi-shop.yaml"));
const plan = planModules(spec, root);
const orders = plan.modules.find(module => module.id === "orders");
const customers = plan.modules.find(module => module.id === "customers");

test("collections with GET become modules; nested, existing and shapeless paths are skipped with reasons", () => {
  assert.deepEqual(plan.modules.map(module => module.id), ["orders", "customers"]);
  assert.deepEqual(plan.skipped.map(item => item.path), ["/orders/{orderId}/lines", "/accounts", "/health"]);
  assert.ok(plan.skipped.every(item => item.reason));
  assert.equal(plan.server, "http://127.0.0.1:4010/v1");
});

test("fields come from $ref and allOf, envelopes are unwrapped, labels prefer Chinese", () => {
  assert.equal(orders.label, "订单");
  assert.equal(customers.label, "客户");
  assert.equal(orders.envelope, "items");
  assert.equal(orders.itemPath, "/orders/{orderId}");
  assert.equal(orders.itemEnvelope, "data");
  assert.equal(customers.envelope, null);
  assert.deepEqual(orders.fields.map(field => field.name), ["id", "createdAt", "status", "amount", "customer", "apiToken"]);
  assert.deepEqual(orders.pagination, ["page", "pageSize"]);
  assert.deepEqual(orders.writes, ["create", "update", "delete"]);
  assert.match(pageRoles(orders).join(), /详情弹窗.*表单弹窗/);
});

test("sensitive fields never reach types, API responses or Ask AI", () => {
  const files = renderFiles(plan);
  assert.deepEqual(orders.hiddenFields, ["apiToken"]);
  assert.ok(!JSON.parse(files["config/modules/orders.json"]).read.fields.includes("apiToken"));
  assert.doesNotMatch(files["lib/orders/types.ts"], /apiToken\??:/);
  assert.match(files["lib/orders/service.ts"], /HIDDEN_FIELDS = new Set\(\["apiToken"\]\)/);
  assert.match(files["lib/orders/service.ts"], /rows\.map\(visible\)/);
  assert.doesNotMatch(files["lib/customers/service.ts"], /HIDDEN_FIELDS/);
});

test("generated modules are read-only and typed from the schema", () => {
  const files = renderFiles(plan);
  assert.deepEqual(Object.keys(files).filter(path => path.startsWith("app/api/")).sort(), ["app/api/customers/route.ts", "app/api/orders/[id]/route.ts", "app/api/orders/route.ts"]);
  assert.doesNotMatch(Object.values(files).join("\n"), /export async function (POST|PATCH|PUT|DELETE)/);
  assert.match(files["lib/orders/types.ts"], /status: "pending" \| "paid" \| "shipped";/);
  assert.match(files["lib/customers/types.ts"], /level\?: "vip" \| "normal" \| null;/);
  assert.match(files["lib/customers/types.ts"], /tags\?: string\[\];/);
  const manifest = JSON.parse(files["config/modules/orders.json"]);
  assert.deepEqual(manifest.entries, { create: false, detail: false, edit: false });
  assert.match(manifest.knowledge.rules, /第一页/);
});
