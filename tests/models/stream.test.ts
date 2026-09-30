import assert from "node:assert/strict";
import { test } from "node:test";
import { partialJsonString, respondAnswerText } from "../../lib/models/stream";
import { runModelChatTurn } from "../../lib/models/runtime";

test("respond answer text waits for outcome and keeps escape sequences intact", () => {
  assert.equal(respondAnswerText('{"outcome":"ans'), "");
  assert.equal(respondAnswerText('{"outcome":"question","text":"选哪个"}'), "");
  assert.equal(respondAnswerText('{"text":"你好","outcome":"answer"}'), "你好");
  assert.equal(partialJsonString('{"outcome":"answer","text":"a\\"b\\n你"}', "text"), 'a"b\n你');
  assert.equal(respondAnswerText('{"outcome":"answer","text":"一\\u4e2d"}'), "一中");
  assert.equal(respondAnswerText('{"outcome":"answer","text":"尾\\u4e2'), "尾");
});

test("model turns request a stream and emit answer text while tool arguments grow", async () => {
  const model = { id: "test", name: "Stream", provider: "openai", modelName: "fixture", apiBase: "https://model.example.test/v1", apiKey: "secret" };
  const seen: string[] = [];
  const body = [
    'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"id":"call-1","function":{"name":"respond","arguments":"{\\"outcome\\":\\"answer\\",\\"text\\":\\"你"}}]}}]}\n\n',
    'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":"好\\"}"}}]}}]}\n\n',
    'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":null}}]}}]}\n\n',
    "data: [DONE]\n\n",
  ].join("");
  const original = globalThis.fetch;
  globalThis.fetch = async (_url, init) => {
    const request = JSON.parse(String(init?.body));
    assert.equal(request.stream, true);
    assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer secret");
    return new Response(body, { headers: { "Content-Type": "text/event-stream" } });
  };
  try {
    const turn = await runModelChatTurn(model, [{ role: "user", content: "你好" }], {
      tools: [{ name: "respond", description: "reply", parameters: { type: "object", properties: {} } }],
      onToolArguments: (call) => { if (call.name === "respond") seen.push(respondAnswerText(call.arguments)); },
    });
    assert.deepEqual(turn.toolCalls, [{ id: "call-1", name: "respond", arguments: '{"outcome":"answer","text":"你好"}' }]);
    assert.deepEqual([...new Set(seen.filter(Boolean))], ["你", "你好"]);
  } finally {
    globalThis.fetch = original;
  }
});
