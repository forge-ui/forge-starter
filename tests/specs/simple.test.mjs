import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { KEPT_REFERENCE_PAGES, catalogWithout, planSimpleMode } from "../../scripts/simple.mjs";

const root = resolve(import.meta.dirname, "../..");

test("simple mode keeps the pages skills copy from and every file they import", () => {
  const plan = planSimpleMode(root);
  for (const slug of KEPT_REFERENCE_PAGES) assert.ok(existsSync(resolve(root, "app/(app)/ref", slug, "page.tsx")), slug);
  assert.ok(plan.removedPages.length > 20);
  assert.ok(!plan.removedPages.some(slug => KEPT_REFERENCE_PAGES.includes(slug)));
  const kept = KEPT_REFERENCE_PAGES.map(slug => readFileSync(resolve(root, "app/(app)/ref", slug, "page.tsx"), "utf8")).join("\n") + readFileSync(resolve(root, "app/(app)/ref/page.tsx"), "utf8");
  for (const path of plan.removedFiles) assert.ok(!kept.includes(`"@/${path.replace(/\.tsx?$/, "")}"`), path);
});

test("catalog keeps only the remaining pages and stays valid", () => {
  const plan = planSimpleMode(root);
  const catalog = catalogWithout(readFileSync(resolve(root, "lib/reference/catalog.ts"), "utf8"), plan.removedPages);
  const slugs = [...catalog.matchAll(/slug: "([a-z-]+)"/g)].map(match => match[1]).sort();
  assert.deepEqual(slugs, [...KEPT_REFERENCE_PAGES].sort());
  assert.match(catalog, /export function refPath/);
  assert.doesNotMatch(catalog, /,\s*,/);
});

test("docs point every reference page somewhere after simple mode", () => {
  const docs = readFileSync(resolve(root, "docs/reference-pages.md"), "utf8");
  for (const slug of planSimpleMode(root).removedPages) assert.match(docs, new RegExp("\\| `/ref/" + slug + "` \\|.*(Screen|forgeui\\.org|上游源码)"), slug);
});
