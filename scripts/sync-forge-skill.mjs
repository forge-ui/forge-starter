#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PREFIX = "skills/forge-skill/";
const REQUIRED = ["SKILL.md", "references/audit-checklist.md"];
const REPOSITORY = "https://github.com/forge-ui/forge";

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
    || manifest.coreVersion !== version || !/^[a-f0-9]{40}$/.test(manifest.revision)
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

export async function fetchText(url, fetcher = fetch) {
  let response;
  try {
    response = await fetcher(url, { signal: AbortSignal.timeout(15000) });
  } catch (error) {
    throw new OfflineError(`无法连接规范源：${error.message}`);
  }
  if (!response.ok) throw new Error(`规范源 HTTP ${response.status}：${url}`);
  try {
    return await response.text();
  } catch (error) {
    throw new OfflineError(`规范源传输中断：${error.message}`);
  }
}

export async function run({ root = ROOT, check = false, ref, fetcher = fetch, log = console.log } = {}) {
  const version = (await json(join(root, "package.json"))).dependencies["@forge-ui-official/core"];
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("规范同步要求精确 core 版本");
  const destination = join(root, "docs/forge-skill");
  let manifest;
  try {
    manifest = await json(join(destination, "manifest.json"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (check && manifest) await verifySnapshot(join(destination, "upstream"), manifest, version);
  const sourceRef = ref ?? manifest?.sourceRef ?? "main";
  let tree, revision;
  try {
    const commit = JSON.parse(await fetchText(`https://api.github.com/repos/forge-ui/forge/commits/${encodeURIComponent(sourceRef)}`, fetcher));
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
      const next = { schemaVersion: 1, repository: REPOSITORY, coreVersion: version, sourceRef, revision, files: hashes };
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
    if (!(error instanceof OfflineError)) throw error;
    log(`SKIP forge-skill 远端漂移检查：${error.message}。${manifest && check ? "本地版本和摘要已校验" : manifest ? "未执行本地副本校验" : "本地副本缺失，未完成规范同步"}；不代表完整检查通过。`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const refIndex = args.indexOf("--ref");
  const ref = refIndex === -1 ? undefined : args[refIndex + 1];
  if (args.some((arg, index) => arg !== "--check" && arg !== "--ref" && (refIndex < 0 || index !== refIndex + 1))
    || (refIndex !== -1 && (!ref || ref.startsWith("--")))) {
    console.error("用法：node scripts/sync-forge-skill.mjs [--check] [--ref <Git revision>]");
    process.exitCode = 1;
  } else {
    await run({ check, ref }).catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
  }
}
