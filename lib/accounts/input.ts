import { z } from "zod";
import type { AccountInput, AccountRole, AccountStatus } from "./types";

const accountRoles = ["超级管理员", "运营", "审计", "只读"] as const satisfies readonly AccountRole[];
const accountStatuses = ["active", "disabled", "pending", "locked"] as const satisfies readonly AccountStatus[];

const accountFields = {
  name: z.string().trim().min(1, "请填写姓名"),
  email: z.string().trim().email("邮箱格式不正确"),
  phone: z.string().trim().min(1, "请填写手机号"),
  role: z.enum(accountRoles),
  department: z.string().trim().min(1, "请填写部门"),
  status: z.enum(accountStatuses),
  notes: z.string().optional().default(""),
};

export const accountCreateSchema = z.object({
  ...accountFields,
  username: z.string().trim().min(3, "用户名至少 3 位"),
}).strict();

export const accountPatchSchema = z.object({
  ...accountFields,
  username: z.string().trim().min(3, "用户名至少 3 位").optional(),
}).strict();

export const accountUpdateToolSchema = accountPatchSchema.extend({
  id: z.string().uuid("账号 id 无效"),
}).strict();

export const accountIdSchema = z.object({
  id: z.string().uuid("账号 id 无效"),
}).strict();

export const accountFilterSchema = z.object({
  query: z.string().trim().max(80).optional(),
  status: z.enum(accountStatuses).optional(),
  role: z.enum(accountRoles).optional(),
}).strict();

export type AccountFilter = z.infer<typeof accountFilterSchema>;

export function toAccountInput(
  data: z.infer<typeof accountCreateSchema> | z.infer<typeof accountPatchSchema>,
  username: string,
): AccountInput {
  return {
    name: data.name,
    username,
    email: data.email,
    phone: data.phone,
    role: data.role,
    department: data.department,
    status: data.status,
    notes: data.notes ?? "",
  };
}
