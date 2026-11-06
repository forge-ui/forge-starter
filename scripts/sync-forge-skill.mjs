#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PREFIX = "skills/forge-skill/";
const REQUIRED = ["SKILL.md", "references/audit-checklist.md"];
const REPOSITORY = "https://github.com/forge-ui/forge";
const execute = promisify(execFile);
class LocalSourceError extends Error {}

async function checkoutSource(directory, ref) {
  const git = async (...args) => {
    try {
      return (await execute("git", ["-C", directory, ...args], { maxBuffer: 16 * 1024 * 1024 })).stdout;
    } catch (error) {
      throw new LocalSourceError(`本地规范源读取失败：${error.message}`);
    }
  };
  const revision = (await git("rev-parse", "--verify", `${ref ?? "HEAD"}^{commit}`)).trim();
  const status = await git("status", "--porcelain", "--untracked-files=all", "--", "core/package.json", PREFIX);
  if (status) throw new Error("本地规范源有未提交改动；先提交来源再同步");
  const sourceRef = ref ?? (await git("symbolic-ref", "--short", "-q", "HEAD").catch(() => revision)).trim();
  const fetcher = async (url) => {
    if (url.includes("/commits/")) return new Response(JSON.stringify({ sha: revision }));
    if (url.includes("/git/trees/")) {
      const entries = (await git("ls-tree", "-r", revision, "--", PREFIX)).trim().split("\n").filter(Boolean);
      return new Response(JSON.stringify({ tree: entries.map((entry) => {
        const [metadata, path] = entry.split("\t");
        const [mode, type] = metadata.split(" ");
        return { mode, type, path };
      }) }));
    }
    const path = url.split(`/${revision}/`)[1];
    return new Response(await git("show", `${revision}:${path}`));
  };
  return { fetcher, sourceRef };
}

export function digest(content) {
  return createHash("sha256").update(content).digest("hex");
}

function safePath(path) {
  return typeof path === "string" && /^[\w./-]+$/.test(path)
    && !path.split("/").some((part) => part === ".." || part === "")
    && !path.startsWith("/");
}

async function json(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function filesAt(directory, prefix = "") {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isSymbolicLink()) throw new Error(`规范副本不允许符号链接：${path}`);
    if (entry.isDirectory()) paths.push(...await filesAt(join(directory, entry.name), `${path}/`));
    else paths.push(path);
  }
  return paths.sort();
}

export async function verifySnapshot(directory, manifest, version) {
  if (manifest.schemaVersion !== 1 || manifest.repository !== REPOSITORY
    || !/^\d+\.\d+\.\d+$/.test(manifest.coreVersion) || manifest.coreVersion !== version || !/^[a-f0-9]{40}$/.test(manifest.revision)
    || typeof manifest.sourceRef !== "string" || !manifest.sourceRef
    || !manifest.files || typeof manifest.files !== "object" || Array.isArray(manifest.files)) {
    throw new Error("规范 manifest 无效或 core 版本漂移；重新执行 pnpm sync:forge-skill");
  }
  const paths = Object.keys(manifest.files).sort();
  if (!REQUIRED.every((path) => paths.includes(path)) || !paths.every(safePath)
    || !Object.values(manifest.files).every((hash) => /^[a-f0-9]{64}$/.test(hash))) {
    throw new Error("规范 manifest 缺少必需文件或包含非法路径/摘要");
  }
  if (JSON.stringify(await filesAt(directory)) !== JSON.stringify(paths)) {
    throw new Error("规范副本文件清单漂移；禁止手改同步副本");
  }
  for (const path of paths) {
    if (digest(await readFile(join(directory, path))) !== manifest.files[path]) {
      throw new Error(`规范副本内容漂移：${path}`);
    }
  }
}

export class OfflineError extends Error {}
export class HttpError extends Error {
  constructor(status, url, rateLimited = false) {
    super(`规范源 HTTP ${status}：${url}`);
    this.status = status;
    this.rateLimited = rateLimited;
  }
}

export async function fetchText(url, fetcher = fetch) {
  let response;
  try {
    response = await fetcher(url, { signal: AbortSignal.timeout(15000) });
  } catch (error) {
    if (error instanceof LocalSourceError) throw error;
    throw new OfflineError(`无法连接规范源：${error.message}`);
  }
  if (!response.ok) throw new HttpError(response.status, url,
    response.status === 429 || (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0"));
  try {
    return await response.text();
  } catch (error) {
    throw new OfflineError(`规范源传输中断：${error.message}`);
  }
}

export async function run({ root = ROOT, check = false, ref, from, fetcher = fetch, log = console.log } = {}) {
  const dependency = (await json(join(root, "package.json"))).dependencies["@forge-ui-official/core"];
  const localDependency = /^(file:|link:|workspace:)/.test(dependency);
  const version = localDependency ? (await json(join(root, "node_modules/@forge-ui-official/core/package.json"))).version : dependency;
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("规范同步要求精确 core 版本");
  const destination = join(root, "docs/forge-skill");
  let manifest;
  try {
    manifest = await json(join(destination, "manifest.json"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const newerVersion = manifest && /^\d+\.\d+\.\d+$/.test(manifest.coreVersion) && version.split(".").reduce((comparison, part, index) => comparison || Math.sign(Number(part) - Number(manifest.coreVersion.split(".")[index])), 0) > 0;
  if (check && (localDependency || newerVersion)) {
    if (!manifest) throw new Error("缺少版本化规范副本；先执行 pnpm sync:forge-skill");
    await verifySnapshot(join(destination, "upstream"), manifest, manifest.coreVersion);
    log(`开发模式 forge-skill：core ${dependency}（实际 ${version}），副本 ${manifest.coreVersion}；本地清单和 SHA256 已校验，兼容结论：未验证（不代表兼容，也不判定不兼容）；当前 core ${version} 与副本 ${manifest.coreVersion} 的版本差异仅允许开发检查继续，远端漂移检查未执行。请执行 corepack pnpm sync:forge-skill --from <path> --ref <commit>（path 为匹配 core ${version} 的已提交 Forge checkout），或 corepack pnpm sync:forge-skill --ref <匹配版本的 commit> 后审查差异。`);
    return;
  }
  if (check && manifest) await verifySnapshot(join(destination, "upstream"), manifest, version);
  const local = from ? await checkoutSource(resolve(from), ref) : undefined;
  if (local) fetcher = local.fetcher;
  const sourceRef = local?.sourceRef ?? ref ?? manifest?.sourceRef ?? "main";
  const lookupRef = !from && !ref && manifest?.sourceKind === "checkout" ? manifest.revision : sourceRef;
  let tree, revision;
  try {
    let commit;
    try {
      commit = JSON.parse(await fetchText(`https://api.github.com/repos/forge-ui/forge/commits/${encodeURIComponent(lookupRef)}`, fetcher));
    } catch (error) {
      if (check && manifest?.sourceKind === "checkout" && lookupRef === manifest.revision
        && error instanceof HttpError && [404, 422].includes(error.status)) {
        log(`SKIP forge-skill 远端漂移检查：来源 revision ${manifest.revision} 尚未 push 或远端不可见；本地版本、清单和 SHA256 已校验。发布上游后重跑；不代表远端检查通过。`);
        return;
      }
      throw error;
    }
    revision = commit.sha;
    if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error("上游返回非法 Git revision");
    const core = JSON.parse(await fetchText(`https://raw.githubusercontent.com/forge-ui/forge/${revision}/core/package.json`, fetcher));
    if (core.version !== version) throw new Error(`上游 core ${core.version} 与 Starter ${version} 不同，请用 --ref 指定匹配版本的提交`);
    tree = JSON.parse(await fetchText(`https://api.github.com/repos/forge-ui/forge/git/trees/${revision}?recursive=1`, fetcher));
    if (tree.truncated || !Array.isArray(tree.tree)) throw new Error("上游文件树不完整，停止同步");
    const paths = tree.tree.filter((entry) => entry.path.startsWith(PREFIX) && entry.type === "blob");
    if (!REQUIRED.every((path) => paths.some((entry) => entry.path === PREFIX + path))) {
      throw new Error("上游尚无完整 forge-skill / references/audit-checklist.md；先完成主仓规范迁移，不能伪造副本");
    }
    const contents = {};
    for (const entry of paths.sort((first, second) => first.path.localeCompare(second.path))) {
      const path = entry.path.slice(PREFIX.length);
      if (!safePath(path) || entry.mode === "120000") throw new Error(`不安全的规范路径：${path}`);
      contents[path] = await fetchText(`https://raw.githubusercontent.com/forge-ui/forge/${revision}/${entry.path}`, fetcher);
    }
    const hashes = Object.fromEntries(Object.entries(contents).map(([path, content]) => [path, digest(content)]));
    if (check) {
      if (!manifest) throw new Error("缺少版本化规范副本；先执行 pnpm sync:forge-skill");
      const paths = Object.keys(hashes).sort();
      if (JSON.stringify(paths) !== JSON.stringify(Object.keys(manifest.files).sort())
        || paths.some((path) => hashes[path] !== manifest.files[path])) {
        throw new Error("上游通用规范漂移；执行 pnpm sync:forge-skill 并审查差异");
      }
      log(`forge-skill ok（core ${version}，${manifest.revision}）`);
      return;
    }
    await mkdir(destination, { recursive: true });
    const staging = join(destination, `.staging-${process.pid}`);
    const backup = join(destination, `.previous-${process.pid}`);
    await mkdir(staging);
    let backedUp = false;
    try {
      for (const [path, content] of Object.entries(contents)) {
        await mkdir(dirname(join(staging, path)), { recursive: true });
        await writeFile(join(staging, path), content);
      }
      const next = { schemaVersion: 1, repository: REPOSITORY, coreVersion: version, sourceKind: from ? "checkout" : "remote", sourceRef, revision, files: hashes };
      await verifySnapshot(staging, next, version);
      try {
        await rename(join(destination, "upstream"), backup);
        backedUp = true;
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
      await rename(staging, join(destination, "upstream"));
      await writeFile(join(destination, ".manifest-next.json"), JSON.stringify(next, null, 2) + "\n");
      await rename(join(destination, ".manifest-next.json"), join(destination, "manifest.json"));
      await rm(backup, { recursive: true, force: true });
    } catch (error) {
      if (backedUp) {
        await rm(join(destination, "upstream"), { recursive: true, force: true });
        await rename(backup, join(destination, "upstream"));
      }
      throw error;
    } finally {
      await rm(staging, { recursive: true, force: true });
    }
    log(`已同步 forge-skill（core ${version}，${revision}）`);
  } catch (error) {
    if (check && manifest && error instanceof HttpError && error.rateLimited) {
      log(`SKIP forge-skill 远端漂移检查：GitHub API 限流（HTTP ${error.status}）；本地版本、清单和 SHA256 已校验。限流恢复后重跑；不代表远端检查通过。`);
      return;
    }
    if (!(error instanceof OfflineError)) throw error;
    log(`SKIP forge-skill 远端漂移检查：${error.message}。${manifest && check ? "本地版本和摘要已校验" : manifest ? "未执行本地副本校验" : "本地副本缺失，未完成规范同步"}；不代表完整检查通过。`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const refIndex = args.indexOf("--ref");
  const ref = refIndex === -1 ? undefined : args[refIndex + 1];
  const fromIndex = args.indexOf("--from");
  const from = fromIndex === -1 ? undefined : args[fromIndex + 1];
  if (args.some((arg, index) => !["--check", "--ref", "--from"].includes(arg)
    && !(refIndex >= 0 && index === refIndex + 1) && !(fromIndex >= 0 && index === fromIndex + 1))
    || (refIndex !== -1 && (!ref || ref.startsWith("--")))
    || (fromIndex !== -1 && (!from || from.startsWith("--")))) {
    console.error("用法：node scripts/sync-forge-skill.mjs [--check] [--ref <Git revision>] [--from <checkout>]");
    process.exitCode = 1;
  } else {
    await run({ check, ref, from }).catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
  }
}
