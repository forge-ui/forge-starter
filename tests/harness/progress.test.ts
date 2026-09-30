import assert from "node:assert/strict";
import { test } from "node:test";
import { beginTask, MAX_RUN_TASKS, publicRunTasks } from "../../lib/harness/progress";
import { HARNESS_VERSION, jsonValue, type Run } from "../../lib/harness/types";

function run(patch: Partial<Run> = {}): Run {
  return {
    version: HARNESS_VERSION, id: "run-1", ownerId: "owner-1", applicationId: "test", buildId: "test",
    revision: 1, status: "completed", goal: "查询", capabilityNames: [], messages: [],
    output: { text: "已完成", data: {} }, exchanges: [], events: [], lastRequestId: "request-1", updatedAt: "2026-09-30T00:00:00.000Z", ...patch,
  };
}

test("legacy runs do not invent task progress from generic historical events", () => {
  assert.deepEqual(publicRunTasks(run({ events: [{ kind: "tool", label: "准备新建账号", at: "2026-09-30T00:00:00.000Z" }] })), []);
});

test("page cancellation restores honest terminal progress without altering completed work", () => {
  const state = run({ status: "cancelled", tasks: [
    { id: "prepared", title: "准备新建账号", status: "completed" },
    { id: "save", title: "核对并保存页面操作", status: "waiting-external", interactionId: "pending-1" },
  ] });
  const original = jsonValue(state);
  assert.deepEqual(publicRunTasks(state), [
    { id: "prepared", title: "准备新建账号", status: "completed" },
    { id: "save", title: "核对并保存页面操作", status: "cancelled", meta: "本次操作已取消" },
  ]);
  assert.deepEqual(state, original, "public serialization must not mutate the persisted snapshot");
});

test("progress has bounded history, stable caller-owned IDs and no public interaction binding", () => {
  const state = run({ status: "running" });
  for (let index = 0; index < 40; index += 1) {
    const task = beginTask(state, `request-1:tool:${index}:0`, "查询账号");
    task.interactionId = "internal-interaction";
    task.status = "completed";
  }
  const tasks = publicRunTasks(jsonValue(state));
  assert.equal(state.tasks?.length, MAX_RUN_TASKS);
  assert.equal(tasks.length, MAX_RUN_TASKS);
  assert.equal(tasks[0].id, "request-1:tool:10:0");
  assert.equal(new Set(tasks.map(task => task.id)).size, MAX_RUN_TASKS);
  assert.equal(JSON.stringify(tasks).includes("internal-interaction"), false);
});
