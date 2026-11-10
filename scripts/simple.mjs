// Simple mode: remove the /ref reference gallery except the pages skills copy from.
//   pnpm simple          # show what would be removed
//   pnpm simple --yes    # remove it (requires a clean git tree; add --force to skip that check)
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import ts from "typescript";

// detail-modal: the only light-detail sample; resource-workspace: the third sample in docs/module-template.md.
export const KEPT_REFERENCE_PAGES = ["detail-modal", "resource-workspace"];

const REF_DIR = "app/(app)/ref";
const CATALOG = "lib/reference/catalog.ts";
const SUPPORT_DIRS = ["lib/reference", "components/reference"];
const SOURCE_DIRS = ["app", "components", "lib", "config", "tooling"];

function sourceFiles(root, directory) {
  if (!existsSync(resolve(root, directory))) return [];
  return readdirSync(resolve(root, directory), { withFileTypes: true }).flatMap(entry => {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return entry.name === "node_modules" ? [] : sourceFiles(root, path);
    return /\.(tsx?|mjs)$/.test(entry.name) ? [path] : [];
  });
}

export function catalogWithout(source, removed) {
  const file = ts.createSourceFile(CATALOG, source, ts.ScriptTarget.Latest, true);
  const ranges = [];
  const visit = node => {
    if (ts.isVariableDeclaration(node) && node.name.getText(file) === "REF_PAGES" && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      for (const element of node.initializer.elements) {
        const slug = ts.isObjectLiteralExpression(element) && element.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(file) === "slug");
        if (!slug || !ts.isStringLiteral(slug.initializer) || !removed.includes(slug.initializer.text)) continue;
        const comma = source.slice(element.getEnd()).match(/^\s*,/);
        ranges.push([element.getFullStart(), element.getEnd() + (comma ? comma[0].length : 0)]);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return ranges.reverse().reduce((text, [start, end]) => text.slice(0, start) + text.slice(end), source);
}

export function planSimpleMode(root) {
  const pages = readdirSync(resolve(root, REF_DIR), { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name);
  const removedPages = pages.filter(slug => !KEPT_REFERENCE_PAGES.includes(slug));
  const removedDirs = new Set(removedPages.map(slug => `${REF_DIR}/${slug}`));
  const removedFiles = [];
  const isRemoved = path => [...removedDirs].some(dir => path.startsWith(dir + "/")) || removedFiles.includes(path);
  // Drop support files nothing outside the removed pages imports, until no more become orphaned.
  for (let changed = true; changed;) {
    changed = false;
    const remaining = SOURCE_DIRS.flatMap(dir => sourceFiles(root, dir)).filter(path => !isRemoved(path));
    for (const path of SUPPORT_DIRS.flatMap(dir => sourceFiles(root, dir))) {
      if (removedFiles.includes(path) || path === CATALOG) continue;
      const specifier = "@/" + path.replace(/\.(tsx?|mjs)$/, "");
      const used = remaining.some(other => other !== path && readFileSync(resolve(root, other), "utf8").includes(`"${specifier}"`));
      if (!used) {
        removedFiles.push(path);
        changed = true;
      }
    }
  }
  return { removedPages, removedFiles, keptPages: pages.filter(slug => KEPT_REFERENCE_PAGES.includes(slug)) };
}

export function applySimpleMode(root, plan) {
  for (const slug of plan.removedPages) rmSync(resolve(root, REF_DIR, slug), { recursive: true });
  for (const path of plan.removedFiles) rmSync(resolve(root, path));
  const catalog = resolve(root, CATALOG);
  writeFileSync(catalog, catalogWithout(readFileSync(catalog, "utf8"), plan.removedPages));
}

if (process.argv[1] && import.meta.url.endsWith("/" + basename(process.argv[1]))) {
  const root = process.cwd();
  const plan = planSimpleMode(root);
  if (!plan.removedPages.length) {
    console.log("已经是精简模式：/ref 只剩 " + plan.keptPages.join("、") + "。");
    process.exit(0);
  }
  console.log(`将删除 ${plan.removedPages.length} 个参考页：${plan.removedPages.join("、")}`);
  if (plan.removedFiles.length) console.log(`以及只被它们使用的文件：${plan.removedFiles.join("、")}`);
  console.log(`保留：/ref 索引、${plan.keptPages.map(slug => "/ref/" + slug).join("、")}，以及账号管理等全部业务模块。`);
  console.log("删掉的页面在官网和上游仓库都能查到，见 docs/reference-pages.md。");
  if (!process.argv.includes("--yes")) {
    console.log("\n确认后运行：pnpm simple --yes");
    process.exit(0);
  }
  if (!process.argv.includes("--force")) {
    let dirty;
    try {
      dirty = execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      console.error("这里不是 git 仓库，删错了无法恢复。先 git init 并提交一次，或加 --force。");
      process.exit(1);
    }
    if (dirty) {
      console.error("工作区有未提交的改动。先提交，删错了才能用 git 恢复；或加 --force。");
      process.exit(1);
    }
  }
  applySimpleMode(root, plan);
  console.log("\n已精简。接着运行 pnpm check 确认项目仍然通过。");
}
