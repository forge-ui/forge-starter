import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { RBAC_ACTIONS, RBAC_RESOURCES } from "@/lib/rbac/constants";
import { createPermission, listPermissions } from "@/lib/permissions/service";

const bodySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2),
  resource: z.enum(RBAC_RESOURCES),
  action: z.enum(RBAC_ACTIONS),
  description: z.string().optional().default(""),
});

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
    const permission = await createPermission(parsed.data);
    return jsonOk({ permission }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写权限数据", 503);
    }
    return jsonError(message, 400);
  }
}
