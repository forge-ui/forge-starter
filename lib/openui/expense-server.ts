import { createParser } from "@openuidev/react-lang";
import { EXPENSE_OPENUI_PROGRAM } from "./expense-demo";
import { createExpenseLibrary } from "./expense-library";

const library = createExpenseLibrary({
  card: () => null,
  table: () => null,
});

/** 与 open-intelligent-ui 的 generateSystemPrompt 同一条提示词路径，不走 Cloud 网关。 */
export function expenseOpenUiSystemPrompt() {
  return library.prompt({
    preamble: "你是 Forge Starter 的报销结果演示。只输出 OpenUI Lang，不要 Markdown，不要解释，不要调用工具或外部网关。",
    additionalRules: [
      "根节点必须是 ExpenseResult，里面先放 ExpenseCard，再放 ExpenseTable。",
      "即使用户只给出触发语，也输出一笔完整的差旅报销示例，不要追问。",
      "状态只能是 approved、pending 或 rejected。",
    ],
    examples: [EXPENSE_OPENUI_PROGRAM],
    toolCalls: false,
    bindings: false,
    builtinFunctions: false,
  });
}

export function expenseOpenUiRenderable(lang: string) {
  const result = createParser(library.toJSONSchema(), library.root).parse(lang);
  const fatal = result.meta.errors.some((error) => error.severity !== "warning");
  return Boolean(result.root) && !fatal;
}
