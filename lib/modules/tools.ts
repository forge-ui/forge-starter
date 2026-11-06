import { MODULES } from "@/config/modules.generated";
import { requirePermission } from "@/lib/rbac/access";
import type { RbacResource } from "@/lib/rbac/constants";
import type { AgentToolContext } from "@/lib/agent/types";
import { moduleReaders, moduleSpecializedTools, moduleDraftSchemas } from "./server.generated";
import { moduleDraftTools } from "./draft-tools";
import { moduleReadTools } from "./read-tools";

const readers = Object.fromEntries(Object.entries(moduleReaders).map(([id, read]) => [id, async (context: AgentToolContext) => {
  const auth = await requirePermission(id as RbacResource, "read");
  if (!auth.ok || auth.session.id !== context.userId) throw new Error("没有权限查询此模块");
  return read();
}]));
const specialized = new Set(moduleSpecializedTools.map(tool => tool.id));
const draftReaders = Object.fromEntries(Object.entries(moduleReaders).map(([id, read]) => [id, async () => {
  const auth = await requirePermission(id as RbacResource, "read");
  if (!auth.ok) throw new Error("没有权限查询此模块");
  return read();
}]));
export const genericModuleTools = [
  ...moduleReadTools(MODULES, readers),
  ...moduleDraftTools(MODULES, moduleDraftSchemas, draftReaders),
].filter(tool => !specialized.has(tool.id));
