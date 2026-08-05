import { z } from "zod";
import {
  cancelApproval,
  decideApproval,
  getApprovalById,
} from "@/lib/approvals/service";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    const { id } = await ctx.params;
    const item = await getApprovalById(id);
    if (!item) return jsonError("审批单不存在", 404);
    return jsonOk({ item, me: session.username });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    return jsonError(message, 500);
  }
}

const decideSchema = z.object({
  action: z.enum(["approve", "reject", "cancel"]),
  comment: z.string().optional().default(""),
});

export async function POST(request: Request, ctx: Ctx) {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    const { id } = await ctx.params;
    const json = await request.json();
    const parsed = decideSchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }

    if (parsed.data.action === "cancel") {
      const item = await cancelApproval(id, session.username);
      return jsonOk({ item });
    }

    const item = await decideApproval(
      id,
      {
        action: parsed.data.action,
        comment: parsed.data.comment ?? "",
      },
      { name: session.displayName, username: session.username },
    );
    return jsonOk({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "操作失败";
    return jsonError(message, 400);
  }
}
