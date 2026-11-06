import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fetchText, OfflineError, run } from "../../scripts/sync-forge-skill.mjs";

const revision = "a".repeat(40);
const execute = promisify(execFile);
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

test("local dependencies and newer core versions check snapshot integrity in development mode", async (context) => {
  for (const dependency of ["file:/tmp/core.tgz", "link:../core", "workspace:*", "0.6.0", "0.5.0", "0.4.10", "1.0.0"]) {
    const root = await fixture(context);
    await run({ root, fetcher, log() {} });
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { "@forge-ui-official/core": dependency } }));
    await mkdir(join(root, "node_modules/@forge-ui-official/core"), { recursive: true });
    await writeFile(join(root, "node_modules/@forge-ui-official/core/package.json"), '{"version":"0.6.0"}');
    const messages = [];
    const noNetwork = () => { throw new Error("development checks must stay local"); };
    await run({ root, check: true, fetcher: noNetwork, log: message => messages.push(message) });
    assert.equal(messages.length, 1);
    assert.match(messages[0], /开发模式.*SHA256.*兼容结论：未验证（不代表兼容，也不判定不兼容）/);
    assert.match(messages[0], /远端漂移检查未执行.*corepack pnpm sync:forge-skill --from <path> --ref <commit>/);
    assert.ok(messages[0].includes(`当前 core ${dependency.includes(":") ? "0.6.0" : dependency} 与副本 0.4.7`));
    await writeFile(join(root, "docs/forge-skill/upstream/SKILL.md"), "tampered");
    await assert.rejects(run({ root, check: true, fetcher: noNetwork, log() {} }), /内容漂移/);
  }
});

test("development mode never hides missing snapshots or unsafe versions", async (context) => {
  const root = await fixture(context);
  await mkdir(join(root, "node_modules/@forge-ui-official/core"), { recursive: true });
  await writeFile(join(root, "node_modules/@forge-ui-official/core/package.json"), '{"version":"0.5.0"}');
  await writeFile(join(root, "package.json"), '{"dependencies":{"@forge-ui-official/core":"workspace:*"}}');
  await assert.rejects(run({ root, check: true, log() {} }), /缺少版本化规范副本/);
  await writeFile(join(root, "node_modules/@forge-ui-official/core/package.json"), '{"version":"latest"}');
  await assert.rejects(run({ root, check: true, log() {} }), /精确 core 版本/);
  await writeFile(join(root, "package.json"), '{"dependencies":{"@forge-ui-official/core":"0.4.7"}}');
  await run({ root, fetcher, log() {} });
  for (const dependency of ["0.4.6", "0.3.99", "^0.5.0", "latest"]) {
    await writeFile(join(root, "package.json"), JSON.stringify({ dependencies: { "@forge-ui-official/core": dependency } }));
    await assert.rejects(run({ root, check: true, fetcher, log() {} }), /core 版本/);
  }
});

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

test("checkout sync records committed provenance and rejects dirty sources", async (context) => {
  const root = await fixture(context);
  const from = await fixture(context);
  const git = (...args) => execute("git", ["-C", from, ...args]);
  await git("init");
  await mkdir(join(from, "core"));
  await writeFile(join(from, "core/package.json"), '{"version":"0.4.7"}');
  await mkdir(join(from, "skills/forge-skill/references"), { recursive: true });
  for (const [path, content] of Object.entries(contents)) await writeFile(join(from, "skills/forge-skill", path), content);
  await git("add", "core", "skills");
  await git("-c", "user.name=Test", "-c", "user.email=test@example.test", "commit", "-m", "test: source");
  await run({ root, from, log() {} });
  const manifest = JSON.parse(await readFile(join(root, "docs/forge-skill/manifest.json"), "utf8"));
  assert.equal(manifest.sourceKind, "checkout");
  assert.equal(manifest.revision, (await git("rev-parse", "HEAD")).stdout.trim());
  await run({ root, from, check: true, log() {} });
  const messages = [];
  for (const status of [404, 422]) {
    await run({ root, check: true, fetcher: async () => new Response("missing", { status }), log: (message) => messages.push(message) });
  }
  assert.ok(messages.every((message) => /SKIP.*尚未 push.*SHA256/.test(message)));
  for (const status of [403, 429]) {
    await run({ root, check: true, fetcher: async () => new Response("limited", { status, headers: { "x-ratelimit-remaining": "0" } }), log: (message) => assert.match(message, /SKIP.*限流.*SHA256/) });
  }
  await assert.rejects(run({ root, check: true, fetcher: async () => new Response("denied", { status: 403 }), log() {} }), /HTTP 403/);
  await assert.rejects(run({ root, check: true, ref: "main", fetcher: async () => new Response("missing", { status: 404 }), log() {} }), /HTTP 404/);
  await writeFile(join(from, "skills/forge-skill/SKILL.md"), "dirty");
  await assert.rejects(run({ root, from, log() {} }), /未提交改动/);
  await git("restore", "skills/forge-skill/SKILL.md");
  await writeFile(join(from, "skills/forge-skill/untracked.md"), "untracked");
  await assert.rejects(run({ root, from, log() {} }), /未提交改动/);
  await rm(join(from, "skills/forge-skill/untracked.md"));
  await writeFile(join(from, "core/package.json"), '{"version":"0.4.6"}');
  await git("add", "core/package.json");
  await git("-c", "user.name=Test", "-c", "user.email=test@example.test", "commit", "-m", "test: mismatched version");
  await assert.rejects(run({ root, from, log() {} }), /Starter 0.4.7 不同/);
  await run({ root, from, ref: manifest.revision, check: true, log() {} });
  await git("rm", "skills/forge-skill/references/audit-checklist.md");
  await writeFile(join(from, "core/package.json"), '{"version":"0.4.7"}');
  await git("add", "core/package.json");
  await git("-c", "user.name=Test", "-c", "user.email=test@example.test", "commit", "-m", "test: missing checklist");
  await assert.rejects(run({ root, from, log() {} }), /上游尚无完整/);
  await git("rm", "core/package.json");
  await git("-c", "user.name=Test", "-c", "user.email=test@example.test", "commit", "-m", "test: missing core manifest");
  await assert.rejects(run({ root, from, log() {} }), /本地规范源读取失败/);
  await writeFile(join(root, "docs/forge-skill/upstream/SKILL.md"), "tampered");
  await assert.rejects(run({ root, check: true, fetcher: async () => new Response("missing", { status: 404 }), log() {} }), /内容漂移/);
});
