#!/usr/bin/env node
import { listPages, normalizeComponent, readSource } from "./source-index.mjs";

try {
  const names = process.argv.slice(2);
  if (!names.length) throw new Error("Usage: node get-component.mjs <Name> [Name...]");
  const pages = await listPages("components");
  for (const name of names) {
    const route = normalizeComponent(name);
    const page = pages.find(item => item.route === route);
    if (!page) throw new Error("No component page for " + name + "; use list.mjs components or generated API references");
    console.log("\n# Component: " + name + "\n# Source: " + page.file + "\n" + await readSource(page.file));
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
