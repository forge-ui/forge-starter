import type { AskAiRequest, AskAiResponse, AskAiSessionItem } from "@forge-ui-official/core";

export const ASK_AI_SUGGESTIONS = [
  "这个页面可以做什么？",
  "下一步该做什么？",
  "帮我总结当前内容",
];

export const ASK_AI_PLACEHOLDER = "输入问题…";

export const ASK_AI_LANDING_TITLE = "今天想做什么？";

export const ASK_AI_DEMO_SESSIONS: AskAiSessionItem[] = [
  { id: "demo-1", title: "这个页面可以做什么？" },
  { id: "demo-2", title: "帮我总结当前内容" },
];

export function createAskAiSession(title = "新对话"): AskAiSessionItem {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `ask-${Date.now()}`;
  return { id, title };
}

export function titleAskAiSession(title: string) {
  const next = title.trim().replace(/\s+/g, " ");
  return next.slice(0, 24) || "新对话";
}

export function filterAskAiSessions(sessions: AskAiSessionItem[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return sessions;
  return sessions.filter((item) => item.title.toLowerCase().includes(needle));
}

/** Starter 默认演示回复。产品接入真实模型时只换这个函数。 */
export async function sendAskAiDemo(
  question: string,
  request: AskAiRequest,
): Promise<AskAiResponse> {
  await wait(400, request.signal);
  const contextLine = request.context
    ? `本次携带当前页：${request.context}。`
    : "本次未携带当前页。";
  return {
    text: `演示回复：已收到「${question}」。\n\n${contextLine}\n\n业务系统把 \`lib/ask-ai.ts\` 的 onSend 换成你们的模型接口即可，Kit \`AskAi\` 会把回复显示在这里。`,
    links: [
      { label: "打开工作台", href: "/dashboard/" },
      { label: "打开账号管理", href: "/accounts/" },
    ],
  };
}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}
