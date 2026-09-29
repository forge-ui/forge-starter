import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { buildIndex, queryIndex, sourceFingerprint, type Index } from "./indexer";
import { publicApplication, CONTRACT_VERSION } from "../../lib/semantic/contracts";
const root = process.cwd();
const dir = resolve(root, ".semantic");
const [command = "build", target = "accounts"] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const path = resolve(dir, "index.json");
try {
  let index: Index;
  if (command === "build" || !existsSync(path)) {
    index = buildIndex(root);
    writeFileSync(path, JSON.stringify(index, null, 2));
    writeFileSync(resolve(dir, "application.json"), JSON.stringify({ version: CONTRACT_VERSION, snapshotId: index.snapshotId, modules: publicApplication }, null, 2));
  } else {
    index = JSON.parse(readFileSync(path, "utf8"));
    if (sourceFingerprint(root) !== index.snapshotId) {
      index = buildIndex(root);
      writeFileSync(path, JSON.stringify(index, null, 2));
      writeFileSync(resolve(dir, "application.json"), JSON.stringify({ version: CONTRACT_VERSION, snapshotId: index.snapshotId, modules: publicApplication }, null, 2));
    }
  }
  console.log(JSON.stringify(command === "build" ? { snapshotId: index.snapshotId, files: Object.keys(index.files).length, facts: index.facts.length, edges: index.edges.length, unresolved: index.unresolved.length, elapsedMs: index.elapsedMs } : queryIndex(index, command, target), null, 2));
} catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
