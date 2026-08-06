import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { getSessionUser } from "@/lib/auth/session";
import {
  createSupplier,
  ensureSupplierSeed,
  listSuppliers,
} from "@/lib/suppliers/service";
import { SUPPLIER_CATEGORIES } from "@/lib/suppliers/types";

const bodySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2),
  contactName: z.string().optional().default(""),
  contactEmail: z.string().optional().default(""),
  contactPhone: z.string().optional().default(""),
  category: z.enum(SUPPLIER_CATEGORIES as [string, ...string[]]),
  status: z.enum(["active", "inactive", "pending"]),
  rating: z.number().int().min(1).max(5).optional().default(3),
  address: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    await ensureSupplierSeed();
    const suppliers = await listSuppliers();
    return jsonOk({ suppliers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    if (message.includes("DATABASE_URL")) {
      return jsonError("未配置 DATABASE_URL", 503);
    }
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const supplier = await createSupplier({
      ...parsed.data,
      category: parsed.data.category as (typeof SUPPLIER_CATEGORIES)[number],
      status: parsed.data.status,
      rating: parsed.data.rating ?? 3,
    });
    return jsonOk({ supplier }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    return jsonError(message, 400);
  }
}
