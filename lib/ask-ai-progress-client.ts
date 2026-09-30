import { parseAskAiHarness, type AskAiHarnessState } from "./ask-ai";

type ProgressWatch = {
  runId: string;
  requestId: string;
  signal: AbortSignal;
  isCurrent: () => boolean;
  onProgress: (state: AskAiHarnessState) => void;
  intervalMs?: number;
  fetcher?: typeof fetch;
};

/** This read channel only reports checkpoints; the POST response owns results and page actions. */
export function watchAskAiProgress({ runId, requestId, signal, isCurrent, onProgress, intervalMs = 1500, fetcher = fetch }: ProgressWatch): () => void {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  let revision = -1;

  function stop() {
    if (stopped) return;
    stopped = true;
    clearTimeout(timer);
    controller.abort();
    signal.removeEventListener("abort", stop);
  }

  function current() {
    return !stopped && !signal.aborted && isCurrent();
  }

  function schedule() {
    if (!current()) { stop(); return; }
    timer = setTimeout(() => { void poll(); }, intervalMs);
  }

  async function poll() {
    if (!current()) { stop(); return; }
    try {
      const response = await fetcher(`/api/ask-ai/runs/?runId=${encodeURIComponent(runId)}`, { cache: "no-store", signal: controller.signal });
      if (!current()) return;
      if ([401, 403, 409].includes(response.status)) { stop(); return; }
      if (!response.ok) return; // A first checkpoint may not exist yet; the POST reports request errors.
      const payload = await response.json() as { ok?: boolean; requestId?: unknown; harness?: unknown };
      if (!current() || payload?.ok !== true || payload.requestId !== requestId) return;
      const state = parseAskAiHarness(payload.harness);
      if (!state || state.id !== runId || state.revision <= revision) return;
      revision = state.revision;
      onProgress(state);
      if (state.status !== "running") stop();
    } catch {
      // Progress is optional; transient failures must not replace the main request's result.
    } finally {
      schedule(); // Serial polling prevents overlapping or out-of-order checkpoint reads.
    }
  }

  signal.addEventListener("abort", stop, { once: true });
  schedule();
  return stop;
}
