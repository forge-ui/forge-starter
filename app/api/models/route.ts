import { resourceWrite } from "@/lib/semantic/resource-write";
import { OperationError } from "@/lib/semantic/operations";
import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requirePermission } from "@/lib/rbac/access";
import { MODEL_PROVIDERS } from "@/lib/models/providers";
import { createAiModel, listAiModels } from "@/lib/models/service";

const bodySchema = z.object({
  name: z.string().min(1),
  provider: z.string().min(1),
  modelName: z.string().min(1),
  apiBase: z.string().optional().default(""),
  apiKey: z.string().optional().default(""),
  status: z.enum(["active", "disabled"]),
  isDefault: z.boolean().optional().default(false),
  notes: z.string().optional().default(""),
});

function dbUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return message.includes("DATABASE_URL");
}

export async function GET() {
  try {
    const auth = await requirePermission("models", "read");
    if (!auth.ok) return auth.response;
    const models = await listAiModels();
    return jsonOk({ models, providers: MODEL_PROVIDERS });
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "加载失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写模型", 503);
    }
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requirePermission("models", "create");
    if (!auth.ok) return auth.response;
    const json = await request.json();
    if (json && typeof json === "object" && "apiKey" in json === false) {
      /* keep */
    }
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "参数无效");
    }
    const result = await resourceWrite(request, auth.session.id, "models", "create", undefined, parsed.data, async () => ({ model: await createAiModel(parsed.data) }));
    return jsonOk(result, { status: 201 });
  } catch (error) {
    if (error instanceof OperationError) return jsonError(error.message, error.status);
    const message = error instanceof Error ? error.message : "创建失败";
    if (dbUnavailable(error)) {
      return jsonError("未配置 DATABASE_URL，无法读写模型", 503);
    }
    return jsonError(message, 400);
  }
}
