import assert from "node:assert/strict";
import { test } from "node:test";
import {
  EXPENSE_OPENUI_PROGRAM,
  EXPENSE_OPENUI_TRIGGER,
  cumulativeOpenUiChunks,
  extractOpenUiLang,
  isExpenseOpenUiQuestion,
} from "../../lib/openui/expense-demo";
import { expenseOpenUiRenderable, expenseOpenUiSystemPrompt } from "../../lib/openui/expense-server";

test("报销触发语认 openui 和报销，不认普通账号问题", () => {
  assert.equal(isExpenseOpenUiQuestion(EXPENSE_OPENUI_TRIGGER), true);
  assert.equal(isExpenseOpenUiQuestion("  用 openui 展示报销结果 "), true);
  assert.equal(isExpenseOpenUiQuestion("现在账号状态怎么样？"), false);
  assert.equal(isExpenseOpenUiQuestion("用 OpenUI 画一张地图"), false);
});

test("内置报销程序能被 OpenUI 1.0 解析器接受", () => {
  assert.equal(expenseOpenUiRenderable(EXPENSE_OPENUI_PROGRAM), true);
  assert.equal(expenseOpenUiRenderable("root = Unknown()"), false);
  assert.equal(expenseOpenUiRenderable("你好"), false);
});

test("围栏和前文会被剥掉，流式片段最后一项是全文", () => {
  const wrapped = "说明如下\n```openui\nroot = ExpenseResult([card])\ncard = ExpenseCard(\"a\", \"b\", \"c\", \"pending\", \"d\")\n```";
  assert.equal(extractOpenUiLang(wrapped).startsWith("root = ExpenseResult"), true);
  const chunks = cumulativeOpenUiChunks(EXPENSE_OPENUI_PROGRAM);
  assert.equal(chunks.at(-1)?.includes("ExpenseResult"), true);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((chunk, index) => index === 0 || chunk.startsWith(chunks[index - 1]!)));
});

test("提示词来自组件库，并禁止走外部网关", () => {
  const prompt = expenseOpenUiSystemPrompt();
  assert.match(prompt, /ExpenseCard/);
  assert.match(prompt, /ExpenseTable/);
  assert.match(prompt, /ExpenseResult/);
  assert.match(prompt, /不要调用工具或外部网关/);
  assert.doesNotMatch(prompt, /THESYS_API_KEY/);
});
