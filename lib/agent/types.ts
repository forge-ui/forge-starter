import type { RbacAction, RbacResource } from "@/lib/rbac/constants";
import type { z } from "zod";

export type AgentTableBlock = {
  type: "table";
  title: string;
  columns: Array<{ key: string; label: string }>;
  rows: Array<Record<string, string>>;
};

export type AgentFormFill = {
  formId: "accounts";
  mode: "create" | "edit" | "delete";
  href: string;
  recordId?: string;
  fields: Record<string, string>;
};

export type AgentConfirmBlock = {
  type: "confirm";
  intent: string;
  title: string;
  body: string;
  actionLabel: string;
};

export type AgentDownloadBlock = {
  type: "download";
  href: string;
  label: string;
  filename: string;
};

export type AgentBlock = AgentTableBlock | AgentConfirmBlock | AgentDownloadBlock;

export type AgentToolOutput = {
  /** 回给模型的短事实，不要塞密钥或整文件。 */
  summary: string;
  blocks?: AgentBlock[];
  /** 写入不落库，交给页面表单或页面上的删除确认。 */
  fill?: AgentFormFill;
};

export type AgentToolContext = {
  userId: string;
};

type AgentToolBase = {
  id: string;
  description: string;
  permission: { resource: RbacResource; action: RbacAction };
  parameters: Record<string, unknown>;
  schema: z.ZodType;
};

export type AgentReadTool = AgentToolBase & {
  mode: "read";
  run: (args: unknown, ctx: AgentToolContext) => Promise<AgentToolOutput>;
};

export type AgentWriteTool = AgentToolBase & {
  mode: "write";
  describe: (args: unknown) => Promise<{ title: string; body: string; actionLabel: string }>;
  /** 校验后返回要填进页面的字段，不调用 service 写库。 */
  fill: (args: unknown) => Promise<AgentFormFill>;
};

export type AgentTool = AgentReadTool | AgentWriteTool;

export const AGENT_LIST_LIMIT = 50;
export const AGENT_TABLE_LIMIT = 20;
export const AGENT_EXPORT_LIMIT = 5000;
export const AGENT_LOOP_LIMIT = 6;

export function agentFunctionName(id: string) {
  return id.replaceAll(".", "_");
}
