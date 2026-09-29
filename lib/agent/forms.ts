import { z } from "zod";
import { accountCreateSchema } from "@/lib/accounts/input";
import { ACCOUNT_ROLES, ACCOUNT_DEPARTMENTS, ACCOUNT_STATUS_META } from "@/lib/accounts/types";

// Shared by the registered tool, chat renderer and server submission boundary.
export const accountDraftSchema = accountCreateSchema.partial();
export const agentFormBlockSchema = z.object({
  type: z.literal("form"),
  formId: z.literal("accounts.create"),
  values: accountDraftSchema,
  harness: z.object({ runId: z.string().uuid(), requestId: z.string().uuid() }).strict().optional(),
}).strict();
export type AgentFormBlock = z.infer<typeof agentFormBlockSchema>;
export const accountFormFields = [
  { key: "username", label: "用户名", placeholder: "3–32 位字母、数字或下划线" },
  { key: "name", label: "姓名", placeholder: "填写姓名" },
  { key: "email", label: "邮箱", placeholder: "name@example.com", type: "email" },
  { key: "phone", label: "手机", placeholder: "填写联系手机号", type: "tel" },
  { key: "role", label: "角色", options: ACCOUNT_ROLES.map(value => ({ value, label: value })) },
  { key: "department", label: "部门", options: ACCOUNT_DEPARTMENTS.map(value => ({ value, label: value })) },
  { key: "status", label: "状态", options: Object.entries(ACCOUNT_STATUS_META).map(([value, meta]) => ({ value, label: meta.label })) },
] as const;
export function createAccountForm(values: unknown): AgentFormBlock {
  return { type: "form", formId: "accounts.create", values: accountDraftSchema.parse(values) };
}
