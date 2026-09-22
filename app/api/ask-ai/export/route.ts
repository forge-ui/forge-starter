import { accountExportFilename, buildAccountsCsv } from "@/lib/accounts/agent";
import { accountFilterSchema } from "@/lib/accounts/input";
import { readExportToken } from "@/lib/agent/intent";
import { zodMessage } from "@/lib/agent/parse";
import { jsonError } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { requirePermission } from "@/lib/rbac/access";

export async function GET(request: Request) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  const token = new URL(request.url).searchParams.get("token")?.trim() || "";
  if (!token) return jsonError("缺少下载凭证", 400);

  try {
    const permission = await requirePermission("accounts", "read");
    if (!permission.ok) return permission.response;
    const payload = await readExportToken(token, auth.session.id);
    if (payload.toolId !== "accounts.export") return jsonError("下载链接无效", 400);
    const parsed = accountFilterSchema.safeParse(payload.args);
    if (!parsed.success) return jsonError(zodMessage(parsed.error), 400);
    const file = await buildAccountsCsv(parsed.data);
    const filename = accountExportFilename();
    return new Response(file.csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "导出失败";
    const status = message.includes("DATABASE_URL") ? 503 : 400;
    return jsonError(message, status);
  }
}
