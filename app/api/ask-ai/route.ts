import { z } from "zod";
import { ASK_AI_ENV_MODEL_ID } from "@/lib/ask-ai-types";
import { answerAskAi, peekAskAiRuntime } from "@/lib/ask-ai-llm";
import { jsonError, jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { resolveAccess } from "@/lib/rbac/access";

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  try {
    const runtime = await peekAskAiRuntime();
    return jsonOk(runtime);
  } catch (error) {
    const message = error instanceof Error ? error.message : "无法读取模型";
    return jsonError(message, 500);
  }
}

const historySchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
}).strict();

const bodySchema = z.object({
  question: z.string().trim().min(1).max(2000),
  context: z.string().trim().max(200).optional(),
  modelId: z.union([z.literal(ASK_AI_ENV_MODEL_ID), z.string().uuid()]).optional(),
  history: z.array(historySchema).max(8).optional(),
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
  if (!parsed.success) {
    return jsonError("请输入问题", 400);
  }

  try {
    const access = await resolveAccess(auth.session);
    const result = await answerAskAi({
      question: parsed.data.question,
      context: parsed.data.context,
      modelId: parsed.data.modelId,
      history: parsed.data.history,
      signal: request.signal,
      userId: auth.session.id,
      access,
    });
    return jsonOk(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "提问失败";
    if (request.signal.aborted) {
      return jsonError("已取消", 400);
    }
    return jsonError(message, 502);
  }
}
