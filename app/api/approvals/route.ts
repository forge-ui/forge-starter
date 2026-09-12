import { z } from "zod";
import { createApproval, listApprovals } from "@/lib/approvals/service";
import { APPROVAL_TYPES, type ApprovalFormPayload, type ApprovalType } from "@/lib/approvals/types";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";

const createSchema = z.object({
  type: z.enum(APPROVAL_TYPES as [string, ...string[]]),
  title: z.string().optional().default(""),
  form: z.object({
    type: z.enum(APPROVAL_TYPES as [string, ...string[]]),
    data: z.record(z.string(), z.string()),
  }),
});

export async function GET(request: Request) {
  try {
    const auth = await requirePermission("approvals", "read");
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");
    const status = searchParams.get("status") ?? undefined;
    const type = searchParams.get("type") ?? undefined;

    let items = await listApprovals({
      status: status as never,
      type: type as never,
    });

    if (scope === "mine") {
      items = items.filter((item) => item.applicantUsername === auth.session.username);
    } else if (scope === "todo") {
      items = items.filter(
        (item) => item.status === "pending" && item.applicantUsername !== auth.session.username,
      );
    }

    return jsonOk({ items, me: auth.session.username });
  } catch (error) {
    const message = error instanceof Error ? error.message : "加载失败";
    if (message.includes("DATABASE_URL")) {
      return jsonError("未配置 DATABASE_URL，无法读写审批数据", 503);
    }
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requirePermission("approvals", "create");
    if (!auth.ok) return auth.response;

    const json = await request.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }

    const type = parsed.data.type as ApprovalType;
    const form = {
      type: parsed.data.form.type as ApprovalType,
      data: parsed.data.form.data,
    } as ApprovalFormPayload;

    const item = await createApproval(
      { type, title: parsed.data.title ?? "", form },
      {
        name: auth.session.displayName,
        username: auth.session.username,
        email: auth.session.email,
      },
    );
    return jsonOk({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "发起失败";
    if (message.includes("DATABASE_URL")) {
      return jsonError("未配置 DATABASE_URL，无法读写审批数据", 503);
    }
    return jsonError(message, 400);
  }
}
