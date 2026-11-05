#!/usr/bin/env node
import { listPages, readSource } from "./source-index.mjs";

try {
  const routes = process.argv.slice(2);
  if (!routes.length) throw new Error("Usage: node get-template.mjs <route> [route...]");
  const pages = await listPages("templates");
  for (const requested of routes) {
    const route = requested.replace(/^\/+|\/+$/g, "");
    const matches = pages.filter(page => page.route === route);
    if (matches.length !== 1) throw new Error("Expected one template route: " + route + "; use list.mjs templates");
    const page = matches[0];
    const source = await readSource(page.file);
    console.log("\n# Template: " + route + "\n# Source: " + page.file);
    console.log("# Route pattern: /templates/" + route + " (replace dynamic segments with real IDs)");
    console.log(source);
    if (/from\s+["']\.\/_content["']/.test(source)) {
      const contentPath = page.file.replace(/page\.tsx$/, "_content.tsx");
      console.log("\n# Wrapper content: " + contentPath + "\n" + await readSource(contentPath));
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
