import { getRoleById } from "@/lib/roles/service";
import { getMenuById } from "@/lib/menus/service";
import { getPermissionById } from "@/lib/permissions/service";
import { getAiModelById } from "@/lib/models/service";
import { MODULES } from "@/config/modules.generated";
import { moduleReaders } from "@/lib/modules/server.generated";
import { publicModuleRow } from "@/lib/modules/sanitize";
import type { RbacResource } from "@/lib/rbac/constants";

const readers: Record<string, () => Promise<object[]>> = moduleReaders;
const genericReaders = Object.fromEntries(MODULES.filter(module => module.draft?.adapter === "generic" && "service" in module.read).map(module => [module.id, async (id: string) => {
  const row = (await readers[module.id]()).find(row => (row as Record<string, unknown>).id === id);
  if (!row || !("service" in module.read)) return null;
  return publicModuleRow(row, module.read.fields, "sensitiveFields" in module.read ? module.read.sensitiveFields : []);
}]));
export const resourceReaders: Record<string, (id: string) => Promise<Record<string, unknown> | null>> = { ...genericReaders, roles: getRoleById, menus: getMenuById, permissions: getPermissionById, models: getAiModelById };
export type ReadbackResource = RbacResource;
