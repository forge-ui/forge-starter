import { createAdminAccount, listAdminAccounts } from "@/lib/accounts/service";
import { accountCreateSchema, toAccountInput } from "@/lib/accounts/input";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";

export async function GET() {
  try {
    const auth = await requirePermission("accounts", "read");
    if (!auth.ok) return auth.response;
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
    const auth = await requirePermission("accounts", "create");
    if (!auth.ok) return auth.response;

    const json = await request.json();
    const parsed = accountCreateSchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }

    const account = await createAdminAccount(toAccountInput(parsed.data, parsed.data.username));
    return jsonOk({ account }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建失败";
    if (message.includes("DATABASE_URL")) {
      return jsonError("未配置 DATABASE_URL，无法读写账号数据", 503);
    }
    return jsonError(message, 400);
  }
}
