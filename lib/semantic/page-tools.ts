import { getAiModelById } from "@/lib/models/service";
import { resolveProviderId } from "@/lib/models/providers";
import { z } from "zod";
import { accountFilterSchema } from "@/lib/accounts/input";
import { toolParameters } from "./schema";
import type { AgentTool } from "@/lib/agent/types";
const accountPageFilter = accountFilterSchema.omit({ scope: true });
const modelFilter = z.object({ provider: z.string().max(80).transform(resolveProviderId).optional(), query: z.string().max(80).optional(), modelType: z.enum(["LLM"]).optional() }).strict();
const openModel = z.object({ id: z.string().uuid() }).strict();
async function resolveModel(args: unknown) {
  const { id } = openModel.parse(args);
  const model = await getAiModelById(id);
  if (!model) throw new Error("模型不存在，请先调用 models.list 查询真实编号");
  return model;
}
export const pageTools: AgentTool[] = [
  { id: "accounts.filter", mode: "write", permission: { resource: "accounts", action: "read" }, description: "设置账号列表筛选，不修改业务数据。", schema: accountPageFilter, parameters: toolParameters(accountPageFilter),
    async describe(args) { const data = accountPageFilter.parse(args); return { title: "筛选账号列表", body: JSON.stringify(data), actionLabel: "应用筛选" }; },
    async fill(args) { const data = accountPageFilter.parse(args); return { formId: "accounts", mode: "filter", href: "/accounts/", fields: Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) as Record<string, string> }; } },
  { id: "models.filter", mode: "write", permission: { resource: "models", action: "read" }, description: "设置模型工作台供应商或名称筛选，不修改模型配置。", schema: modelFilter, parameters: toolParameters(modelFilter),
    async describe(args) { return { title: "筛选模型", body: JSON.stringify(modelFilter.parse(args)), actionLabel: "应用筛选" }; },
    async fill(args) { return { formId: "models", mode: "filter", href: "/models/", fields: modelFilter.parse(args) as Record<string, string> }; } },
  { id: "models.open", mode: "write", permission: { resource: "models", action: "read" }, description: "用 models.list 返回的真实 id 打开模型详情。", schema: openModel, parameters: toolParameters(openModel),
    async describe(args) { const model = await resolveModel(args); return { title: "打开模型详情", body: `查看模型「${model.name}」的详情。`, actionLabel: "打开详情" }; },
    async fill(args) { const model = await resolveModel(args); return { formId: "models", mode: "open", href: "/models/", recordId: model.id, fields: {} }; } },
];
