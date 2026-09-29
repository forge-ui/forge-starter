import { verifyOperation } from "@/lib/semantic/verify";
import { z } from "zod";
import { requireSession } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { hasPermission, resolveAccess } from "@/lib/rbac/access";
import { acknowledgeOperation, readOperation, semanticEnabled } from "@/lib/semantic/operations";
import { agentToolById } from "@/lib/agent/registry";
import { recordPageCancellation } from "@/lib/harness/starter-operations";
type Ctx = { params: Promise<{ id: string }> };
async function authorize(ctx: Ctx) {
  const auth = await requireSession();
  if (!auth.ok) return auth;
  if (!semanticEnabled()) return { ok: false as const, response: jsonError("功能未启用", 404) };
  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) return { ok: false as const, response: jsonError("操作标识无效", 400) };
  const row = await readOperation(id, auth.session.id);
  const tool = agentToolById(row.actionId);
  const access = await resolveAccess(auth.session);
  if (!tool || !hasPermission(access, tool.permission.resource, tool.permission.action)) return { ok: false as const, response: jsonError("没有权限", 403) };
  return { ok: true as const, row, userId: auth.session.id };
}
export async function GET(_request: Request, ctx: Ctx) {
  try {
    const auth = await authorize(ctx);
    if (!auth.ok) return auth.response;
    const receipt = await verifyOperation(auth.row.id, auth.userId);
    return jsonOk({ operation: { id: auth.row.id, state: receipt?.status ?? auth.row.state, receipt: receipt ?? auth.row.receipt, expired: auth.row.expiresAt < new Date() } });
  } catch { return jsonError("操作不存在", 404); }
}
export async function POST(request: Request, ctx: Ctx) {
  try {
    const auth = await authorize(ctx);
    if (!auth.ok) return auth.response;
    const input = z.object({ state: z.enum(["awaiting-save", "cancelled"]) }).strict().parse(await request.json());
    await acknowledgeOperation(auth.row.id, auth.userId, input.state);
    if (input.state === "cancelled") await recordPageCancellation(auth.row.id, auth.userId);
    return jsonOk({ acknowledged: true });
  } catch { return jsonError("无法更新操作", 400); }
}
