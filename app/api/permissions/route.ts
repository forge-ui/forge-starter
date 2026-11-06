import { resourceWrite } from "@/lib/semantic/resource-write";
import { OperationError } from "@/lib/semantic/operations";
import { createSchema as bodySchema } from "@/lib/permissions/input";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { createPermission, listPermissions } from "@/lib/permissions/service";

function dbUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return message.includes("DATABASE_URL");
}

export async function GET() {
  try {
    const auth = await requirePermission("permissions", "read");
    if (!auth.ok) return auth.response;
    const permissions = await listPermissions();
    return jsonOk({ permissions });
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "加载失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写权限数据", 503);
    }
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requirePermission("permissions", "create");
    if (!auth.ok) return auth.response;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const result = await resourceWrite(request, auth.session.id, "permissions", "create", undefined, parsed.data, async () => ({ permission: await createPermission(parsed.data) }));
    return jsonOk(result, { status: 201 });
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "创建失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写权限数据", 503);
    }
    return jsonError(message, 400);
  }
}
