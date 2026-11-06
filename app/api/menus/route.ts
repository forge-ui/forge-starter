import { resourceWrite } from "@/lib/semantic/resource-write";
import { OperationError } from "@/lib/semantic/operations";
import { createSchema as bodySchema } from "@/lib/menus/input";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { createMenu, listMenus } from "@/lib/menus/service";

function dbUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return message.includes("DATABASE_URL");
}

export async function GET() {
  try {
    const auth = await requirePermission("menus", "read");
    if (!auth.ok) return auth.response;
    const menus = await listMenus();
    return jsonOk({ menus });
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "加载失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写菜单数据", 503);
    }
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requirePermission("menus", "create");
    if (!auth.ok) return auth.response;
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const result = await resourceWrite(request, auth.session.id, "menus", "create", undefined, parsed.data, async () => ({ menu: await createMenu({
      name: parsed.data.name,
      code: parsed.data.code,
      path: parsed.data.path,
      parentId: parsed.data.parentId ?? null,
      sort: parsed.data.sort,
      status: parsed.data.status,
      description: parsed.data.description,
    }) }));
    return jsonOk(result, { status: 201 });
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "创建失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写菜单数据", 503);
    }
    return jsonError(message, 400);
  }
}
