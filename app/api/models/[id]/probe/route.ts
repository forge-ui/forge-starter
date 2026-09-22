import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { probeAiModel } from "@/lib/models/service";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("models", "update");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const model = await probeAiModel(id);
    return jsonOk({ model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "测连失败";
    return jsonError(message, 502);
  }
}
