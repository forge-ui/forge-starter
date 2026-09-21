import type { AskAiRequest, AskAiResponse, AskAiSessionItem } from "@forge-ui-official/core";
import { ASK_AI_FALLBACK_SUMMARY, matchAskAiDemo } from "@/lib/ask-ai-demos";

export {
  ASK_AI_DEMOS,
  ASK_AI_DEMO_SESSIONS,
  ASK_AI_PROMPT_COMMANDS,
  ASK_AI_PROMPT_MODELS,
  ASK_AI_PROMPT_SOURCES,
  ASK_AI_SUGGESTIONS,
  matchAskAiDemo,
} from "@/lib/ask-ai-demos";

export const ASK_AI_PLACEHOLDER = "问当前页，或点一条示范问题";

export const ASK_AI_LANDING_TITLE = "先问这几件？";

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
  await wait(280, request.signal);
  const demo = matchAskAiDemo(question);
  return {
    text: demo?.summary ?? ASK_AI_FALLBACK_SUMMARY,
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
