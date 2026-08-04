import { z } from "zod";
import { createAdminAccount, listAdminAccounts } from "@/lib/accounts/service";
import { ACCOUNT_ROLES } from "@/lib/accounts/types";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { getSessionUser } from "@/lib/auth/session";

const bodySchema = z.object({
  name: z.string().min(1),
  username: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(1),
  role: z.enum(ACCOUNT_ROLES as [string, ...string[]]),
  department: z.string().min(1),
  status: z.enum(["active", "disabled", "pending", "locked"]),
  notes: z.string().optional().default(""),
});

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) return jsonError("未登录", 401);
    const accounts = await listAdminAccounts();
    return jsonOk({ accounts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    if (message.includes("DATABASE_URL")) {
      return jsonError("未配置 DATABASE_URL，无法读写账号数据", 503);
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

    const account = await createAdminAccount({
      name: parsed.data.name,
      username: parsed.data.username,
      email: parsed.data.email,
      phone: parsed.data.phone,
      role: parsed.data.role as (typeof ACCOUNT_ROLES)[number],
      department: parsed.data.department,
      status: parsed.data.status,
      notes: parsed.data.notes ?? "",
    });
    return jsonOk({ account }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    if (message.includes("DATABASE_URL")) {
      return jsonError("未配置 DATABASE_URL，无法读写账号数据", 503);
    }
    return jsonError(message, 400);
  }
}
