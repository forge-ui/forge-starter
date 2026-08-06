import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { getSessionUser } from "@/lib/auth/session";
import {
  createPurchaseOrder,
  listPurchaseOrders,
} from "@/lib/purchase-orders/service";
import type { PurchaseOrderStatus } from "@/lib/purchase-orders/types";

const itemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unitPriceCents: z.number().int().min(0),
});

const bodySchema = z.object({
  title: z.string().min(1),
  supplierId: z.string().uuid().nullable().optional(),
  supplierName: z.string().optional(),
  currency: z.string().optional(),
  items: z.array(itemSchema).min(1),
  reason: z.string().optional().default(""),
});

export async function GET(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") ?? "all";
    const status = searchParams.get("status") as PurchaseOrderStatus | null;

    let filter: { status?: PurchaseOrderStatus; requesterUsername?: string } = {};
    if (status) filter.status = status;
    if (scope === "mine") filter.requesterUsername = session.username;
    if (scope === "todo") filter.status = "pending";

    const items = await listPurchaseOrders(filter);
    // todo: exclude own pending for approver UX is optional — keep all pending for demo
    return jsonOk({ items, me: session.username });
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
    const item = await createPurchaseOrder(
      {
        title: parsed.data.title,
        supplierId: parsed.data.supplierId,
        supplierName: parsed.data.supplierName,
        currency: parsed.data.currency,
        items: parsed.data.items,
        reason: parsed.data.reason ?? "",
      },
      {
        name: session.displayName || session.username,
        username: session.username,
      },
    );
    return jsonOk({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    return jsonError(message, 400);
  }
}
