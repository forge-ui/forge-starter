import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { deleteRole, getRoleById, updateRole } from "@/lib/roles/service";

const bodySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2).optional(),
  description: z.string().optional().default(""),
  status: z.enum(["active", "disabled"]),
  permissionIds: z.array(z.string().uuid()).optional().default([]),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("roles", "read");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const role = await getRoleById(id);
    if (!role) return jsonError("角色不存在", 404);
    return jsonOk({ role });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("roles", "update");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const role = await updateRole(id, {
      name: parsed.data.name,
      code: parsed.data.code ?? "",
      description: parsed.data.description,
      status: parsed.data.status,
      permissionIds: parsed.data.permissionIds,
    });
    return jsonOk({ role });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("roles", "delete");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    await deleteRole(id);
    return jsonOk({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}
