import { moduleSpecializedTools } from "@/lib/modules/server.generated";
import { genericModuleTools } from "@/lib/modules/tools";
import { personalAgentTools } from "./personal-tools";
import { resourceAgentTools } from "./resource-tools";
import { presentationTools } from "./presentation-tool";
import { pageTools } from "@/lib/semantic/page-tools";
import { navigationTools } from "./navigation-tools";
import { pageEntryTools } from "./page-entry-tools";
import { hasPermission, type AccessContext } from "@/lib/rbac/access";
import { agentFunctionName, type AgentTool } from "./types";

export const AGENT_TOOLS: AgentTool[] = [
  ...presentationTools,
  ...pageTools,
  ...navigationTools,
  ...pageEntryTools.filter(tool => {
    const draftId = tool.id.replace(/create_form$/, "create").replace(/edit_form$/, "update");
    return ![...resourceAgentTools, ...moduleSpecializedTools, ...genericModuleTools].some(draft => draft.id === draftId);
  }),
  ...resourceAgentTools,
  ...personalAgentTools,
  ...moduleSpecializedTools,
  ...genericModuleTools,
];

export function toolsForAccess(access: AccessContext, tools: readonly AgentTool[] = AGENT_TOOLS) {
  return tools.filter((tool) =>
    hasPermission(access, tool.permission.resource, "read") &&
    hasPermission(access, tool.permission.resource, tool.permission.action),
  );
}

export function agentToolById(id: string) {
  return AGENT_TOOLS.find((tool) => tool.id === id) ?? null;
}

export function agentToolByFunctionName(name: string) {
  return AGENT_TOOLS.find((tool) => agentFunctionName(tool.id) === name || tool.id === name) ?? null;
}
