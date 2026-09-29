import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { parse } from "dotenv";
const env = { ...process.env, ...parse(readFileSync(".semantic/test.env")) };
const url = new URL(env.DATABASE_URL);
if (url.hostname !== "127.0.0.1" || !url.pathname.startsWith("/forge_semantic_test_")) throw new Error("Test database required");
const child = spawn(process.argv[2], process.argv.slice(3), { env, stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));
