import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { deleteAiModel, getAiModelById, updateAiModel } from "@/lib/models/service";

const bodySchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  modelName: z.string().min(1),
  apiBase: z.string().optional().default(""),
  apiKey: z.string().optional().default(""),
  status: z.enum(["active", "disabled"]),
  isDefault: z.boolean().optional().default(false),
  notes: z.string().optional().default(""),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("models", "read");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const model = await getAiModelById(id);
    if (!model) return jsonError("模型不存在", 404);
    return jsonOk({ model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("models", "update");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const model = await updateAiModel(id, parsed.data);
    return jsonOk({ model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("models", "delete");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    await deleteAiModel(id);
    return jsonOk({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}
