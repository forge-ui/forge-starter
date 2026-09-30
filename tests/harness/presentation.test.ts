import { test } from "node:test";
import assert from "node:assert/strict";
import { presentationBlockSchema, presentationRequestSchema } from "../../lib/agent/presentation";
import { presentationTools } from "../../lib/agent/presentation-tool";

test("presentation protocol round-trips every model-selectable component and exposes JSON schema", async () => {
  const blocks = [
    { type: "checklist", title: "核对", tasks: [{ id: "a", label: "核对角色" }] },
    { type: "recommendation", title: "建议", body: "先检查权限", question: "查询权限", alternatives: [] },
    { type: "insights", cards: [{ id: "a", title: "分析", body: "待核对", prompt: "继续查询" }] },
    { type: "diff", title: "待核对", columns: [{ key: "name", label: "名称" }], rows: [{ id: "a", cells: { name: "建议" }, change: "add" }] },
    { type: "code", filename: "example.json", lines: ["{}"], diff: [{ old: null, cur: 1, type: "add", pieces: [{ text: "{}", change: "add" }] }] },
    { type: "flow", title: "流程", nodes: [{ id: "a", kind: "trigger", title: "开始" }, { id: "b", kind: "action", title: "核对" }], edges: [{ from: "a", to: "b" }] },
    { type: "commands", title: "搜索入口", items: [{ id: "a", label: "账号", question: "查询账号" }] },
    { type: "context", chunks: [{ id: "a", title: "依据", body: "来自当前查询", sourceLabel: "账号查询" }] },
  ];
  const tool = presentationTools[0];
  assert.equal(tool.mode, "read");
  assert.ok(JSON.stringify(tool.parameters).includes("checklist"));
  if (tool.mode !== "read") throw new Error("unexpected write tool");
  for (const block of blocks) {
    const parsed = presentationRequestSchema.parse(JSON.parse(JSON.stringify({ blocks: [block] })));
    const output = await tool.run(parsed, { userId: "test" });
    assert.deepEqual(output.blocks, [block]);
    assert.equal(output.fill, undefined);
    assert.equal(output.navigation, undefined);
  }
});

test("presentation rejects executable payloads, oversized data, duplicate identifiers and dangling edges", () => {
  for (const block of [
    { type: "html", html: "<script>bad()</script>" },
    { type: "checklist", title: "任务", tasks: [{ id: "a", label: "一" }, { id: "a", label: "二" }] },
    { type: "code", filename: "data", lines: Array(81).fill("x") },
    { type: "flow", title: "流程", nodes: [{ id: "a", kind: "trigger", title: "开始" }], edges: [{ from: "a", to: "missing" }] },
    { type: "commands", title: "入口", items: [{ id: "a", label: "入口", question: "查看", href: "javascript:bad()" }] },
  ]) {
    assert.equal(presentationRequestSchema.safeParse({ blocks: [block] }).success, false);
    assert.equal(presentationBlockSchema.safeParse(block).success, false);
  }
});

test("client keeps presentation blocks across live response and restored history, rejects unknown types", async () => {
  const { sendAskAi, fetchAskAiRuns } = await import("../../lib/ask-ai");
  const originalFetch = globalThis.fetch;
  const block = { type: "checklist", title: "自查", tasks: [{ id: "a", label: "检查角色" }] };
  const rejected = [
    { type: "html", html: "bad" },
    { ...block, tasks: [{ id: "a", label: "重复一" }, { id: "a", label: "重复二" }] },
    { ...block, tasks: Array.from({ length: 12 }, (_, i) => ({ id: String(i), label: "核".repeat(150) })) },
    { type: "flow", title: "缺失目标", nodes: [{ id: "a", kind: "trigger", title: "开始" }], edges: [{ from: "a", to: "missing" }] },
    { type: "diff", title: "未声明列", columns: [{ key: "name", label: "名称" }], rows: [{ id: "a", cells: { hidden: "不可见差异" }, change: "add" }] },
  ];
  try {
    globalThis.fetch = async () => Response.json({ ok: true, text: "请核对", blocks: [block, ...rejected], harness: { id: "run-a", revision: 1, status: "waiting-user", events: [], pending: { id: "choice-a", title: "范围", kind: "question", options: [{ id: "a", label: "角色" }], allowText: false, multiple: true } } });
    const live = await sendAskAi("核对", { signal: new AbortController().signal } as Parameters<typeof sendAskAi>[1]);
    assert.deepEqual(live.blocks, [block]);
    assert.equal(live.harness?.pending?.multiple, true);
    globalThis.fetch = async () => Response.json({ ok: true, runs: [{ id: "run-a", revision: 2, status: "completed", title: "核对", events: [], exchanges: [{ id: "turn-a", question: "核对", output: { text: "请核对", data: { blocks: [block, ...rejected] } } }] }] });
    const restored = await fetchAskAiRuns();
    assert.deepEqual(restored[0].turns[0].result?.blocks, [block]);
  } finally { globalThis.fetch = originalFetch; }
});

test("insight chart variants use bounded numerical facts and survive the read-only tool", async () => {
  const tool = presentationTools[0];
  assert.equal(tool.mode, "read");
  if (tool.mode !== "read") throw new Error("unexpected write tool");
  for (const chart of [
    { kind: "spark", series: [{ name: "活跃账号", values: [12, 15, 18], tone: "blue" }] },
    { kind: "bars", values: [12, 7, 3] },
    { kind: "segments", items: [{ label: "启用", pct: 75, tone: "green" }, { label: "禁用", pct: 25, tone: "yellow" }] },
  ]) {
    const block = { type: "insights", cards: [{ id: "a", title: "账号统计", body: "当前账号查询，单位：个。", prompt: "查询账号详情", chart }] };
    const request = presentationRequestSchema.parse(JSON.parse(JSON.stringify({ blocks: [block] })));
    const output = await tool.run(request, { userId: "test" });
    assert.deepEqual(output.blocks, [block]);
    assert.equal(output.fill, undefined);
  }
  for (const chart of [
    { kind: "bars", values: [-1] },
    { kind: "bars", values: [Number.NaN] },
    { kind: "bars", values: [Number.POSITIVE_INFINITY] },
    { kind: "bars", values: Array(25).fill(1) },
    { kind: "spark", series: [{ name: "启用", values: [1, 2] }, { name: "禁用", values: [1, 2, 3] }] },
    { kind: "spark", series: [{ name: "重复", values: [1, 2] }, { name: "重复", values: [1, 2] }] },
    { kind: "segments", items: [{ label: "启用", pct: 80 }, { label: "禁用", pct: 30 }] },
    { kind: "segments", items: [{ label: "无占比", pct: 0 }] },
    { kind: "segments", items: [{ label: "重复", pct: 20 }, { label: "重复", pct: 30 }] },
  ]) {
    assert.equal(presentationBlockSchema.safeParse({ type: "insights", cards: [{ id: "a", title: "统计", body: "查询数据", prompt: "继续", chart }] }).success, false);
  }
});

test("presentation tool respects the registry permission filter", async () => {
  const { toolsForAccess } = await import("../../lib/agent/registry");
  const access = { roleCode: "test", roleName: "测试", isSuperAdmin: false, allowedModules: [] as never[], permissionCodes: [] as string[] };
  assert.equal(toolsForAccess(access).some(tool => tool.id === "assistant.present"), false);
  assert.equal(toolsForAccess({ ...access, permissionCodes: ["dashboard:read"] }).some(tool => tool.id === "assistant.present"), true);
});
