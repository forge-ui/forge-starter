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
  const url = new URL(apiBase.trim());
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.hash) {
    throw new Error("模型地址必须是无凭据和片段的 HTTP(S) URL");
  }
  let path = url.pathname.replace(/\/+$/, "");
  if (!/\/chat\/completions$/i.test(path)) {
    if (!hasOpenAiCompatSuffix(path)) path = `${path}/v1`;
    path = `${path}/chat/completions`;
  }
  url.pathname = path;
  return url.href;
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

export type ModelToolArgumentUpdate = {
  index: number;
  id: string;
  name: string;
  arguments: string;
};

type ChatPayload = {
  choices?: Array<{
    message?: {
      content?: string | null;
      tool_calls?: Array<{
        index?: number;
        id?: string;
        function?: { name?: string; arguments?: unknown };
      }>;
    };
    delta?: {
      content?: string | null;
      tool_calls?: Array<{
        index?: number;
        id?: string;
        function?: { name?: string; arguments?: string };
      }>;
    };
  }>;
  error?: { message?: string };
};

function toolArgumentsText(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value ?? {});
}

function turnFromCalls(
  content: string,
  calls: Map<number, { id?: string; name?: string; arguments: string }>,
): ModelTurn {
  const toolCalls = [...calls.entries()]
    .sort(([left], [right]) => left - right)
    .flatMap(([index, call]) => {
      const name = call.name?.trim();
      if (!name) return [];
      return [{ id: call.id?.trim() || `call-${index}`, name, arguments: call.arguments }];
    });
  return { content: content.trim(), toolCalls };
}

function applyToolCall(
  calls: Map<number, { id?: string; name?: string; arguments: string }>,
  call: { index?: number; id?: string; function?: { name?: string; arguments?: unknown } },
  onToolArguments?: (call: ModelToolArgumentUpdate) => void,
) {
  const index = call.index ?? 0;
  const current = calls.get(index) ?? { arguments: "" };
  if (call.id) current.id = call.id;
  if (call.function?.name) current.name = `${current.name ?? ""}${call.function.name}`;
  if (call.function?.arguments != null && call.function.arguments !== "") {
    current.arguments += toolArgumentsText(call.function.arguments);
  }
  calls.set(index, current);
  const name = current.name?.trim();
  if (name && onToolArguments) {
    onToolArguments({ index, id: current.id?.trim() || `call-${index}`, name, arguments: current.arguments });
  }
}

function parseChatJson(raw: string, onToolArguments?: (call: ModelToolArgumentUpdate) => void): ModelTurn {
  const result = JSON.parse(raw) as ChatPayload;
  if (result.error?.message) throw new Error(result.error.message);
  const message = result.choices?.[0]?.message;
  const calls = new Map<number, { id?: string; name?: string; arguments: string }>();
  for (const [index, call] of (message?.tool_calls ?? []).entries()) {
    applyToolCall(calls, { ...call, index: call.index ?? index }, onToolArguments);
  }
  return turnFromCalls(message?.content ?? "", calls);
}

async function readModelTurn(
  response: Response,
  onToolArguments?: (call: ModelToolArgumentUpdate) => void,
  onText?: (text: string) => void,
): Promise<ModelTurn> {
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return parseChatJson(await response.text(), onToolArguments);
  const reader = response.body?.getReader();
  if (!reader) return parseChatJson(await response.text(), onToolArguments);
  const decoder = new TextDecoder();
  const first = await reader.read();
  if (first.done) throw new Error("模型没有返回正文");
  let pending = decoder.decode(first.value, { stream: true });
  if (pending.trimStart().startsWith("{")) {
    let raw = pending;
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      raw += decoder.decode(next.value, { stream: true });
    }
    raw += decoder.decode();
    return parseChatJson(raw, onToolArguments);
  }
  const calls = new Map<number, { id?: string; name?: string; arguments: string }>();
  let content = "";
  const consume = (block: string) => {
    for (const line of block.split(/\r?\n/)) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      const payload = JSON.parse(data) as ChatPayload;
      if (payload.error?.message) throw new Error(payload.error.message);
      const choice = payload.choices?.[0];
      if (typeof choice?.delta?.content === "string") {
        content += choice.delta.content;
        if (content.trimStart()) onText?.(content.trimStart());
      }
      for (const call of choice?.delta?.tool_calls ?? []) applyToolCall(calls, call, onToolArguments);
      if (!choice?.delta && choice?.message) {
        if (typeof choice.message.content === "string") content = choice.message.content;
        for (const [index, call] of (choice.message.tool_calls ?? []).entries()) {
          applyToolCall(calls, { ...call, index: call.index ?? index }, onToolArguments);
        }
      }
    }
  };
  while (true) {
    const splitAt = pending.lastIndexOf("\n");
    if (splitAt >= 0) {
      consume(pending.slice(0, splitAt + 1));
      pending = pending.slice(splitAt + 1);
    }
    const next = await reader.read();
    if (next.done) break;
    pending += decoder.decode(next.value, { stream: true });
  }
  pending += decoder.decode();
  if (pending) consume(pending);
  return turnFromCalls(content, calls);
}

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
    toolChoice?: "auto" | "required";
    /** Called as tool arguments grow. `arguments` is the cumulative JSON text. */
    onToolArguments?: (call: ModelToolArgumentUpdate) => void;
    /** Cumulative visible prose; independent of structured tool-call arguments. */
    onText?: (text: string) => void;
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
        stream: true,
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
              tool_choice: options.toolChoice ?? "auto",
            }
          : {}),
      }),
      signal: controller.signal,
      redirect: "manual",
      cache: "no-store",
    });
    if (!response.ok) {
      const raw = await response.text();
      throw new Error(`模型接口 ${response.status}：${raw.replaceAll(model.apiKey, "***").slice(0, 200)}`);
    }
    const turn = await readModelTurn(response, options.onToolArguments, options.onText);
    if (!turn.content && turn.toolCalls.length === 0) throw new Error("模型没有返回正文");
    return turn;
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
