import { apiError, jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { resolveAccess } from "@/lib/rbac/access";
import { listStarterRuns } from "@/lib/harness/starter";

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  try {
    const access = await resolveAccess(auth.session);
    return jsonOk({ runs: await listStarterRuns(auth.session.id, access) });
  } catch (error) { return apiError(error, 503); }
}
