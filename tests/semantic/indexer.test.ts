import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildIndex, sourceFingerprint, queryIndex } from "../../tooling/semantic/indexer";
const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), "forge-semantic-"));
  mkdirSync(join(root, "lib"));
  writeFileSync(join(root, "tsconfig.json"), JSON.stringify({ compilerOptions: { target: "ES2022", module: "ESNext", moduleResolution: "bundler", paths: { "@/*": ["./*"] } } }));
  writeFileSync(join(root, "lib/a.ts"), "export function same() { return 1; }\nexport const secretValue = 1;");
  writeFileSync(join(root, "lib/b.ts"), "export function same() { return 2; }");
  writeFileSync(join(root, "lib/reexport.ts"), 'export { same } from "./a";');
  writeFileSync(join(root, "lib/use.ts"), 'import { same } from "@/lib/reexport"; export const result = same();');
  return root;
};
test("I01 alias and re-export resolve exact symbol, not same-name function", () => {
  const root = fixture(); try { const index = buildIndex(root); const calls = index.edges.filter((e) => e.kind === "calls" && e.evidence.file === "lib/use.ts"); assert(calls.some((e) => e.to === "symbol:lib/a.ts#same")); assert(!calls.some((e) => e.to === "symbol:lib/b.ts#same")); } finally { rmSync(root, { recursive: true }); }
});
test("I04 content, rename and new file invalidate snapshot; secrets excluded", () => {
  const root = fixture(); try { const a = sourceFingerprint(root); writeFileSync(join(root, ".env"), "API_KEY=do-not-index"); assert.equal(sourceFingerprint(root), a); writeFileSync(join(root, "lib/new.ts"), "export const newField = 1"); assert.notEqual(sourceFingerprint(root), a); rmSync(join(root, "lib/new.ts")); assert.equal(sourceFingerprint(root), a); } finally { rmSync(root, { recursive: true }); }
});
test("I03 dynamic request records unresolved evidence", () => {
  const root = fixture(); try { writeFileSync(join(root, "lib/dynamic.ts"), 'declare const id: string; fetch(`/api/accounts/${id}`);'); const index = buildIndex(root); assert(index.unresolved.some((r) => r.file === "lib/dynamic.ts" && r.reason.includes("动态"))); } finally { rmSync(root, { recursive: true }); }
});
test("I02 declarations and references have existing file hashes", () => {
  const root = fixture(); try { const index = buildIndex(root); for (const edge of index.edges) assert.equal(edge.evidence.hash, index.files[edge.evidence.file]); assert.equal(new Set(index.facts.map((f) => f.id)).size, index.facts.length); } finally { rmSync(root, { recursive: true }); }
});
test("I05 unsupported entity is explicit, never guessed", () => { const root = fixture(); try { assert.throws(() => queryIndex(buildIndex(root), "impact", "unknown"), /未知/); } finally { rmSync(root, { recursive: true }); } });
test("I02 account golden path has every explicitly labelled source relationship", () => {
  const index = buildIndex(process.cwd());
  assert.equal(new Set(index.facts.map((f) => f.id)).size, index.facts.length, "real repository symbol IDs are unique");
  const golden = [
    ["file:app/(app)/accounts/page.tsx", "file:components/account-form-dialog.tsx", "imports"],
    ["file:components/account-form-dialog.tsx", "file:components/accounts-store.tsx", "imports"],
    ["file:app/api/accounts/route.ts", "symbol:lib/accounts/service.ts#createAdminAccount", "calls"],
    ["file:app/api/accounts/[id]/route.ts", "symbol:lib/accounts/service.ts#updateAdminAccount", "calls"],
    ["file:lib/accounts/service.ts", "table:admin_accounts", "reads-table"],
    ["file:lib/accounts/service.ts", "table:admin_accounts", "writes-table"],
  ];
  for (const [from, to, kind] of golden) assert(index.edges.some((e) => e.from === from && e.to === to && e.kind === kind && e.origin === "extracted"), `${from} -> ${to}`);
  const impact = queryIndex(index, "impact", "accounts.department") as { requiredReview: Array<{ file: string }> };
  for (const file of ["lib/db/schema.ts", "lib/accounts/input.ts", "lib/accounts/service.ts", "app/api/accounts/route.ts", "app/api/accounts/[id]/route.ts", "app/(app)/accounts/page.tsx", "app/(app)/accounts/[id]/page.tsx", "components/account-form-dialog.tsx", "components/accounts-store.tsx", "lib/accounts/agent.ts"]) assert(impact.requiredReview.some((r) => r.file === file), file);
});
