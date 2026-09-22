import {
  deleteAdminAccount,
  getAdminAccountById,
  updateAdminAccount,
} from "@/lib/accounts/service";
import { accountPatchSchema, toAccountInput } from "@/lib/accounts/input";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("accounts", "read");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const account = await getAdminAccountById(id);
    if (!account) return jsonError("账号不存在", 404);
    return jsonOk({ account });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("accounts", "update");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const json = await request.json();
    const parsed = accountPatchSchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }

    const account = await updateAdminAccount(
      id,
      toAccountInput(parsed.data, parsed.data.username ?? ""),
    );
    return jsonOk({ account });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("accounts", "delete");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    await deleteAdminAccount(id);
    return jsonOk({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}
