import { accountAgentTools } from "@/lib/accounts/agent";
import { menuAgentTools } from "@/lib/menus/agent";
import { modelAgentTools } from "@/lib/models/agent";
import { permissionAgentTools } from "@/lib/permissions/agent";
import { roleAgentTools } from "@/lib/roles/agent";
import { hasPermission, type AccessContext } from "@/lib/rbac/access";
import { agentFunctionName, type AgentTool } from "./types";

export const AGENT_TOOLS: AgentTool[] = [
  ...accountAgentTools,
  ...roleAgentTools,
  ...menuAgentTools,
  ...permissionAgentTools,
  ...modelAgentTools,
];

export function toolsForAccess(access: AccessContext) {
  return AGENT_TOOLS.filter((tool) =>
    hasPermission(access, tool.permission.resource, tool.permission.action),
  );
}

export function agentToolById(id: string) {
  return AGENT_TOOLS.find((tool) => tool.id === id) ?? null;
}

export function agentToolByFunctionName(name: string) {
  return AGENT_TOOLS.find((tool) => agentFunctionName(tool.id) === name || tool.id === name) ?? null;
}
