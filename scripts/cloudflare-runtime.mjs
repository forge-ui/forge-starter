import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { parse } from "dotenv";

const command = process.argv[2];
if (!["preview", "deploy"].includes(command)) throw new Error("Expected preview or deploy");
const local = existsSync(".env") ? parse(readFileSync(".env")) : {};
const key = "CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE";
const connection = process.env[key] || local.DATABASE_URL;
if (command === "preview" && !connection) {
  throw new Error(`Set ${key} or local .env DATABASE_URL before previewing Hyperdrive`);
}
const result = spawnSync("pnpm", ["exec", "opennextjs-cloudflare", command], {
  stdio: "inherit",
  env: {
    ...process.env,
    // OpenNext constructs a local platform proxy even during deployment.
    // The placeholder is never used by the deployed Hyperdrive binding.
    [key]: connection || "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
  },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
