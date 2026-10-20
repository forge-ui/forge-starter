import { databaseRequestScope } from "@/lib/db/request-scope";
import { runModelChatTurn } from "@/lib/models/runtime";
import type { ResolvedAiModel } from "@/lib/models/types";
import {
  EXPENSE_OPENUI_FALLBACK,
  EXPENSE_OPENUI_PROGRAM,
  EXPENSE_OPENUI_SUMMARY,
  cumulativeOpenUiChunks,
  extractOpenUiLang,
} from "./expense-demo";
import { expenseOpenUiRenderable, expenseOpenUiSystemPrompt } from "./expense-server";

type Send = (value: Record<string, unknown>) => void;

async function pause(ms: number, signal: AbortSignal) {
  if (signal.aborted || ms <= 0) return;
  await new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
  });
}

async function play(lang: string, send: Send, signal: AbortSignal) {
  for (const chunk of cumulativeOpenUiChunks(lang)) {
    if (signal.aborted) return;
    send({ type: "openui", lang: chunk });
    await pause(24, signal);
  }
}

/**
 * 一条 NDJSON：先把 OpenUI Lang 累计推给渲染器，结束时给出完整消息块。
 * 有模型就走现有 Chat Completions；没有，或输出无法解析，就播放内置样例。
 */
export function expenseOpenUiResponse(input: {
  question: string;
  signal: AbortSignal;
  loadModel: () => Promise<ResolvedAiModel | null>;
}) {
  const encoder = new TextEncoder();
  const scope = databaseRequestScope.getStore();
  let settle!: () => void;
  const finished = new Promise<void>((resolve) => {
    settle = resolve;
  });
  if (scope) (scope.pending ??= []).push(finished);
  const abort = new AbortController();
  const signal = AbortSignal.any([input.signal, abort.signal]);
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send: Send = (value) => {
        if (closed || signal.aborted) return;
        controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));
      };
      try {
        let lang = EXPENSE_OPENUI_PROGRAM;
        let text = EXPENSE_OPENUI_SUMMARY;
        let live = false;
        let modelName: string | undefined;
        const model = await input.loadModel().catch(() => null);
        if (model && !signal.aborted) {
          modelName = model.modelName;
          try {
            let streamed = "";
            const turn = await runModelChatTurn(model, [
              { role: "system", content: expenseOpenUiSystemPrompt() },
              { role: "user", content: input.question.slice(0, 500) },
            ], {
              signal,
              temperature: 0.2,
              onText: (next) => {
                streamed = extractOpenUiLang(next);
                if (streamed) send({ type: "openui", lang: streamed });
              },
            });
            streamed = extractOpenUiLang(turn.content || streamed);
            if (expenseOpenUiRenderable(streamed)) {
              lang = streamed;
              live = true;
              send({ type: "openui", lang });
            } else {
              text = EXPENSE_OPENUI_FALLBACK;
              await play(EXPENSE_OPENUI_PROGRAM, send, signal);
              lang = EXPENSE_OPENUI_PROGRAM;
            }
          } catch {
            if (signal.aborted) return;
            text = EXPENSE_OPENUI_FALLBACK;
            await play(EXPENSE_OPENUI_PROGRAM, send, signal);
            lang = EXPENSE_OPENUI_PROGRAM;
          }
        } else if (!signal.aborted) {
          await play(lang, send, signal);
        }
        if (signal.aborted) return;
        send({
          type: "done",
          ok: true,
          text,
          live,
          model: modelName,
          blocks: [{ type: "openui", lang }],
          links: [],
        });
      } catch {
        if (!signal.aborted) send({ type: "error", error: "报销结果没有渲染出来", status: 502 });
      } finally {
        closed = true;
        try { controller.close(); } catch { /* already closed */ }
        settle();
      }
    },
    cancel() { abort.abort(); },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
