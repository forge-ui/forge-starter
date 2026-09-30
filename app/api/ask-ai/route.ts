import { APPLICATION_BUILD_ID } from "@/lib/semantic/contracts";
import { pageContextSchema, contextForPermissions } from "@/lib/semantic/context";
import { semanticEnabled } from "@/lib/semantic/operations";
import { z } from "zod";
import { ASK_AI_ENV_MODEL_ID } from "@/lib/ask-ai-types";
import { answerAskAi, peekAskAiRuntime, resolveHarnessModel } from "@/lib/ask-ai-llm";
import { answerWithHarness, harnessEnabled, harnessRequestSchema, starterSuggestions } from "@/lib/harness/starter";
import { apiError, jsonError, jsonOk } from "@/lib/auth/http";
import { requireSession } from "@/lib/auth/session";
import { resolveAccess } from "@/lib/rbac/access";

export async function GET(request: Request) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  try {
    const runtime = await peekAskAiRuntime();
    const access = await resolveAccess(auth.session);
    return jsonOk({ ...runtime, suggestions: starterSuggestions(access, new URL(request.url).searchParams.get("page") ?? ""), buildId: APPLICATION_BUILD_ID, semanticEnabled: semanticEnabled(), harnessEnabled: harnessEnabled() });
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
  continuationOperationId: z.string().uuid().optional(),
  question: z.string().trim().max(2000),
  harness: harnessRequestSchema.optional(),
  page: pageContextSchema.optional(),
  context: z.string().trim().max(200).optional(),
  modelId: z.union([z.literal(ASK_AI_ENV_MODEL_ID), z.string().uuid()]).optional(),
  history: z.array(historySchema).max(8).optional(),
}).strict().refine(data => Boolean(data.question || data.harness?.reply), "请输入问题");

export const dynamic = "force-dynamic";

function failureStatus(error: unknown) {
  return error instanceof Error && "status" in error && typeof error.status === "number" ? error.status : 502;
}

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
    const harness = parsed.data.harness;
    if (harness) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          let closed = false;
          let sent = "";
          const send = (value: unknown) => {
            if (closed || request.signal.aborted) return;
            controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));
          };
          try {
            const result = await answerWithHarness({
              ...parsed.data,
              harness,
              page: contextForPermissions(parsed.data.page, access.allowedModules),
              userId: auth.session.id,
              access,
              model: () => resolveHarnessModel(parsed.data.modelId),
              signal: request.signal,
              onText: (text) => {
                if (!text || text === sent) return;
                sent = text;
                send({ type: "text", text });
              },
            });
            send({ type: "done", ok: true, ...result });
          } catch (error) {
            const message = error instanceof Error ? error.message : "提问失败";
            if (!request.signal.aborted) send({ type: "error", error: message, status: failureStatus(error) });
          } finally {
            closed = true;
            try { controller.close(); } catch { /* already closed */ }
          }
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Accel-Buffering": "no",
        },
      });
    }
    const result = await answerAskAi({
      question: parsed.data.question,
      continuationOperationId: parsed.data.continuationOperationId,
      context: parsed.data.context,
      page: contextForPermissions(parsed.data.page, access.allowedModules),
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
    return apiError(error, 502);
  }
}
