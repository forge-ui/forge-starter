import { writeWithReceipt, expectedRevision } from "@/lib/semantic/write-api";
import { OperationError } from "@/lib/semantic/operations";
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

    const revision = expectedRevision(request);
    const output = await writeWithReceipt(request, auth.session.id, "accounts.update", id, parsed.data, async (tx) => {
      const account = await updateAdminAccount(id, toAccountInput(parsed.data, parsed.data.username ?? ""), revision, tx);
      return { entityId: account.id, revision: account.revision, result: { account } };
    });
    return jsonOk(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新失败";
    return jsonError(message, error instanceof OperationError ? error.status : message.includes("不存在") ? 404 : 400);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  try {
    const auth = await requirePermission("accounts", "delete");
    if (!auth.ok) return auth.response;
    const { id } = await ctx.params;
    const revision = expectedRevision(request);
    const output = await writeWithReceipt(request, auth.session.id, "accounts.delete", id, {}, async (tx) => {
      await deleteAdminAccount(id, revision, tx);
      return { entityId: id, result: { deleted: true } };
    });
    return jsonOk(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return jsonError(message, error instanceof OperationError ? error.status : message.includes("不存在") ? 404 : 400);
  }
}
