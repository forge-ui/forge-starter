import type { StreamingAnswerProps, StreamingAnswerStatus } from "@forge-ui-official/core";

/** Transport states understood by StreamingAnswer. A network pause stays "streaming". */
export type AskAiAnswerStatus = StreamingAnswerStatus;

/**
 * Host-owned delivery for one assistant answer.
 * Core owns the fade, the display buffer, and Markdown.
 *
 * - static: history, welcome copy, and ordinary prompts. Omit streaming and status.
 * - replay: the current JSON transport already returned the full text. Play it with streaming.
 * - incremental: a live channel. `text` is the cumulative answer and `status` is the transport.
 * - stopped: freeze the mounted answer. Do not promote it to complete afterwards.
 */
export type AskAiTextDelivery =
  | { mode: "static" }
  | { mode: "replay" }
  | { mode: "incremental"; status: AskAiAnswerStatus }
  | { mode: "stopped" };

export const ASK_AI_ANSWER_MOTION = {
  format: "markdown",
  animation: "fade",
  duration: 500,
  motion: "auto",
} as const satisfies Pick<StreamingAnswerProps, "format" | "animation" | "duration" | "motion">;

export type AskAiAnswerBinding = Pick<
  StreamingAnswerProps,
  "text" | "streaming" | "status" | "format" | "animation" | "duration" | "motion"
>;

/** Map host delivery onto StreamingAnswer. Static answers omit streaming and status. */
export function bindAskAiAnswer(
  text: string,
  delivery: AskAiTextDelivery = { mode: "static" },
): AskAiAnswerBinding {
  const base = { text, ...ASK_AI_ANSWER_MOTION };
  if (delivery.mode === "replay") return { ...base, streaming: true };
  if (delivery.mode === "stopped") return { ...base, status: "stopped" };
  if (delivery.mode === "incremental") return { ...base, status: delivery.status };
  return base;
}

/** Cumulative text for an incremental channel. The current Ask AI route does not use this yet. */
export type AskAiTextBuffer = {
  text: string;
  status: AskAiAnswerStatus;
};

export function createAskAiTextBuffer(): AskAiTextBuffer {
  return { text: "", status: "streaming" };
}

/** Append one delta. Pauses call nothing and therefore stay on streaming. */
export function receiveAskAiText(buffer: AskAiTextBuffer, delta: string): AskAiTextBuffer {
  if (buffer.status !== "streaming" || delta.length === 0) return buffer;
  return { text: buffer.text + delta, status: "streaming" };
}

/** Mark the transport finished. Stopped buffers stay stopped so Core does not drain them. */
export function completeAskAiText(buffer: AskAiTextBuffer): AskAiTextBuffer {
  if (buffer.status !== "streaming") return buffer;
  return { ...buffer, status: "complete" };
}

export function stopAskAiText(buffer: AskAiTextBuffer): AskAiTextBuffer {
  if (buffer.status === "stopped") return buffer;
  return { ...buffer, status: "stopped" };
}

type ReplayInput = {
  text?: string;
  failed?: boolean;
  blocks?: Array<{ type: string; title?: string }>;
  harness?: { pending?: { kind?: string } };
};

/**
 * Current transport is one JSON payload.
 * Replay only prose that will stay on screen. Failures, target pickers, and harness
 * questions are ordinary prompts and stay static so a later mount cannot play them.
 */
export function askAiReplayDelivery(result: ReplayInput): AskAiTextDelivery {
  if (result.failed || !result.text?.trim()) return { mode: "static" };
  if (result.harness?.pending?.kind === "question") return { mode: "static" };
  if (result.blocks?.some((block) => block.type === "choice" && block.title === "选择目标")) {
    return { mode: "static" };
  }
  return { mode: "replay" };
}

/**
 * Presentation callback. Replay and a finished incremental answer become static.
 * Stopped stays stopped. Static history is unchanged, so its onDone is a no-op.
 */
export function settleAskAiDelivery(
  delivery: AskAiTextDelivery | undefined,
  event: "presented" | "stop",
): AskAiTextDelivery {
  const current = delivery ?? { mode: "static" };
  if (event === "stop") {
    if (current.mode === "static") return current;
    return { mode: "stopped" };
  }
  if (current.mode === "replay") return { mode: "static" };
  if (current.mode === "incremental" && current.status === "complete") return { mode: "static" };
  return current;
}

/** True while Core should still be revealing text. */
export function askAiDeliveryPlaying(delivery: AskAiTextDelivery | undefined): boolean {
  if (!delivery) return false;
  if (delivery.mode === "replay") return true;
  if (delivery.mode === "incremental") return delivery.status === "streaming" || delivery.status === "complete";
  return false;
}

/**
 * Task status and suggested follow-ups wait until presentation finishes.
 * Static history, failures, and target pickers are already settled.
 * Stop does not count as finished, so that chrome stays hidden.
 */
export function askAiDeliverySettled(delivery: AskAiTextDelivery | undefined): boolean {
  return !delivery || delivery.mode === "static";
}

export function isCurrentAskAiRequest(
  active: { turnId: string; controller: AbortController } | null,
  ticket: { turnId: string; controller: AbortController },
): boolean {
  return Boolean(
    active
    && active.turnId === ticket.turnId
    && active.controller === ticket.controller
    && !ticket.controller.signal.aborted,
  );
}
