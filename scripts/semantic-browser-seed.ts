import { createAdminAccount } from "../lib/accounts/service";
import { getDb, closeDb } from "../lib/db";
import { aiModels } from "../lib/db/schema";
import { writeFileSync } from "node:fs";
if (!process.env.DATABASE_URL?.includes("/forge_semantic_test_")) throw new Error("isolated DB required");
async function main() {
 const accounts = [];
 for (const [username, name, status, department] of [["semantic_alpha", "语义测试甲", "active", "客服"], ["semantic_beta", "语义测试乙", "disabled", "平台"]] as const) accounts.push(await createAdminAccount({ username, name, email: `${username}@example.test`, phone: "123 456", role: "运营", department, status, notes: "仅用于隔离环境验收" }));
 const models = await getDb().insert(aiModels).values({ name: "语义测试模型", provider: "openai", modelName: "test-model", apiBase: "https://example.test/v1", apiKey: "", status: "disabled" }).returning({ id: aiModels.id });
 writeFileSync(".semantic/fixture.json", JSON.stringify({ accounts, models }, null, 2));
 console.log("Seeded 2 disposable accounts and 1 disabled model in isolated DB");
 await closeDb();
}
void main();
