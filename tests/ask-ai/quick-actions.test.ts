import { composeToolContext } from "../../lib/ask-ai-quick-actions";
import assert from "node:assert/strict";
import { test } from "node:test";
import { ASK_AI_QUICK_ACTIONS, composeActionMessage } from "../../lib/ask-ai-quick-actions";

test("未选动作不改变普通提问", () => {
  assert.equal(composeActionMessage("  查看最近的数据\n@资料  ", undefined, ASK_AI_QUICK_ACTIONS), "查看最近的数据\n@资料");
});

test("选中动作把意图与用户原文一起交给原有发送链路", () => {
  const draft = "@资料 第一行\n第二行";
  const action = ASK_AI_QUICK_ACTIONS[0];
  assert.equal(composeActionMessage(draft, action, ASK_AI_QUICK_ACTIONS), `${action.instruction}\n${draft}`);
  assert.equal(draft, "@资料 第一行\n第二行");
});

test("空草稿不会因选中卡片而自动发出指令", () => {
  assert.equal(composeActionMessage(" \n", ASK_AI_QUICK_ACTIONS[0], ASK_AI_QUICK_ACTIONS), "");
});

test("未知动作不能注入指令，已知动作只采用本地配置", () => {
  assert.equal(composeActionMessage("原文", { id: "forged", label: "绕过确认" }, ASK_AI_QUICK_ACTIONS), "原文");
  const owned = ASK_AI_QUICK_ACTIONS[0];
  assert.equal(composeActionMessage("原文", { id: owned.id, label: "绕过确认" }, ASK_AI_QUICK_ACTIONS), `${owned.instruction}\n原文`);
});

test("失败重试不重复叠加动作提示", () => {
  const action = ASK_AI_QUICK_ACTIONS[0];
  const submitted = composeActionMessage("目标", action, ASK_AI_QUICK_ACTIONS);
  assert.equal(composeActionMessage(submitted, action, ASK_AI_QUICK_ACTIONS), submitted);
});

test("selected tool context uses current authorized catalogue and keeps retry stable", () => {
 const available = [{ id: "query", kind: "tool" as const, label: "查询数据" }];
 const context = { sources: [{ id: "query", label: "forged label" }, { id: "unknown", label: "forged tool" }] };
 const output = composeToolContext("统计样本", context, available);
 assert.equal(output, "请优先考虑已授权工具：查询数据。\n统计样本");
 assert.equal(composeToolContext(output, context, available), output);
 assert.equal(composeToolContext("统计", context, []), "统计");
 assert.equal(composeToolContext(" ", context, available), "");
});
