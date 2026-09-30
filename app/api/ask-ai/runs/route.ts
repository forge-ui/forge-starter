import { apiError, jsonError, jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { resolveAccess } from "@/lib/rbac/access";
import { harnessRequestSchema, listStarterRuns, readStarterRunProgress } from "@/lib/harness/starter";

export async function GET(request: Request) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  try {
    const access = await resolveAccess(auth.session);
    const runId = new URL(request.url).searchParams.get("runId");
    const init = { headers: { "Cache-Control": "private, no-store" } };
    if (runId !== null) {
      if (!harnessRequestSchema.shape.requestId.safeParse(runId).success) return jsonError("任务编号无效", 400);
      return jsonOk(await readStarterRunProgress(runId, auth.session.id, access), init);
    }
    return jsonOk({ runs: await listStarterRuns(auth.session.id, access) }, init);
  } catch (error) { return apiError(error, 503); }
}
