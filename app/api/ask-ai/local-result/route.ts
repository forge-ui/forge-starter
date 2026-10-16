import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { localAppSchema } from "@/lib/agent/app-fields";
import { commitOperation, OperationError, readOperation } from "@/lib/semantic/operations";
const schema = z.object({ operationId: z.string().uuid(), entityId: z.string().min(1).max(120), record: localAppSchema.nullable() }).strict();
/** Records a browser acknowledgement, never certifies a server business write. */
export async function POST(request: Request) {
  try {
    const auth = await requirePermission("settings", "update");
    if (!auth.ok) return auth.response;
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return jsonError("本地应用回执参数无效");
    const { operationId, entityId, record } = parsed.data;
    const operation = await readOperation(operationId, auth.session.id);
    if (!["settings.create", "settings.update", "settings.delete"].includes(operation.actionId)) return jsonError("操作不属于应用配置", 403);
    if (operation.actionId.endsWith(".delete") ? record !== null : !record || record.id !== entityId) return jsonError("应用回执与操作不匹配");
    const receipt = await commitOperation({ id: operationId, userId: auth.session.id, actionId: operation.actionId, entityId: operation.actionId.endsWith(".create") ? undefined : entityId, confirmed: true, payload: { entityId, record } }, async () => ({ entityId, result: { storage: "browser-local", browserReported: true, record } }));
    return jsonOk({ receipt });
  } catch (error) { return jsonError(error instanceof Error ? error.message : "记录本地结果失败", error instanceof OperationError ? error.status : 400); }
}
