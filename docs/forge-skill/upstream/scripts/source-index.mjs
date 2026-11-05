import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repository = "forge-ui/forge";
export const branch = "main";
export const localRoot = [process.env.FORGE_REPO_DIR, path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.."), process.cwd()].filter(Boolean).find(root => fs.existsSync(path.join(root, "src/app/templates"))) ?? null;
let remoteFiles;

export function publicRoute(file, group) {
  const segments = file.slice(("src/app/" + group + "/").length).split("/").slice(0, -1);
  if (segments.some(segment => segment.startsWith("_"))) return null;
  return segments.filter(segment => !/^\(.*\)$/.test(segment)).join("/");
}

export function collectFiles(root, relative = "src/app") {
  return fs.readdirSync(path.join(root, relative), { withFileTypes: true }).flatMap(entry => {
    const name = relative + "/" + entry.name;
    if (entry.name.startsWith("_")) return [];
    return entry.isDirectory() ? collectFiles(root, name) : [name];
  });
}

export async function listPages(group) {
  if (!["components", "cases", "templates"].includes(group)) throw new Error("Unknown group: " + group);
  let files;
  if (localRoot) files = collectFiles(localRoot, "src/app/" + group);
  else {
    if (!remoteFiles) {
      const response = await fetch("https://api.github.com/repos/" + repository + "/git/trees/" + branch + "?recursive=1");
      if (!response.ok) throw new Error("GitHub tree HTTP " + response.status);
      const tree = await response.json();
      if (tree.truncated || !Array.isArray(tree.tree)) throw new Error("Incomplete GitHub tree");
      remoteFiles = tree.tree.filter(entry => entry.type === "blob").map(entry => entry.path);
    }
    files = remoteFiles;
  }
  return files.filter(file => file.startsWith("src/app/" + group + "/") && file.endsWith("/page.tsx")).map(file => ({ file, route: publicRoute(file, group) })).filter(item => item.route !== null).sort((left, right) => left.route.localeCompare(right.route));
}

export async function readSource(relative) {
  if (relative.split("/").includes("..") || path.isAbsolute(relative)) throw new Error("Invalid source path");
  if (localRoot) return fs.readFileSync(path.join(localRoot, relative), "utf8");
  const response = await fetch("https://raw.githubusercontent.com/" + repository + "/" + branch + "/" + relative);
  if (!response.ok) throw new Error("Source HTTP " + response.status + ": " + relative);
  return response.text();
}

export function normalizeComponent(name) {
  const aliases = { Button: "button-link", Link: "button-link", DataTable: "table", FullWidthTable: "table" };
  return aliases[name] ?? ({ button: "button-link", "data-table": "table", "full-width-table": "table" }[name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()] ?? name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase());
}
