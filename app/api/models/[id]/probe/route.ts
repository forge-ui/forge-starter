import { resourceWrite } from "@/lib/semantic/resource-write";
import { OperationError } from "@/lib/semantic/operations";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { probeAiModel } from "@/lib/models/service";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("models", "update");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const result = await resourceWrite(request, auth.session.id, "models", "probe", id, {}, async () => {
      try { return { model: await probeAiModel(id) }; }
      catch (error) {
        const model = error && typeof error === "object" && "model" in error ? error.model : undefined;
        if (!model) throw error;
        return { model, probeError: error instanceof Error ? error.message : "连接失败" };
      }
    });
    return jsonOk(result);
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "测连失败";
    return jsonError(message, 502);
  }
}
