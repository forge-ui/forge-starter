import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { deleteMenu, getMenuById, updateMenu } from "@/lib/menus/service";

const bodySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2).optional(),
  path: z.string().min(1),
  parentId: z.string().uuid().nullable().optional(),
  sort: z.number().int().min(0).max(9999),
  status: z.enum(["active", "disabled"]),
  description: z.string().optional().default(""),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("menus", "read");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const menu = await getMenuById(id);
    if (!menu) return jsonError("菜单不存在", 404);
    return jsonOk({ menu });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("menus", "update");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const menu = await updateMenu(id, {
      name: parsed.data.name,
      code: parsed.data.code ?? "",
      path: parsed.data.path,
      parentId: parsed.data.parentId ?? null,
      sort: parsed.data.sort,
      status: parsed.data.status,
      description: parsed.data.description,
    });
    return jsonOk({ menu });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("menus", "delete");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    await deleteMenu(id);
    return jsonOk({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}
