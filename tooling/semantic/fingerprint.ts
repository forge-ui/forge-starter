import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
/** Cheap content fingerprint. Changes invalidate the whole type graph conservatively. */
export function sourceFingerprint(root: string) {
  const entries: Array<[string, string]> = [];
  function walk(dir: string) {
    if (!existsSync(resolve(root, dir))) return;
    for (const item of readdirSync(resolve(root, dir), { withFileTypes: true })) {
      const path = `${dir}/${item.name}`;
      if (item.isSymbolicLink() || item.name === "ref" || item.name === "reference") continue;
      if (item.isDirectory()) walk(path);
      else if (/\.tsx?$/.test(path)) entries.push([path, hash(readFileSync(resolve(root, path), "utf8"))]);
    }
  }
  for (const dir of ["app", "lib", "components", "config", "tooling/semantic"]) walk(dir);
  for (const file of ["tsconfig.json", "pnpm-lock.yaml"]) if (existsSync(resolve(root, file))) entries.push([file, hash(readFileSync(resolve(root, file), "utf8"))]);
  return hash(JSON.stringify(entries.sort(([a], [b]) => a.localeCompare(b))));
}
