import { z } from "zod";
import {
  deleteAdminAccount,
  getAdminAccountById,
  updateAdminAccount,
} from "@/lib/accounts/service";
import { ACCOUNT_ROLES } from "@/lib/accounts/types";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { getSessionUser } from "@/lib/auth/session";

const bodySchema = z.object({
  name: z.string().min(1),
  username: z.string().min(3).optional(),
  email: z.string().email(),
  phone: z.string().min(1),
  role: z.enum(ACCOUNT_ROLES as [string, ...string[]]),
  department: z.string().min(1),
  status: z.enum(["active", "disabled", "pending", "locked"]),
  notes: z.string().optional().default(""),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
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
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    const { id } = await ctx.params;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }

    const account = await updateAdminAccount(id, {
      name: parsed.data.name,
      username: parsed.data.username ?? "",
      email: parsed.data.email,
      phone: parsed.data.phone,
      role: parsed.data.role as (typeof ACCOUNT_ROLES)[number],
      department: parsed.data.department,
      status: parsed.data.status,
      notes: parsed.data.notes ?? "",
    });
    return jsonOk({ account });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    const { id } = await ctx.params;
    await deleteAdminAccount(id);
    return jsonOk({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}
