import { test } from "node:test";
import assert from "node:assert/strict";
import { signAgentIntent, readAgentIntent, readExportToken } from "../../lib/agent/intent";
test("S01 signed intent rejects tampering and different users", async () => {
 const token = await signAgentIntent("a", "accounts.update", { id: crypto.randomUUID(), notes: "test" });
 await assert.rejects(readAgentIntent(token, "b"), /用户/);
 const parts = token.split("."); parts[1] = Buffer.from(JSON.stringify({ sub: "b", args: {} })).toString("base64url");
 await assert.rejects(readAgentIntent(parts.join("."), "a"), /无效/);
});
test("S01 intent cannot be reused as an export token", async () => {
 const token = await signAgentIntent("a", "accounts.delete", { id: crypto.randomUUID() });
 await assert.rejects(readExportToken(token, "a"), /无效/);
 assert.equal((await readAgentIntent(token, "a")).toolId, "accounts.delete");
});
