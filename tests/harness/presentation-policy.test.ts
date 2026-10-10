import assert from "node:assert/strict";
import { test } from "node:test";
import { preparePresentation } from "../../lib/harness/presentation-policy";
import { presentationRequestSchema } from "../../lib/agent/presentation";
import type { Run } from "../../lib/harness/types";

const run = { observations: [{ toolCallId: "real-query", summary: "真实记录", data: { blocks: [{ type: "table", title: "账号", columns: [{ key: "name", label: "名称" }, { key: "count", label: "数量" }], rows: [{ name: "真实账号", count: "12" }] }] } }] } as unknown as Run;
const blocks = (value: unknown) => presentationRequestSchema.parse({ blocks: [value] }).blocks;

test("table views are assembled from an authorized observation, ignoring model-authored records", () => {
  const result = preparePresentation(blocks({ type: "table", title: "核对", sourceToolCallId: "real-query", columns: [{ key: "fake", label: "编造" }], rows: [{ fake: "伪造账号" }] }), run);
  assert.equal(result[0].type, "table");
  if (result[0].type !== "table") throw new Error("expected table");
  assert.deepEqual(result[0].rows, [{ name: "真实账号", count: "12" }]);
  assert.deepEqual(result[0].columns, [{ key: "name", label: "名称" }, { key: "count", label: "数量" }]);
  assert.throws(() => preparePresentation(blocks({ type: "table", title: "核对", sourceToolCallId: "other-run" }), run), /本轮/);
});

test("charts require a successful source and cannot invent numerical facts", () => {
  const chart = (values: number[], sourceToolCallId?: string) => blocks({ type: "insights", cards: [{ id: "count", title: "数量", body: "账号查询，单位条", prompt: "继续", chart: { kind: "bars", values, ...(sourceToolCallId ? { sourceToolCallId } : {}) } }] });
  assert.doesNotThrow(() => preparePresentation(chart([12], "real-query"), run));
  assert.throws(() => preparePresentation(chart([999], "real-query"), run), /数值/);
  assert.throws(() => preparePresentation(chart([12]), run), /本轮/);
  assert.throws(() => preparePresentation(chart([12], "failed-query"), run), /本轮/);
});

test("plain-language checklists do not require unnecessary database queries", () => {
  const input = blocks({ type: "checklist", title: "出行自查", tasks: [{ id: "water", label: "带饮用水" }] });
  assert.deepEqual(preparePresentation(input, {} as Run), input);
});
