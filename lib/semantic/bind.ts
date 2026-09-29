import type { PageContext } from "./context";
/** Explicit scope binding precedes schema validation. Missing context is an error, never a whole-table fallback. */
export function bindPageArguments(toolId: string, input: unknown, page?: PageContext) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input;
  const args = input as Record<string, unknown>;
  if (args.scope !== "page") return args;
  if (!["accounts.list", "accounts.export", "models.list"].includes(toolId)) throw new Error("该操作不接受查询范围");
  const module = toolId.split(".")[0];
  if (!page || !page.pageId.startsWith(`${module}.`)) throw new Error("当前页面没有该模块的查询上下文");
  const { scope: _scope, ...rest } = args;
  return { ...rest, ...page.query };
}

/** Conservative deictic gate: explicit current-record requests need a selected record. */
export function needsRecordSelection(question: string, page?: PageContext) {
  return !page?.entityId && /(修改|停用|删除|启用|更新)/.test(question) && /(这条|这个|当前(这个|这条)?(账号|记录|模型))/.test(question);
}
