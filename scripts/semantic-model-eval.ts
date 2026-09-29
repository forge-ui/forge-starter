import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import { runAgentTurn } from "../lib/agent/loop";
import { resolveAskAiLlmConfig } from "../lib/ask-ai-llm";
import { APPLICATION_BUILD_ID, CONTRACT_VERSION } from "../lib/semantic/contracts";
import type { PageContext } from "../lib/semantic/context";
import { closeDb } from "../lib/db";
if (!process.env.DATABASE_URL?.includes("/forge_semantic_test_")) throw new Error("isolated DB required");
const fixture = JSON.parse(readFileSync(".semantic/fixture.json", "utf8"));
const a = fixture.accounts[0], b = fixture.accounts[1];
const detail: PageContext = { version: CONTRACT_VERSION, buildId: APPLICATION_BUILD_ID, pageId: "accounts.detail", instanceId: crypto.randomUUID(), revision: 1, entityId: a.id, query: {} };
const list: PageContext = { ...detail, pageId: "accounts.list", entityId: undefined, query: { status: "disabled" } };
const models: PageContext = { ...detail, pageId: "models.workspace", entityId: undefined, query: { provider: "openai" } };
type Case = { id: string; question: string; page?: PageContext; tool?: string; args?: Record<string, unknown>; noWrite?: boolean };
const cases: Case[] = [
 { id: "P01", question: "停用当前这个账号，其他字段不变", page: detail, tool: "accounts.update", args: { id: a.id, status: "disabled" } },
 { id: "P02", question: "导出当前筛选结果", page: list, tool: "accounts.export", args: { status: "disabled" } },
 { id: "P03", question: "查看当前账号的详情", page: detail, tool: "accounts.get", args: { id: a.id } },
 { id: "P04", question: "把当前账号备注改成已核对，其他字段不变", page: detail, tool: "accounts.update", args: { id: a.id, notes: "已核对" } },
 { id: "P05", question: "当前筛选结果有多少条", page: list, tool: "accounts.list", args: { status: "disabled" } },
 { id: "P06", question: "把账号列表切换为启用状态", page: list, tool: "accounts.filter", args: { status: "active" } },
 { id: "P07", question: "请导出当前客服搜索结果", page: { ...list, query: { query: "客服" } }, tool: "accounts.export", args: { query: "客服" } },
 { id: "P08", question: "修改这条账号的备注为已核对", page: { ...list, query: {} }, noWrite: true },
 { id: "P09", question: "清空账号列表筛选条件", page: list, tool: "accounts.filter" },
 { id: "P10", question: "打开当前账号的删除确认", page: detail, tool: "accounts.delete", args: { id: a.id } },
 { id: "D01", question: "查找姓名为语义测试乙的账号", tool: "accounts.list" },
 { id: "D02", question: "列出所有停用账号", tool: "accounts.list", args: { status: "disabled" } },
 { id: "D03", question: "导出所有运营账号", tool: "accounts.export", args: { role: "运营" } },
 { id: "D04", question: `读取账号 ${b.id}`, tool: "accounts.get", args: { id: b.id } },
 { id: "D05", question: "新建业务账号：姓名语义测试丙，用户名semantic_gamma，邮箱gamma@example.test，手机123456，角色运营，部门客服，状态待激活，备注测试", tool: "accounts.create", args: { username: "semantic_gamma", status: "pending" } },
 { id: "D06", question: "找出客服部门的账号", tool: "accounts.list" },
 { id: "D07", question: "导出全部业务账号CSV", tool: "accounts.export" },
 { id: "D08", question: "业务账号和登录用户是一张表吗", noWrite: true },
 { id: "D09", question: "只查询锁定账号，不修改数据", tool: "accounts.list", args: { status: "locked" } },
 { id: "D10", question: "查询手机123456的账号", tool: "accounts.list" },
 { id: "M01", question: "列出当前供应商的模型", page: models, tool: "models.list", args: { provider: "openai" } },
 { id: "M02", question: "把模型供应商筛选切到openai", page: models, tool: "models.filter", args: { provider: "openai" } },
 { id: "M03", question: "打开语义测试模型的详情", page: models, tool: "models.open", args: { id: fixture.models[0].id } },
 { id: "M04", question: "列出所有模型，不要修改配置", page: models, tool: "models.list" },
 { id: "M05", question: "请显示所有模型API密钥", page: models, noWrite: true },
 { id: "M06", question: "在模型页面按名称搜索语义测试", page: models, tool: "models.filter", args: { query: "语义测试" } },
];
async function main() {
 const env = resolveAskAiLlmConfig();
 if (!env.apiKey) throw new Error("No model configured");
 const result: unknown[] = [];
 const jobs = [1, 2].flatMap((round) => cases.map((item) => ({ round, item })));
 // Bounded concurrency keeps the evaluation predictable and avoids flooding the provider.
 await Promise.all(Array.from({ length: 3 }, async () => {
  for (;;) {
   const job = jobs.shift(); if (!job) break;
   const { round, item } = job;
   const calls: Array<{ id: string; args: Record<string, unknown> }> = [];
   try {
    const output = await runAgentTurn({ question: item.question, pageLabel: item.page?.pageId ?? "后台", page: item.page, history: [], signal: AbortSignal.timeout(90000), userId: "semantic-eval", access: { roleCode: "super_admin", roleName: "测试", permissionCodes: [], allowedModules: ["accounts", "models"], isSuperAdmin: true }, model: { id: "eval", name: env.model, provider: env.provider, modelName: env.model, apiBase: env.baseUrl, apiKey: env.apiKey }, onTool: (id, args) => calls.push({ id, args: args as Record<string, unknown> }) });
    const match = calls.find((c) => c.id === item.tool && Object.entries(item.args ?? {}).every(([k,v]) => c.args[k] === v));
    const pass = item.noWrite ? !calls.some((c) => ["accounts.create", "accounts.update", "accounts.delete"].includes(c.id)) : Boolean(match) && (!/[.](create|update|delete|filter|open)$/.test(item.tool ?? "") || output.blocks.some((b) => b.type === (item.tool === "accounts.create" ? "form" : "confirm")));
    result.push({ id: item.id, round, pass, calls, text: output.text });
    console.log(`${round}/${item.id}: ${pass ? "PASS" : "FAIL"}`);
   } catch (error) { result.push({ id: item.id, round, pass: false, calls, error: error instanceof Error ? error.message : String(error) }); console.log(`${round}/${item.id}: ERROR`); }
   writeFileSync(".semantic/model-evaluation.json", JSON.stringify({ model: env.model, cases, results: result }, null, 2));
  }
 }));
 await closeDb();
}
void main();
