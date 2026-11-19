#!/usr/bin/env node
// Read the current project before generating UI: installed Forge version vs the version this skill
// documents, framework versions, starter layout, copied Blocks, shadcn registries and agent files.
//
// Usage: node scripts/project-info.mjs [projectDir] [--json]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const json = args.includes("--json");
const root = path.resolve(args.find(arg => !arg.startsWith("--")) ?? process.cwd());
const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const readJson = file => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return null; } };
const exists = relative => fs.existsSync(path.join(root, relative));
const major = range => range?.match(/(\d+)\.(\d+)?/)?.slice(1, 3).map(Number) ?? null;

function documentedVersion() {
  const reference = path.join(skillDir, "references/components/button.md");
  return fs.existsSync(reference) ? fs.readFileSync(reference, "utf8").match(/core \*\*([\d.]+)\*\*/)?.[1] ?? null : null;
}

function installedVersion() {
  const installed = readJson(path.join(root, "node_modules/@forge-ui-official/core/package.json"));
  return installed?.version ?? null;
}

function copiedBlocks() {
  const blocks = new Set();
  const walk = dir => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", ".next", "dist", ".git"].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx|ts|jsx)$/.test(entry.name)) {
        for (const match of fs.readFileSync(full, "utf8").matchAll(/from\s+["']@\/components\/blocks\/([\w-]+)["']/g)) blocks.add(match[1]);
      }
    }
  };
  walk(path.join(root, "src"));
  walk(path.join(root, "app"));
  for (const dir of ["src/components/blocks", "components/blocks"]) {
    if (exists(dir)) for (const entry of fs.readdirSync(path.join(root, dir))) blocks.add(entry.replace(/\.(tsx|ts)$/, ""));
  }
  return [...blocks].sort();
}

const pkg = readJson(path.join(root, "package.json"));
const dependencies = { ...(pkg?.dependencies ?? {}), ...(pkg?.devDependencies ?? {}) };
const components = readJson(path.join(root, "components.json"));
const info = {
  project: root,
  hasPackageJson: Boolean(pkg),
  forge: {
    declared: dependencies["@forge-ui-official/core"] ?? null,
    installed: installedVersion(),
    documentedBySkill: documentedVersion(),
  },
  framework: { next: dependencies.next ?? null, react: dependencies.react ?? null, tailwind: dependencies.tailwindcss ?? null },
  starter: exists("docs/forge-skill/upstream/SKILL.md") || /forge-starter/.test(pkg?.name ?? ""),
  agentFiles: ["AGENTS.md", "CLAUDE.md", "DESIGN.md", ".mcp.json", ".cursor/mcp.json"].filter(exists),
  shadcnRegistries: components?.registries ?? null,
  copiedBlocks: copiedBlocks(),
};

const notes = [];
if (!info.hasPackageJson) notes.push("没有找到 package.json：确认当前目录是项目根目录。");
else if (!info.forge.declared) notes.push("项目还没装 Forge：pnpm add @forge-ui-official/core，并按 https://www.forgeui.org/docs/quick-start 接入样式。");
if (info.forge.installed && info.forge.documentedBySkill && info.forge.installed !== info.forge.documentedBySkill) {
  const [installedMajor, installedMinor] = major(info.forge.installed) ?? [];
  const [skillMajor, skillMinor] = major(info.forge.documentedBySkill) ?? [];
  notes.push(installedMajor !== skillMajor || installedMinor !== skillMinor
    ? `已装 core ${info.forge.installed}，本 skill 描述的是 ${info.forge.documentedBySkill}：API 可能不同。以 node_modules 里的类型为准，或升级后再按本 skill 写。`
    : `已装 core ${info.forge.installed}，本 skill 描述的是 ${info.forge.documentedBySkill}，同一小版本，差异只在补丁。`);
}
if (info.framework.react && (major(info.framework.react)?.[0] ?? 0) < 19) notes.push("Forge 需要 React 19 以上。");
if (info.framework.tailwind && (major(info.framework.tailwind)?.[0] ?? 0) < 4) notes.push("Forge 需要 Tailwind v4。");
if (info.starter) notes.push("这是 forge-starter 项目：路由、权限和数据接入按该仓的 AGENTS.md 与 starter skill 执行。");
if (info.copiedBlocks.length) notes.push(`项目里已有页面组件：${info.copiedBlocks.join("、")}。新页面优先复用或对齐它们的写法。`);
if (!info.agentFiles.includes("DESIGN.md")) notes.push("项目根目录没有 DESIGN.md，可运行 curl -fsSL https://www.forgeui.org/setup.sh | bash -s -- --scope project --design 补上。");
if (info.shadcnRegistries && !Object.values(info.shadcnRegistries).some(url => String(url).includes("forgeui.org"))) notes.push('components.json 的 registries 里可以加上 "@forge": "https://www.forgeui.org/r/{name}.json"，之后用 npx shadcn add @forge/<name> 安装页面组件。');

if (json) process.stdout.write(JSON.stringify({ ...info, notes }, null, 2) + "\n");
else {
  console.log(`项目：${root}`);
  console.log(`Forge：声明 ${info.forge.declared ?? "无"}，已装 ${info.forge.installed ?? "无"}，skill 对应 ${info.forge.documentedBySkill ?? "未知"}`);
  console.log(`框架：Next ${info.framework.next ?? "无"}，React ${info.framework.react ?? "无"}，Tailwind ${info.framework.tailwind ?? "无"}`);
  console.log(`代理文件：${info.agentFiles.join("、") || "无"}`);
  for (const note of notes) console.log(`- ${note}`);
}
