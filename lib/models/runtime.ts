import type { ResolvedAiModel } from "./types";

function hasOpenAiCompatSuffix(base: string) {
  return (
    /\/v\d+[a-z0-9-]*$/i.test(base) ||
    /\/compatible-mode\/v\d+$/i.test(base) ||
    /\/openai$/i.test(base) ||
    /\/paas\/v\d+$/i.test(base) ||
    /\/api\/v\d+$/i.test(base)
  );
}

/** OpenAI-compatible Chat Completions URL. Bare hosts get `/v1`. */
export function chatCompletionsUrl(apiBase: string) {
  let base = apiBase.trim().replace(/\/+$/, "");
  if (!base) return "";
  if (/\/chat\/completions$/i.test(base)) return base;
  if (!hasOpenAiCompatSuffix(base)) base = `${base}/v1`;
  return `${base}/chat/completions`;
}

export type ModelToolCall = {
  id: string;
  name: string;
  arguments: string;
};

export type ModelToolDef = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export type ModelMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string; toolCalls?: ModelToolCall[] }
  | { role: "tool"; toolCallId: string; content: string };

export type ModelTurn = {
  content: string;
  toolCalls: ModelToolCall[];
};

function wireMessage(message: ModelMessage) {
  if (message.role === "tool") {
    return { role: "tool", tool_call_id: message.toolCallId, content: message.content };
  }
  if (message.role === "assistant" && message.toolCalls?.length) {
    return {
      role: "assistant",
      content: message.content || null,
      tool_calls: message.toolCalls.map((call) => ({
        id: call.id,
        type: "function",
        function: { name: call.name, arguments: call.arguments },
      })),
    };
  }
  return { role: message.role, content: message.content };
}

export async function runModelChatTurn(
  model: ResolvedAiModel,
  messages: ModelMessage[],
  options: {
    temperature?: number;
    signal?: AbortSignal;
    timeoutMs?: number;
    tools?: ModelToolDef[];
  } = {},
): Promise<ModelTurn> {
  if (!model.apiBase) throw new Error("模型没有 Chat Completions 地址");
  if (!model.apiKey) throw new Error("模型没有可用 API Key");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 45_000);
  options.signal?.addEventListener("abort", () => controller.abort(), { once: true });
  try {
    const response = await fetch(chatCompletionsUrl(model.apiBase), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${model.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model.modelName,
        temperature: options.temperature ?? 0.2,
        messages: messages.map(wireMessage),
        stream: false,
        ...(options.tools?.length
          ? {
              tools: options.tools.map((tool) => ({
                type: "function",
                function: {
                  name: tool.name,
                  description: tool.description,
                  parameters: tool.parameters,
                },
              })),
              tool_choice: "auto",
            }
          : {}),
      }),
      signal: controller.signal,
      redirect: "manual",
      cache: "no-store",
    });
    const raw = await response.text();
    const safe = raw.replaceAll(model.apiKey, "***");
    if (!response.ok) {
      throw new Error(`模型接口 ${response.status}：${safe.slice(0, 200)}`);
    }
    const result = JSON.parse(raw) as {
      choices?: Array<{
        message?: {
          content?: string | null;
          tool_calls?: Array<{
            id?: string;
            function?: { name?: string; arguments?: unknown };
          }>;
        };
      }>;
    };
    const message = result.choices?.[0]?.message;
    const content = message?.content?.trim() || "";
    const toolCalls = (message?.tool_calls ?? []).flatMap((call, index) => {
      const name = call.function?.name?.trim();
      if (!name) return [];
      const rawArgs = call.function?.arguments;
      const argumentsText =
        typeof rawArgs === "string" ? rawArgs : JSON.stringify(rawArgs ?? {});
      return [{ id: call.id?.trim() || `call-${index}`, name, arguments: argumentsText }];
    });
    if (!content && toolCalls.length === 0) throw new Error("模型没有返回正文");
    return { content, toolCalls };
  } finally {
    clearTimeout(timer);
  }
}

export async function runModelChat(
  model: ResolvedAiModel,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: { temperature?: number; signal?: AbortSignal; timeoutMs?: number } = {},
) {
  const turn = await runModelChatTurn(model, messages, options);
  if (!turn.content) throw new Error("模型没有返回正文");
  return turn.content;
}

export async function probeModel(model: ResolvedAiModel) {
  const text = await runModelChat(
    model,
    [{ role: "user", content: "只回复：ok" }],
    { temperature: 0, timeoutMs: 20_000 },
  );
  return text.slice(0, 80);
}
