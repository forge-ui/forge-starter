import { listAdminAccounts as accountsReader } from "@/lib/accounts/service";
import { accountAgentTools as accountsTools0 } from "@/lib/accounts/agent";
import { listRoles as rolesReader } from "@/lib/roles/service";
import { roleAgentTools as rolesTools0 } from "@/lib/roles/agent";
import { listMenus as menusReader } from "@/lib/menus/service";
import { menuAgentTools as menusTools0 } from "@/lib/menus/agent";
import { listPermissions as permissionsReader } from "@/lib/permissions/service";
import { permissionAgentTools as permissionsTools0 } from "@/lib/permissions/agent";
import { listAiModels as modelsReader } from "@/lib/models/service";
import { modelAgentTools as modelsTools0 } from "@/lib/models/agent";
import { appAgentTools as settingsTools0 } from "@/lib/agent/app-tools";
export { moduleDraftSchemas } from "./draft-schemas.generated";

export const moduleReaders = {
  "accounts": accountsReader,
  "roles": rolesReader,
  "menus": menusReader,
  "permissions": permissionsReader,
  "models": modelsReader,
};
export const moduleSpecializedTools = [
  ...accountsTools0,
  ...rolesTools0,
  ...menusTools0,
  ...permissionsTools0,
  ...modelsTools0,
  ...settingsTools0,
];
