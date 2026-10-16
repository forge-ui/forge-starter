import { getRoleById } from "@/lib/roles/service";
import { getMenuById } from "@/lib/menus/service";
import { getPermissionById } from "@/lib/permissions/service";
import { getAiModelById } from "@/lib/models/service";
export const resourceReaders = { roles: getRoleById, menus: getMenuById, permissions: getPermissionById, models: getAiModelById };
export type ReadbackResource = keyof typeof resourceReaders;
