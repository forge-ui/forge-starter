#!/usr/bin/env node
import { listPages } from "./source-index.mjs";

try {
  const groups = process.argv[2] ? [process.argv[2]] : ["components", "cases", "templates"];
  for (const group of groups) {
    const pages = await listPages(group);
    console.log("\n## " + group + " (" + pages.length + ")");
    for (const page of pages) console.log("- " + (page.route || "/") + " — " + page.file);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
