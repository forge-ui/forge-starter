import { z } from "zod";
import { executeConfirmedIntent } from "@/lib/agent/confirm";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { resolveAccess } from "@/lib/rbac/access";

const bodySchema = z.object({
  intent: z.string().trim().min(20).max(8000),
}).strict();

export async function POST(request: Request) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jsonError("请求体无效", 400);
  }
  if (json && typeof json === "object" && "apiKey" in json) {
    return jsonError("不要把模型密钥放进请求体", 400);
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return jsonError("确认单无效", 400);

  try {
    const access = await resolveAccess(auth.session);
    const output = await executeConfirmedIntent(parsed.data.intent, auth.session.id, access);
    return jsonOk({
      text: output.summary,
      live: true,
      blocks: output.blocks ?? [],
      ...(output.fill ? { fill: output.fill } : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "写入失败";
    const status = message.includes("没有权限") ? 403 : 400;
    return jsonError(message, status);
  }
}
