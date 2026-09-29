import { z } from "zod";
import { accountCreateSchema } from "@/lib/accounts/input";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { hasPermission, resolveAccess } from "@/lib/rbac/access";
import { signAgentIntent } from "@/lib/agent/intent";
import { pageContextSchema } from "@/lib/semantic/context";
import { assertActiveHarness } from "@/lib/harness/starter-operations";
import { apiError } from "@/lib/auth/http";

const schema = z.object({ formId: z.literal("accounts.create"), values: accountCreateSchema, page: pageContextSchema.optional(), harness: z.object({runId:z.string().uuid(), requestId:z.string().uuid()}).strict().optional() }).strict();
export async function POST(request: Request) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const access = await resolveAccess(auth.session);
  if (!hasPermission(access, "accounts", "create") || !hasPermission(access, "accounts", "read")) return jsonError("没有权限新建账号", 403);
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("请检查表单字段", 400);
  try {
    if (parsed.data.harness) await assertActiveHarness(parsed.data.harness, auth.session.id, "accounts.create");
    const intent = await signAgentIntent(auth.session.id, "accounts.create", parsed.data.values, { page: parsed.data.page, harness: parsed.data.harness });
    return jsonOk({ intent });
  } catch (error) { return apiError(error, 400); }
}
