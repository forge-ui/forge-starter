import { resourceWrite } from "@/lib/semantic/resource-write";
import { OperationError } from "@/lib/semantic/operations";
import { updateSchema as bodySchema } from "@/lib/permissions/input";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import {
  deletePermission,
  getPermissionById,
  updatePermission,
} from "@/lib/permissions/service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("permissions", "read");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const permission = await getPermissionById(id);
    if (!permission) return jsonError("权限不存在", 404);
    return jsonOk({ permission });
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "加载失败";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("permissions", "update");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const result = await resourceWrite(request, auth.session.id, "permissions", "update", id, parsed.data, async () => ({ permission: await updatePermission(id, {
      name: parsed.data.name,
      code: parsed.data.code ?? "",
      resource: parsed.data.resource,
      action: parsed.data.action,
      description: parsed.data.description,
    }) }));
    return jsonOk(result);
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "更新失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("permissions", "delete");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const result = await resourceWrite(request, auth.session.id, "permissions", "delete", id, {}, async () => { await deletePermission(id); return { deleted: true }; });
    return jsonOk(result);
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "删除失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}
