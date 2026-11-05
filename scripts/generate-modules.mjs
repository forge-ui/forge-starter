import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateModules } from "./modules.mjs";

const root = process.cwd();
try {
  for (const [path, content] of Object.entries(generateModules(root))) {
    const target = resolve(root, path);
    if (process.argv.includes("--check")) {
      if (readFileSync(target, "utf8") !== content) throw new Error(`Module registry drift: ${path}; run pnpm modules:generate`);
    } else {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
  }
  console.log("Module manifests and generated registry verified");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
