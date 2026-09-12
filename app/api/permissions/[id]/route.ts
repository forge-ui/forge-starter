import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { RBAC_ACTIONS, RBAC_RESOURCES } from "@/lib/rbac/constants";
import {
  deletePermission,
  getPermissionById,
  updatePermission,
} from "@/lib/permissions/service";

const bodySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2).optional(),
  resource: z.enum(RBAC_RESOURCES),
  action: z.enum(RBAC_ACTIONS),
  description: z.string().optional().default(""),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const permission = await getPermissionById(id);
    if (!permission) return jsonError("权限不存在", 404);
    return jsonOk({ permission });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const permission = await updatePermission(id, {
      name: parsed.data.name,
      code: parsed.data.code ?? "",
      resource: parsed.data.resource,
      action: parsed.data.action,
      description: parsed.data.description,
    });
    return jsonOk({ permission });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    await deletePermission(id);
    return jsonOk({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}
