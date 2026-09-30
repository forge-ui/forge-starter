import assert from "node:assert/strict";
import { test } from "node:test";
import {
  askAiDeliveryPlaying,
  askAiDeliverySettled,
  askAiReplayDelivery,
  bindAskAiAnswer,
  completeAskAiText,
  createAskAiTextBuffer,
  isCurrentAskAiRequest,
  receiveAskAiText,
  settleAskAiDelivery,
  stopAskAiText,
} from "../../lib/ask-ai-playback";

test("static answers omit streaming and status while markdown fade defaults stay explicit", () => {
  const binding = bindAskAiAnswer("你好");
  assert.equal(binding.text, "你好");
  assert.equal(binding.format, "markdown");
  assert.equal(binding.animation, "fade");
  assert.equal(binding.duration, 500);
  assert.equal(binding.motion, "auto");
  assert.equal("streaming" in binding, false);
  assert.equal("status" in binding, false);
});

test("a finished JSON payload replays with streaming and does not also set status", () => {
  const binding = bindAskAiAnswer("完整回答", { mode: "replay" });
  assert.equal(binding.streaming, true);
  assert.equal("status" in binding, false);
  assert.deepEqual(askAiReplayDelivery({ text: "完整回答" }), { mode: "replay" });
  assert.deepEqual(askAiReplayDelivery({ text: "失败", failed: true }), { mode: "static" });
  assert.deepEqual(askAiReplayDelivery({ text: "请选择", blocks: [{ type: "choice", title: "选择目标" }] }), { mode: "static" });
  assert.deepEqual(askAiReplayDelivery({ text: "问题", harness: { pending: { kind: "question" } } }), { mode: "static" });
});

test("incremental delivery appends cumulative text and a pause keeps streaming", () => {
  const started = createAskAiTextBuffer();
  const first = receiveAskAiText(started, "你好");
  const paused = first;
  const second = receiveAskAiText(paused, "，世界");
  assert.deepEqual(second, { text: "你好，世界", status: "streaming" });
  assert.equal(receiveAskAiText(second, ""), second);
  const binding = bindAskAiAnswer(second.text, { mode: "incremental", status: second.status });
  assert.equal(binding.status, "streaming");
  assert.equal("streaming" in binding, false);
  assert.equal(askAiDeliveryPlaying({ mode: "incremental", status: "streaming" }), true);
});

test("stopping freezes the buffer and a later complete cannot drain it", () => {
  const live = receiveAskAiText(createAskAiTextBuffer(), "已经显示");
  const stopped = stopAskAiText(live);
  assert.deepEqual(stopped, { text: "已经显示", status: "stopped" });
  assert.equal(completeAskAiText(stopped), stopped);
  assert.equal(receiveAskAiText(stopped, "更多"), stopped);
  assert.equal(stopAskAiText(stopped), stopped);
  const binding = bindAskAiAnswer(stopped.text, { mode: "stopped" });
  assert.equal(binding.status, "stopped");
  assert.equal("streaming" in binding, false);
});

test("presentation settles replay once and never turns a stop into complete", () => {
  assert.deepEqual(settleAskAiDelivery({ mode: "replay" }, "presented"), { mode: "static" });
  assert.deepEqual(settleAskAiDelivery({ mode: "incremental", status: "complete" }, "presented"), { mode: "static" });
  assert.deepEqual(settleAskAiDelivery({ mode: "incremental", status: "streaming" }, "presented"), {
    mode: "incremental",
    status: "streaming",
  });
  const stopped = settleAskAiDelivery({ mode: "replay" }, "stop");
  assert.deepEqual(stopped, { mode: "stopped" });
  assert.equal(settleAskAiDelivery(stopped, "presented"), stopped);
  assert.equal(settleAskAiDelivery({ mode: "static" }, "stop").mode, "static");
  assert.equal(settleAskAiDelivery(undefined, "presented").mode, "static");
  assert.equal(askAiDeliveryPlaying({ mode: "stopped" }), false);
  assert.equal(askAiDeliveryPlaying(undefined), false);
  assert.equal(askAiDeliverySettled(undefined), true);
  assert.equal(askAiDeliverySettled({ mode: "static" }), true);
  assert.equal(askAiDeliverySettled({ mode: "replay" }), false);
  assert.equal(askAiDeliverySettled({ mode: "incremental", status: "complete" }), false);
  assert.equal(askAiDeliverySettled({ mode: "stopped" }), false);
});

test("a replaced request cannot write after stop or regenerate", () => {
  const first = new AbortController();
  const second = new AbortController();
  const active = { turnId: "b", controller: second };
  assert.equal(isCurrentAskAiRequest(active, { turnId: "a", controller: first }), false);
  assert.equal(isCurrentAskAiRequest(active, { turnId: "b", controller: second }), true);
  second.abort();
  assert.equal(isCurrentAskAiRequest(active, { turnId: "b", controller: second }), false);
  assert.equal(isCurrentAskAiRequest(null, { turnId: "b", controller: second }), false);
});
