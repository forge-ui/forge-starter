import { getAuthMode } from "@/lib/auth/config";
import { jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { resolveAccess } from "@/lib/rbac/access";

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const access = await resolveAccess(auth.session);
  return jsonOk({
    mode: getAuthMode(),
    user: auth.session,
    role: { code: access.roleCode, name: access.roleName },
    allowedModules: access.allowedModules,
    permissions: access.permissionCodes,
  });
}
