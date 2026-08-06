import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { getSessionUser } from "@/lib/auth/session";
import {
  cancelPurchaseOrder,
  decidePurchaseOrder,
  getPurchaseOrderById,
  markPurchaseOrdered,
} from "@/lib/purchase-orders/service";

const decideSchema = z.object({
  action: z.enum(["approve", "reject", "cancel", "mark_ordered"]),
  comment: z.string().optional().default(""),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    const { id } = await ctx.params;
    const item = await getPurchaseOrderById(id);
    if (!item) return jsonError("采购单不存在", 404);
    return jsonOk({ item, me: session.username });
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
    const parsed = decideSchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }

    const actor = {
      name: session.displayName || session.username,
      username: session.username,
    };

    let item;
    if (parsed.data.action === "approve" || parsed.data.action === "reject") {
      item = await decidePurchaseOrder(
        id,
        { action: parsed.data.action, comment: parsed.data.comment ?? "" },
        actor,
      );
    } else if (parsed.data.action === "cancel") {
      item = await cancelPurchaseOrder(id, session.username);
    } else {
      item = await markPurchaseOrdered(id, session.username);
    }
    return jsonOk({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "操作失败";
    return jsonError(message, message.includes("不存在") ? 404 : 400);
  }
}
