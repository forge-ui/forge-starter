import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { createMenu, listMenus } from "@/lib/menus/service";

const bodySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(2),
  path: z.string().min(1),
  parentId: z.string().uuid().nullable().optional(),
  sort: z.number().int().min(0).max(9999),
  status: z.enum(["active", "disabled"]),
  description: z.string().optional().default(""),
});

function dbUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return message.includes("DATABASE_URL");
}

export async function GET() {
  try {
    const auth = await requireSession();
    if (!auth.ok) return auth.response;
    const menus = await listMenus();
    return jsonOk({ menus });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写菜单数据", 503);
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
    const menu = await createMenu({
      name: parsed.data.name,
      code: parsed.data.code,
      path: parsed.data.path,
      parentId: parsed.data.parentId ?? null,
      sort: parsed.data.sort,
      status: parsed.data.status,
      description: parsed.data.description,
    });
    return jsonOk({ menu }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写菜单数据", 503);
    }
    return jsonError(message, 400);
  }
}
