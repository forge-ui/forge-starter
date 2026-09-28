import { writeFileSync } from "node:fs";

// OpenNext serializes local .env files for its preview runtime. A deployment
// must use Workers bindings/secrets, never carry a developer's local secrets.
// Local Workers previews should supply their variables via ignored .dev.vars.
writeFileSync(
  ".open-next/cloudflare/next-env.mjs",
  "export const production = {};\nexport const development = {};\nexport const test = {};\n",
);
console.log("Cloudflare bundle: removed local environment fallback values.");
