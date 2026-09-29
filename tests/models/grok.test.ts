import assert from "node:assert/strict";
import { test } from "node:test";
import { modelProviderById, resolveProviderId } from "../../lib/models/providers";
import { probeModel, runModelChatTurn } from "../../lib/models/runtime";
import { resolveAskAiLlmConfig } from "../../lib/ask-ai-llm";

test("Grok aliases resolve to official defaults and explicit proxy settings win", (t) => {
  const keys = ["ASK_AI_LLM_PROVIDER", "ASK_AI_LLM_MODEL", "ASK_AI_LLM_BASE_URL"] as const;
  const original = keys.map((key) => process.env[key]);
  t.after(() => keys.forEach((key, index) => {
    if (original[index] === undefined) delete process.env[key];
    else process.env[key] = original[index];
  }));
  process.env.ASK_AI_LLM_MODEL = "";
  process.env.ASK_AI_LLM_BASE_URL = "";
  for (const alias of ["xai", "Grok", "x.ai", "xAI / Grok", "model_xai_provider"]) {
    process.env.ASK_AI_LLM_PROVIDER = alias;
    assert.equal(resolveProviderId(alias), "model_xai_provider");
    const config = resolveAskAiLlmConfig();
    assert.equal(config.baseUrl, "https://api.x.ai/v1");
    assert.equal(config.model, "grok-4.7");
  }
  process.env.ASK_AI_LLM_MODEL = "grok-custom";
  process.env.ASK_AI_LLM_BASE_URL = "https://proxy.example/v1";
  assert.equal(resolveAskAiLlmConfig().model, "grok-custom");
  assert.equal(resolveAskAiLlmConfig().baseUrl, "https://proxy.example/v1");
});

test("Grok probe and tool turns use authenticated Chat Completions", async (t) => {
  const provider = modelProviderById(resolveProviderId("grok"))!;
  const model = { id: "test", name: "Grok test", provider: provider.id, modelName: provider.defaultModel, apiBase: provider.defaultApiBase, apiKey: "test-only-key" };
  const requests: Array<Record<string, any>> = [];
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    assert.equal(url, "https://api.x.ai/v1/chat/completions");
    assert.equal(new Headers(init.headers).get("Authorization"), "Bearer test-only-key");
    const body = JSON.parse(init.body as string);
    requests.push(body);
    assert.equal(body.model, "grok-4.7");
    return Response.json({ choices: [{ message: body.tools ? { content: null, tool_calls: [{ id: "call-1", type: "function", function: { name: "models_list", arguments: "{}" } }] } : { content: "ok" } }] });
  });
  assert.equal(await probeModel(model), "ok");
  const turn = await runModelChatTurn(model, [{ role: "user", content: "列出模型" }], { tools: [{ name: "models_list", description: "List models", parameters: { type: "object", properties: {} } }] });
  assert.deepEqual(turn.toolCalls, [{ id: "call-1", name: "models_list", arguments: "{}" }]);
  await runModelChatTurn(model, [{ role: "assistant", content: "", toolCalls: turn.toolCalls }, { role: "tool", toolCallId: "call-1", content: "[]" }]);
  assert.equal(requests[2].messages[1].tool_call_id, "call-1");
  assert.equal(requests[1].tool_choice, "auto");
});
