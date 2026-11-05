import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fetchText, OfflineError, run } from "../../scripts/sync-forge-skill.mjs";

const revision = "a".repeat(40);
const contents = { "SKILL.md": "# Forge\n", "references/audit-checklist.md": "# Audit\n" };
const fetcher = async (url) => {
  let value;
  if (url.includes("/commits/")) value = JSON.stringify({ sha: revision });
  else if (url.endsWith("/core/package.json")) value = JSON.stringify({ version: "0.4.7" });
  else if (url.includes("/git/trees/")) value = JSON.stringify({ tree: Object.keys(contents).map((path) => ({ path: `skills/forge-skill/${path}`, type: "blob", mode: "100644" })) });
  else value = contents[url.split("skills/forge-skill/")[1]];
  assert.notEqual(value, undefined, url);
  return new Response(value);
};

async function fixture(context) {
  const root = await mkdtemp(join(tmpdir(), "forge-spec-test-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { "@forge-ui-official/core": "0.4.7" } }));
  return root;
}

test("sync writes a real versioned snapshot and check detects tampering", async (context) => {
  const root = await fixture(context);
  await run({ root, fetcher, log() {} });
  const manifest = JSON.parse(await readFile(join(root, "docs/forge-skill/manifest.json"), "utf8"));
  assert.equal(manifest.revision, revision);
  await run({ root, check: true, fetcher, log() {} });
  await writeFile(join(root, "docs/forge-skill/upstream/SKILL.md"), "tampered");
  await assert.rejects(run({ root, check: true, fetcher, log() {} }), /内容漂移/);
});

test("offline skips remote lookup but never masks local corruption", async (context) => {
  const root = await fixture(context);
  const offline = async () => { throw new Error("offline"); };
  const messages = [];
  await run({ root, check: true, fetcher: offline, log: (message) => messages.push(message) });
  assert.match(messages[0], /SKIP.*本地副本缺失/);
  await run({ root, fetcher, log() {} });
  await writeFile(join(root, "docs/forge-skill/upstream/SKILL.md"), "tampered");
  await assert.rejects(run({ root, check: true, fetcher: offline, log() {} }), /内容漂移/);
});

test("HTTP errors and missing upstream checklist fail rather than pretending offline", async (context) => {
  await assert.rejects(fetchText("https://example.test", async () => new Response("missing", { status: 404 })), /HTTP 404/);
  await assert.rejects(fetchText("https://example.test", async () => { throw new Error("offline"); }), OfflineError);
  const root = await fixture(context);
  const incomplete = async (url) => url.includes("/git/trees/") ? new Response(JSON.stringify({ tree: [] })) : fetcher(url);
  await assert.rejects(run({ root, fetcher: incomplete, log() {} }), /上游尚无完整/);
  await assert.rejects(readFile(join(root, "docs/forge-skill/manifest.json")), { code: "ENOENT" });
});

test("core mismatch fails before snapshot writes", async (context) => {
  const root = await fixture(context);
  const mismatch = async (url) => url.endsWith("/core/package.json") ? new Response('{"version":"0.4.6"}') : fetcher(url);
  await assert.rejects(run({ root, fetcher: mismatch, log() {} }), /Starter 0.4.7 不同/);
});

test("remote content drift fails even when local snapshot is intact", async (context) => {
  const root = await fixture(context);
  await run({ root, fetcher, log() {} });
  const changed = async (url) => url.endsWith("/skills/forge-skill/SKILL.md") ? new Response("changed") : fetcher(url);
  await assert.rejects(run({ root, check: true, fetcher: changed, log() {} }), /上游通用规范漂移/);
});

test("truncated and unsafe upstream trees cannot be synchronized", async (context) => {
  const root = await fixture(context);
  for (const tree of [
    { truncated: true, tree: [] },
    { tree: [...Object.keys(contents), "../escape.md"].map((path) => ({ path: `skills/forge-skill/${path}`, type: "blob", mode: "100644" })) },
  ]) {
    const invalid = async (url) => url.includes("/git/trees/") ? new Response(JSON.stringify(tree)) : fetcher(url);
    await assert.rejects(run({ root, fetcher: invalid, log() {} }), /上游文件树不完整|不安全的规范路径/);
  }
});
