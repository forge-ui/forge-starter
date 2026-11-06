#!/usr/bin/env node
// Fetch a case example page source from a local Forge checkout or forge-ui/forge.
// Case pages at src/app/cases/<name>/page.tsx show real color × size × variant
// matrices for a given component. Copy these patterns when unsure.
//
// Usage:
//   node scripts/get-case.mjs button-link
//   node scripts/get-case.mjs table card
//
// Case names are kebab-case (e.g. button-link, page-header, pagination-stepper).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "forge-ui/forge";
const BRANCH = "main";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_ROOT = findLocalRoot();

function findLocalRoot() {
  const candidates = [
    process.env.FORGE_REPO_DIR,
    path.resolve(SCRIPT_DIR, "../../.."),
    process.cwd(),
  ].filter(Boolean);

  return candidates.find((dir) => fs.existsSync(path.join(dir, "src/app/cases"))) ?? null;
}

async function fetchCase(name) {
  const slug = name.toLowerCase();
  const rel = `src/app/cases/${slug}/page.tsx`;

  if (LOCAL_ROOT) {
    const localPath = path.join(LOCAL_ROOT, rel);
    if (fs.existsSync(localPath)) {
      return { src: fs.readFileSync(localPath, "utf8"), rel };
    }
  }

  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/src/app/cases/${slug}/page.tsx`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — no case page at ${rel}. Try \`node scripts/list.mjs cases\`.`);
  }
  return { src: await res.text(), rel };
}

async function main() {
  const names = process.argv.slice(2);
  if (names.length === 0) {
    console.error("Usage: node scripts/get-case.mjs <name> [<name>...]");
    console.error("Example: node scripts/get-case.mjs button-link table");
    process.exit(1);
  }

  for (const name of names) {
    try {
      const { src, rel } = await fetchCase(name);
      console.log(`\n# ========================================================`);
      console.log(`# Case example: ${name.toLowerCase()}`);
      console.log(`# Source: ${rel}`);
      console.log(`# Live: https://forgeui.org/cases/${name.toLowerCase()}/`);
      console.log(`# ========================================================\n`);
      console.log(src);
    } catch (err) {
      console.error(`${name}: ${err.message}`);
      process.exitCode = 1;
    }
  }
}

main();
