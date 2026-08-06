import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { getSessionUser } from "@/lib/auth/session";
import {
  deleteSupplier,
  getSupplierById,
  updateSupplier,
} from "@/lib/suppliers/service";
import { SUPPLIER_CATEGORIES } from "@/lib/suppliers/types";

const bodySchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  contactName: z.string().optional().default(""),
  contactEmail: z.string().optional().default(""),
  contactPhone: z.string().optional().default(""),
  category: z.enum(SUPPLIER_CATEGORIES as [string, ...string[]]),
  status: z.enum(["active", "inactive", "pending"]),
  rating: z.number().int().min(1).max(5).optional().default(3),
  address: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    const { id } = await ctx.params;
    const supplier = await getSupplierById(id);
    if (!supplier) return jsonError("供应商不存在", 404);
    return jsonOk({ supplier });
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
    const existing = await getSupplierById(id);
    if (!existing) return jsonError("供应商不存在", 404);
    const supplier = await updateSupplier(id, {
      name: parsed.data.name,
      code: existing.code,
      contactName: parsed.data.contactName ?? "",
      contactEmail: parsed.data.contactEmail ?? "",
      contactPhone: parsed.data.contactPhone ?? "",
      category: parsed.data.category as (typeof SUPPLIER_CATEGORIES)[number],
      status: parsed.data.status,
      rating: parsed.data.rating ?? 3,
      address: parsed.data.address ?? "",
      notes: parsed.data.notes ?? "",
    });
    return jsonOk({ supplier });
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
    await deleteSupplier(id);
    return jsonOk({ deleted: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}
