import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchAskAiRuns, sendAskAi } from "../../lib/ask-ai";
import { askAiTaskStatus, isAgentTaskRow, parseAskAiTasks } from "../../lib/ask-ai-progress";
import type { RunStatus } from "../../lib/harness/types";

const states: Record<RunStatus, { label: string; color: string; core: boolean }> = {
  running: { label: "进行中", color: "blue", core: true },
  "waiting-user": { label: "等待补充", color: "yellow", core: false },
  "waiting-external": { label: "等待页面确认", color: "yellow", core: false },
  completed: { label: "已完成", color: "green", core: true },
  cancelled: { label: "已取消", color: "grey", core: false },
  failed: { label: "未完成", color: "red", core: true },
};
const tasks = (Object.keys(states) as RunStatus[]).map((status, index) => ({
  id: `request-1:step:${index}`,
  title: `步骤 ${index + 1}`,
  status,
  meta: `服务端检查点：${status}`,
}));
const event = { kind: "tool", label: "准备新建账号", at: "2026-09-30T00:00:00.000Z" };
const request = () => ({ signal: new AbortController().signal }) as Parameters<typeof sendAskAi>[1];

test("task parsing retains all six observed states and their distinct display labels", () => {
  const parsed = parseAskAiTasks(JSON.parse(JSON.stringify(tasks)));
  assert.deepEqual(parsed, tasks);
  for (const task of parsed) {
    const { label, color } = states[task.status];
    assert.deepEqual(askAiTaskStatus(task.status), { label, color });
  }
});

test("core row selection never coerces waiting or cancellation into an execution status", () => {
  const parsed = parseAskAiTasks(tasks);
  const original = JSON.stringify(parsed);
  for (const task of parsed) assert.equal(isAgentTaskRow(task), states[task.status].core);
  assert.deepEqual(parsed.filter(isAgentTaskRow).map(task => task.status), ["running", "completed", "failed"]);
  assert.deepEqual(parsed.filter(task => !isAgentTaskRow(task)).map(task => task.status), ["waiting-user", "waiting-external", "cancelled"]);
  assert.equal(JSON.stringify(parsed), original, "selecting the core renderer must not change server state");
});

test("malformed tasks are dropped without losing valid siblings or exposing internal bindings", () => {
  for (const input of [undefined, null, false, 42, "tasks", {}, { tasks }]) {
    assert.deepEqual(parseAskAiTasks(input), []);
  }
  const valid = { id: "valid", title: "查询账号", status: "running" as const };
  const parsed = parseAskAiTasks([
    null, false, 42, "not a task", [], {},
    { ...valid, id: "" },
    { ...valid, id: 1 },
    { ...valid, id: "x".repeat(301) },
    { ...valid, title: " \n\t " },
    { ...valid, title: 1 },
    { ...valid, title: "字".repeat(1201) },
    { ...valid, status: "pending" },
    { ...valid, status: "success" },
    { ...valid, status: 1 },
    { ...valid, meta: { text: "不是文字" }, interactionId: "private-interaction", children: [{ title: "编造子任务" }] },
    { ...valid, title: "重复记录不得替换首个有效任务", status: "completed" },
    { id: "next", title: "等待页面确认", status: "waiting-external", meta: "先核对再保存" },
  ]);
  assert.deepEqual(parsed, [valid, { id: "next", title: "等待页面确认", status: "waiting-external", meta: "先核对再保存" }]);
  assert.equal(JSON.stringify(parsed).includes("private-interaction"), false);
  assert.equal(JSON.stringify(parsed).includes("编造子任务"), false);
});

test("task history keeps the last thirty records with bounded titles, IDs and metadata", () => {
  const input = Array.from({ length: 45 }, (_, index) => ({
    id: `step-${index}`, title: `查询 ${index}`, status: "completed", meta: "据".repeat(1300),
  }));
  const original = JSON.stringify(input);
  const parsed = parseAskAiTasks(input);
  assert.equal(parsed.length, 30);
  assert.equal(parsed[0].id, "step-15");
  assert.equal(parsed.at(-1)?.id, "step-44");
  assert.ok(parsed.every(task => task.meta?.length === 1200));
  assert.equal(JSON.stringify(input), original, "client parsing must not mutate a persisted payload");
  assert.deepEqual(parseAskAiTasks([{ id: "x".repeat(300), title: "字".repeat(1200), status: "cancelled", meta: "" }]),
    [{ id: "x".repeat(300), title: "字".repeat(1200), status: "cancelled", meta: "" }]);
});

test("live JSON response and restored checkpoint preserve identical server task states", async () => {
  const originalFetch = globalThis.fetch;
  const wireTasks = [...tasks.map(task => ({ ...task, interactionId: "internal-only" })),
    { id: "bad", title: "非法状态", status: "success" }];
  const harness = { id: "run-progress", revision: 6, status: "cancelled", tasks: wireTasks, events: [event] };
  try {
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "/api/ask-ai/");
      assert.equal(init?.method, "POST");
      assert.equal(JSON.parse(String(init?.body)).question, "查询并核对账号");
      return Response.json({ ok: true, text: "本次操作已取消", live: true, harness });
    };
    const live = await sendAskAi("查询并核对账号", request());
    assert.deepEqual(live.harness?.tasks, tasks);
    assert.equal(live.harness?.status, "cancelled");

    globalThis.fetch = async (url, init) => {
      assert.equal(url, "/api/ask-ai/runs/");
      assert.equal(init?.cache, "no-store");
      return Response.json({ ok: true, runs: [{ ...harness, title: "核对账号", exchanges: [
        { id: "turn-before-progress", question: "先看账号", output: { text: "已查询", data: { live: true } } },
        { id: "turn-latest", question: "查询并核对账号", output: { text: live.text, data: { live: true } } },
      ] }] });
    };
    const [restored] = await fetchAskAiRuns();
    assert.deepEqual(restored.tasks, tasks);
    assert.deepEqual(restored.turns[1].result?.harness, live.harness);
    assert.equal(restored.turns[0].result?.harness, undefined, "latest progress must not be attached to an older answer");
    assert.ok(restored.turns.every(turn => turn.pending === false && turn.delivery === undefined));
  } finally { globalThis.fetch = originalFetch; }
});

test("legacy live and saved answers never fabricate tasks from generic events", async () => {
  const originalFetch = globalThis.fetch;
  const harness = { id: "legacy-run", revision: 1, status: "completed", events: [event,
    { ...event, kind: "done", label: "已完成" },
  ] };
  try {
    globalThis.fetch = async () => Response.json({ ok: true, text: "已准备草稿", live: true, harness });
    const live = await sendAskAi("创建账号", request());
    assert.deepEqual(live.harness?.tasks, []);
    assert.deepEqual(live.harness?.events, harness.events);

    globalThis.fetch = async () => Response.json({ ok: true, runs: [{ ...harness, title: "旧会话", exchanges: [
      { id: "legacy-turn", question: "创建账号", output: { text: "已准备草稿", data: {} } },
    ] }] });
    const [restored] = await fetchAskAiRuns();
    assert.deepEqual(restored.tasks, []);
    assert.deepEqual(restored.turns[0].result?.harness?.tasks, []);
    assert.deepEqual(restored.turns[0].result?.harness?.events, harness.events);
  } finally { globalThis.fetch = originalFetch; }
});
