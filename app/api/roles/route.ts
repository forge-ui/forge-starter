import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { createRole, listRoles } from "@/lib/roles/service";

const bodySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2),
  description: z.string().optional().default(""),
  status: z.enum(["active", "disabled"]),
  permissionIds: z.array(z.string().uuid()).optional().default([]),
});

function dbUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return message.includes("DATABASE_URL");
}

export async function GET() {
  try {
    const auth = await requireSession();
    if (!auth.ok) return auth.response;
    const roles = await listRoles();
    return jsonOk({ roles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写角色数据", 503);
    }
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return auth.response;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const role = await createRole({
      name: parsed.data.name,
      code: parsed.data.code,
      description: parsed.data.description,
      status: parsed.data.status,
      permissionIds: parsed.data.permissionIds,
    });
    return jsonOk({ role }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写角色数据", 503);
    }
    return jsonError(message, 400);
  }
}
