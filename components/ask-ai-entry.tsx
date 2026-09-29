"use client";

import { recoverAgentContinuation } from "@/lib/agent/fill";
import { currentPageContext, waitForPageAction } from "@/components/semantic-page";
import { executeAgentNavigation } from "@/lib/agent/navigation";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import {
  ASK_AI_FS_LAYER_ATTR,
  AskAi,
  Button,
  PageTitleToolbar,
  PromptBar,
  type AskAiProps,
  type AskAiRequest,
  type AskAiSessionItem,
} from "@forge-ui-official/core";
import { shellForPath, siteConfig } from "@/config/site";
import {
  ASK_AI_LANDING_TITLE,
  ASK_AI_PLACEHOLDER,
  ASK_AI_RUNTIME_EVENT,
  ASK_AI_SUGGESTIONS,
  askAiPromptModels,
  confirmAskAi,
  createAskAiSession,
  fetchAskAiRuntime,
  fetchAskAiRuns,
  filterAskAiSessions,
  pickAskAiModelId,
  sendAskAi,
  titleAskAiSession,
  writeStoredAskAiModelId,
  AskAiRequestError,
  type AskAiClientResult,
  type AskAiRuntimeStatus,
  type AskAiTurn,
  type AskAiHarnessRef,
  type AskAiHarnessReply,
  type AskAiHarnessState,
} from "@/lib/ask-ai";
import { AskAiFormStateProvider } from "@/components/ask-ai-form";
import { AskAiTranscript } from "@/components/ask-ai-transcript";
import { AskAiScrollArea } from "@/components/ask-ai-scroll-area";
import {
  AGENT_PAGE_DONE_EVENT,
  AGENT_TASK_CHANGED_EVENT,
  cancelAgentPageOperation,
  queueAgentContinuation,
  queueAgentFormFill,
  readContinuation,
  type AgentContinuation,
} from "@/lib/agent/fill";
import { toast } from "@/lib/toast";

function historyFromTurns(turns: AskAiTurn[]) {
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (const turn of turns) {
    if (turn.pending || !turn.result || turn.result.failed) continue;
    const question = turn.question.trim();
    const text = turn.result.text.trim();
    if (!question || !text) continue;
    messages.push({ role: "user", content: question }, { role: "assistant", content: text });
  }
  return messages.slice(-8);
}

function turnId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `turn-${Date.now()}`;
}


const AskAiPlaceContext = createContext<(slot: HTMLElement | null, releasing?: HTMLElement | null) => void>(
  () => {},
);

function createAskAiMountNode() {
  const el = document.createElement("div");
  el.setAttribute("data-ask-ai-mount", "");
  el.className = "inline-flex shrink-0 items-center";
  return el;
}

function placeAskAiMount(
  mount: HTMLElement | null,
  slot: HTMLElement | null,
  host: HTMLElement | null,
) {
  if (!mount) return;
  const target = slot ?? host;
  if (!target) return;
  if (mount.parentElement !== target) target.appendChild(mount);
}

export function AskAiProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const committedPath = useRef(pathname);
  useLayoutEffect(() => { committedPath.current = pathname; }, [pathname]);
  const shell = useMemo(() => shellForPath(pathname), [pathname]);
  const hostRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLElement | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [sessions, setSessions] = useState<AskAiSessionItem[]>([{ id: "new", title: "新对话" }]);
  const [currentSessionId, setCurrentSessionId] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [turnsBySession, setTurnsBySession] = useState<Record<string, AskAiTurn[]>>({});
  const [spentIntents, setSpentIntents] = useState<string[]>([]);
  const [confirmingIntent, setConfirmingIntent] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<AskAiRuntimeStatus | null>(null);
  const [modelId, setModelId] = useState("");
  const currentSessionIdRef = useRef(currentSessionId);
  const modelIdRef = useRef(modelId);
  const turnsRef = useRef(turnsBySession);
  const sessionsRef = useRef(sessions);
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [continuations, setContinuations] = useState<AgentContinuation[]>([]);
  const runRefs = useRef<Record<string, AskAiHarnessState>>({});
  const [restoring, setRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState("");
  const restoreReady = useRef(false);
  const taskRefreshPending = useRef(false);
  currentSessionIdRef.current = currentSessionId;
  modelIdRef.current = modelId;
  turnsRef.current = turnsBySession;
  sessionsRef.current = sessions;

  const applyRuntime = useCallback((next: AskAiRuntimeStatus) => {
    setRuntime(next);
    setModelId((current) => pickAskAiModelId(current, next));
  }, []);

  const visibleSessions = useMemo(
    () => filterAskAiSessions(sessions, searchQuery),
    [sessions, searchQuery],
  );

  const restoreSessions = useCallback(async (initial = false, deferWhileBusy = false) => {
    const saved = await fetchAskAiRuns();
    if (deferWhileBusy && busyRef.current) { taskRefreshPending.current = true; return; }
    // A background read that started before a new turn must not replace its result.
    const fresh = saved.filter(run => run.revision >= (runRefs.current[run.id]?.revision ?? -1));
    const restoredTurns = Object.fromEntries(fresh.map(run => [run.id, run.turns]));
    for (const run of fresh) runRefs.current[run.id] = run;
    setTurnsBySession(prev => {
      const next = { ...prev, ...restoredTurns };
      turnsRef.current = next;
      return next;
    });
    setSessions(prev => {
      const ids = new Set(fresh.map(run => run.id));
      const next = [...fresh.map(run => ({ id: run.id, title: titleAskAiSession(run.title) })), ...prev.filter(item => !ids.has(item.id))].slice(0, 20);
      sessionsRef.current = next;
      return next;
    });
    if (initial && saved.length && !turnsRef.current[currentSessionIdRef.current]?.length) {
      currentSessionIdRef.current = saved[0].id;
      setCurrentSessionId(saved[0].id);
    }
    setRestoreError("");
  }, []);

  const syncChangedTasks = useCallback(() => {
    if (busyRef.current || !restoreReady.current) { taskRefreshPending.current = true; return; }
    taskRefreshPending.current = false;
    void restoreSessions(false, true).catch(() => toast.error("操作已取消，会话同步失败，请刷新后重试"));
  }, [restoreSessions]);

  useEffect(() => {
    window.addEventListener(AGENT_TASK_CHANGED_EVENT, syncChangedTasks);
    return () => window.removeEventListener(AGENT_TASK_CHANGED_EVENT, syncChangedTasks);
  }, [syncChangedTasks]);

  useEffect(() => {
    if (!busy && !restoring && taskRefreshPending.current) syncChangedTasks();
  }, [busy, restoring, syncChangedTasks]);

  useEffect(() => {
    let mounted = true;
    void restoreSessions(true).catch(error => {
      if (mounted) setRestoreError(error instanceof Error ? error.message : "会话恢复失败");
    }).finally(() => {
      if (mounted) { restoreReady.current = true; setRestoring(false); }
    });
    return () => { mounted = false; };
  }, [restoreSessions]);

  const rememberRun = useCallback((sessionId: string, state?: AskAiHarnessState) => {
    if (!state) return sessionId;
    const canonicalId = state.id;
    runRefs.current[canonicalId] = state;
    if (canonicalId === sessionId) return canonicalId;
    delete runRefs.current[sessionId];
    setTurnsBySession(prev => {
      const next = { ...prev, [canonicalId]: prev[sessionId] ?? [] };
      delete next[sessionId];
      turnsRef.current = next;
      return next;
    });
    setSessions(prev => prev.map(item => item.id === sessionId ? { ...item, id: canonicalId } : item));
    if (currentSessionIdRef.current === sessionId) {
      currentSessionIdRef.current = canonicalId;
      setCurrentSessionId(canonicalId);
    }
    return canonicalId;
  }, []);

  useEffect(() => {
    let cancelled = false;
    function load() {
      void fetchAskAiRuntime(pathname).then((next) => {
        if (!cancelled) applyRuntime(next);
      });
    }
    load();
    window.addEventListener(ASK_AI_RUNTIME_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(ASK_AI_RUNTIME_EVENT, load);
    };
  }, [applyRuntime, pathname]);

  const onSend = useCallback(async (message: string, request: AskAiRequest, continuation?: AgentContinuation, interaction?: { run: AskAiHarnessRef; reply: AskAiHarnessReply }) => {
    if (!restoreReady.current) return { text: "正在恢复会话，请稍候" };
    if (busyRef.current) {
      return { text: "上一条还在处理" };
    }
    if (interaction && (runRefs.current[interaction.run.id]?.revision !== interaction.run.revision
      || runRefs.current[interaction.run.id]?.pending?.id !== interaction.reply.interactionId)) {
      toast.info("这项选择已更新，请使用最新消息");
      return { text: "这项选择已更新，请使用最新消息" };
    }
    busyRef.current = true;
    setBusy(true);
    let sessionId = interaction?.run.id ?? continuation?.sessionId ?? currentSessionIdRef.current;
    const run = runRefs.current[sessionId];
    const pendingPage = !continuation && run?.pending?.kind === "external" && (!interaction || interaction.reply.cancel)
      ? readContinuation() : null;
    const pageToRetire = pendingPage?.sessionId === sessionId && pendingPage.operationId
      ? { sessionId, operationId: pendingPage.operationId } : null;
    const history = historyFromTurns(turnsRef.current[sessionId] ?? []);
    const id = turnId();
    if (!continuation && !interaction) setDraft("");
    const displayQuestion = interaction
      ? interaction.reply.cancel ? "取消本次任务" : interaction.reply.text || (interaction.reply.optionIds ? run?.pending?.options.filter(option => interaction.reply.optionIds!.includes(option.id)).map(option => option.label).join("、") : "") || run?.pending?.options.find(option => option.id === interaction.reply.optionId)?.label || "已选择目标"
      : continuation ? "已保存，请继续原请求中的核对或导出" : message;
    setTurnsBySession((prev) => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] ?? []), { id, question: displayQuestion, pending: true, result: null }],
    }));
    setSessions((prev) =>
      prev.map((item) =>
        item.id === sessionId && item.title === "新对话"
          ? { ...item, title: titleAskAiSession(message) }
          : item,
      ),
    );
    void fetchAskAiRuntime(pathname).then(next => { if (committedPath.current === pathname) applyRuntime(next); });
    const finish = (result: AskAiClientResult) => {
      sessionId = rememberRun(sessionId, result.harness);
      setTurnsBySession((prev) => ({
        ...prev,
        [sessionId]: (prev[sessionId] ?? []).map((turn) =>
          turn.id === id ? { ...turn, pending: false, result } : turn,
        ),
      }));
      return result;
    };
    try {
      const result = await sendAskAi(
        message,
        request,
        continuation?.modelId ?? modelIdRef.current,
        history,
        `${shell.title} / ${pathname}`,
        continuation?.receipt && currentPageContext() ? { ...currentPageContext()!, entityId: continuation.receipt.entityId } : currentPageContext(),
        continuation?.operationId,
        { requestId: id, runId: run?.id, expectedRevision: run?.revision, reply: interaction?.reply },
      );
      if (pageToRetire && result.harness?.id === run?.id && result.harness.revision > run.revision
        && result.harness.pending?.id !== run.pending?.id) {
        cancelAgentPageOperation(pageToRetire);
        setContinuations(pending => pending.filter(item => item.sessionId !== pageToRetire.sessionId || item.operationId !== pageToRetire.operationId));
        toast.info(interaction?.reply.cancel ? "已取消本次页面操作" : "上一项页面操作已取消");
      }
      sessionId = rememberRun(sessionId, result.harness);
      if (result.live && result.model) {
        setRuntime((prev) => (prev ? { ...prev, configured: true, model: result.model } : prev));
      }
      if (result.navigation) {
        result.text = await executeAgentNavigation(result.navigation, {
          push: (href) => router.push(href, { scroll: false }),
          getPath: () => committedPath.current,
          signal: request.signal,
        });
        toast.success(result.text);
      }
      if (result.fill) {
        if (["create", "edit", "delete"].includes(result.fill.mode)) {
          queueAgentContinuation({ sessionId, question: message, mode: result.fill.mode, operationId: result.fill.operationId, modelId: modelIdRef.current });
        }
        const accepted = waitForPageAction(result.fill.commandId!);
        queueAgentFormFill(result.fill);
        const target = result.fill.href.endsWith("/") ? result.fill.href : `${result.fill.href}/`;
        const here = committedPath.current.endsWith("/") ? committedPath.current : `${committedPath.current}/`;
        if (here !== target) router.push(target, { scroll: false });
        await accepted;
        result.text = ["open", "filter"].includes(result.fill.mode) ? "页面已更新" : "已带入页面，请核对后确认";
        toast.success(result.text);
      }
      return finish(result);
    } catch (error) {
      const text = error instanceof Error ? error.message : "提问失败";
      const failed: AskAiClientResult = {
        text,
        live: false,
        failed: true,
        model: runtime?.model,
      };
      finish(failed);
      if (error instanceof AskAiRequestError && error.status === 409) {
        await restoreSessions().then(() => toast.info("会话已同步，请按最新提示继续")).catch(() => toast.error("同步失败，请刷新后重试"));
      } else if (error instanceof AskAiRequestError && error.status === 403) {
        toast.error(`${text}。请新建对话继续。`);
      }
      return failed;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, [applyRuntime, pathname, rememberRun, restoreSessions, router, runtime?.model, shell.title]);

  const replyToHarness = useCallback((run: AskAiHarnessRef, reply: AskAiHarnessReply) => {
    void onSend("", { messages: [], signal: new AbortController().signal }, undefined, { run, reply });
  }, [onSend]);

  const askFromHost = useCallback(
    (message: string) => {
      const request: AskAiRequest = {
        messages: [],
        signal: new AbortController().signal,
      };
      void onSend(message, request);
    },
    [onSend, pathname, shell.title],
  );

  useEffect(() => {
    function onPageDone(event: Event) {
      const detail = (event as CustomEvent<AgentContinuation>).detail;
      if (!detail?.sessionId || !detail.question) return;
      setContinuations((pending) => [...pending, detail]);
    }
    window.addEventListener(AGENT_PAGE_DONE_EVENT, onPageDone);
    void recoverAgentContinuation().catch(() => undefined);
    return () => window.removeEventListener(AGENT_PAGE_DONE_EVENT, onPageDone);
  }, []);

  // Keep completed page actions queued while another question/confirmation is running.
  useEffect(() => {
    if (restoring || busy || busyRef.current || continuations.length === 0) return;
    const [next] = continuations;
    setContinuations((pending) => pending.slice(1));
    currentSessionIdRef.current = next.sessionId;
    setCurrentSessionId(next.sessionId);
    setSessions((sessions) => sessions.some((s) => s.id === next.sessionId) ? sessions : [{ id: next.sessionId, title: "恢复的操作" }, ...sessions]);
    const verb = next.mode === "delete" ? "已在页面删除" : "已在页面保存";
    void onSend(
      `${verb}。原请求：${next.question}\n请继续原请求中还没做的步骤：要核对就查询，要文件就导出。不要再提出同一条写入。如果没有后续步骤，一句话确认即可。`,
      { messages: [], signal: new AbortController().signal },
      next,
    );
  }, [busy, continuations, onSend, restoring]);

  const confirmIntent = useCallback(async (intent: string, sourceQuestion?: string): Promise<boolean> => {
    if (busyRef.current || spentIntents.includes(intent)) { toast.info("请等待当前操作完成"); return false; }
    busyRef.current = true;
    setBusy(true);
    setConfirmingIntent(intent);
    const sessionId = currentSessionIdRef.current;
    const id = turnId();
    setTurnsBySession((prev) => ({
      ...prev,
      [sessionId]: [
        ...(prev[sessionId] ?? []),
        { id, question: "填入页面", pending: true, result: null },
      ],
    }));
    return confirmAskAi(intent, currentPageContext())
      .then(async (result) => {
        result.harness ??= runRefs.current[sessionId];
        rememberRun(sessionId, result.harness);
        setSpentIntents((prev) => (prev.includes(intent) ? prev : [...prev, intent]));
        if (result.fill) {
          // Older confirmation cards must resume the request that produced them,
          // even if the user has since asked another question in this session.
          const sourceTurn = (turnsRef.current[sessionId] ?? []).find((turn) =>
            turn.result?.blocks?.some((block) => block.type === "confirm" && block.intent === intent),
          );
          const question = sourceQuestion ?? sourceTurn?.question.trim() ?? "";
          if (question && ["create", "edit", "delete"].includes(result.fill.mode)) {
            queueAgentContinuation({
              sessionId,
              question,
              mode: result.fill.mode,
              operationId: result.fill.operationId,
              modelId: modelIdRef.current,
            });
          }
          const accepted = waitForPageAction(result.fill.commandId!);
          queueAgentFormFill(result.fill);
          const target = result.fill.href.endsWith("/") ? result.fill.href : `${result.fill.href}/`;
          const here = pathname.endsWith("/") ? pathname : `${pathname}/`;
          if (here !== target) router.push(target);
          await accepted;
          result.text = result.fill.mode === "delete"
              ? "已打开页面上的删除确认"
              : ["open", "filter"].includes(result.fill.mode) ? "页面已更新" : "已填入页面表单，请检查后保存";
          toast.success(result.text);
        } else {
          toast.success("已处理");
        }
        setTurnsBySession((prev) => ({
          ...prev,
          [sessionId]: (prev[sessionId] ?? []).map((turn) =>
            turn.id === id ? { ...turn, pending: false, result } : turn,
          ),
        }));
        return true;
      })
      .catch((error: unknown) => {
        const text = error instanceof Error ? error.message : "写入失败";
        if (text.includes("已使用")) {
          setSpentIntents((prev) => (prev.includes(intent) ? prev : [...prev, intent]));
        }
        const failed: AskAiClientResult = { text, live: false, failed: true };
        setTurnsBySession((prev) => ({
          ...prev,
          [sessionId]: (prev[sessionId] ?? []).map((turn) =>
            turn.id === id ? { ...turn, pending: false, result: failed } : turn,
          ),
        }));
        toast.error(text);
        return false;
      })
      .finally(() => {
        busyRef.current = false;
        setBusy(false);
        setConfirmingIntent(null);
      });
  }, [pathname, rememberRun, router, spentIntents]);

  const startNewSession = useCallback(() => {
    const hasInput = (id: string) =>
      (turnsRef.current[id] ?? []).some((turn) => turn.question.trim().length > 0);
    if (!hasInput(currentSessionIdRef.current)) {
      setSearchQuery("");
      return;
    }
    const existingEmpty = sessionsRef.current.find((item) => !hasInput(item.id));
    if (existingEmpty) {
      currentSessionIdRef.current = existingEmpty.id;
      setCurrentSessionId(existingEmpty.id);
      setSearchQuery("");
      setDraft("");
      return;
    }
    const next = createAskAiSession();
    currentSessionIdRef.current = next.id;
    setSessions((prev) => [next, ...prev].slice(0, 20));
    setCurrentSessionId(next.id);
    setSearchQuery("");
    setDraft("");
    void fetchAskAiRuntime(pathname).then(next => { if (committedPath.current === pathname) applyRuntime(next); });
  }, [applyRuntime, pathname]);

  const selectSession = useCallback((id: string) => {
    currentSessionIdRef.current = id;
    setCurrentSessionId(id);
    setSearchQuery("");
  }, []);

  const turns = turnsBySession[currentSessionId] ?? [];
  const hasChat = turns.length > 0;

  const value = useMemo<AskAiProps>(
    () => ({
      color: siteConfig.accent,
      suggestions: runtime?.suggestions ?? ASK_AI_SUGGESTIONS,
      placeholder: ASK_AI_PLACEHOLDER,
      landingTitle: runtime?.suggestions?.length === 0 ? "你想处理什么？" : ASK_AI_LANDING_TITLE,
      sessions: visibleSessions,
      currentSessionId,
      searchQuery,
      onSearchQueryChange: setSearchQuery,
      hasConversation: hasChat,
      messages: hasChat ? (
        <AskAiScrollArea sessionId={currentSessionId} followKey={turns.at(-1)?.id}>
          <AskAiTranscript
            turns={turns}
            runtime={runtime}
            spentIntents={spentIntents}
            confirmingIntent={confirmingIntent}
            onAsk={askFromHost}
            onConfirm={confirmIntent}
            onReply={replyToHarness}
            busy={busy}
          />
        </AskAiScrollArea>
      ) : runtime?.suggestions?.length === 0 ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 p-5">
          <p role="status" className="text-sm leading-6 text-fg-grey-700">当前页面暂无快捷建议，可以直接描述你要了解或处理的目标。</p>
        </div>
      ) : undefined,
      composer: (
        <div
          data-accent={siteConfig.accent}
          className="@container w-full min-w-0 max-w-full shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
        >
          {restoreError ? <div className="mb-2 flex flex-wrap items-center gap-2"><p className="text-xs text-fg-grey-700">{restoreError}</p><Button color={siteConfig.accent} variant="tertiary" disabled={restoring} onClick={() => { setRestoring(true); void restoreSessions().catch(error => setRestoreError(error instanceof Error ? error.message : "恢复失败")).finally(() => setRestoring(false)); }}>重试恢复</Button></div> : null}
          <PromptBar
            className="w-full min-w-0 max-w-full [&_button[aria-label=Attach]]:hidden [&_button[aria-label=Dictate]]:hidden @max-[440px]:[&_textarea]:h-[4.5rem] @max-[440px]:[&_textarea]:pt-3"
            value={draft}
            onChange={setDraft}
            onSend={askFromHost}
            disabled={busy || restoring}
            color={siteConfig.accent}
            placeholder={restoring ? "正在恢复会话…" : ASK_AI_PLACEHOLDER}
            models={askAiPromptModels(runtime)}
            modelMenuLabel="选择模型"
            model={modelId}
            onModelChange={(id) => {
              setModelId(id);
              writeStoredAskAiModelId(id);
            }}
          />
        </div>
      ),
      onNewSession: startNewSession,
      onSelectSession: selectSession,
      onSend,
    }),
    [
      askFromHost,
      busy,
      confirmingIntent,
      confirmIntent,
      currentSessionId,
      draft,
      hasChat,
      modelId,
      onSend,
      replyToHarness,
      restoreError,
      restoreSessions,
      restoring,
      pathname,
      runtime,
      searchQuery,
      selectSession,
      shell.title,
      spentIntents,
      startNewSession,
      turns,
      visibleSessions,
    ],
  );

  useLayoutEffect(() => {
    const el = createAskAiMountNode();
    setMountNode(el);
    return () => {
      el.remove();
      setMountNode(null);
    };
  }, []);

  const place = useCallback(
    (slot: HTMLElement | null, releasing?: HTMLElement | null) => {
      if (releasing) {
        if (slotRef.current === releasing) {
          slotRef.current = null;
          placeAskAiMount(mountNode, null, hostRef.current);
        }
        return;
      }
      slotRef.current = slot;
      placeAskAiMount(mountNode, slot, hostRef.current);
    },
    [mountNode],
  );

  useLayoutEffect(() => {
    place(slotRef.current);
  }, [place]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const trigger = mountNode?.querySelector<HTMLButtonElement>('button[aria-label="Ask AI"]');
      const fullscreen = document.querySelector(`[${ASK_AI_FS_LAYER_ATTR}]`);
      if (trigger?.getAttribute("aria-expanded") !== "true" && !fullscreen) return;
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.(`dialog[aria-modal='true'] a[href], [${ASK_AI_FS_LAYER_ATTR}] a[href]`);
      if (!link) return;
      const href = link.getAttribute("href")?.trim();
      if (!href || !href.startsWith("/")) return;
      event.preventDefault();
      router.push(href, { scroll: false });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [mountNode, router]);

  return (
    <AskAiPlaceContext.Provider value={place}>
      {children}
      {/* Kit AskAi 无受控 open。portal 到稳定 mount，换页只挪触发器，本轮对话保住。 */}
      <div data-ask-ai-host ref={hostRef} className="hidden" />
      {mountNode ? createPortal(<AskAiFormStateProvider><AskAi {...value} /></AskAiFormStateProvider>, mountNode) : null}
    </AskAiPlaceContext.Provider>
  );
}

/** 页头槽：把唯一 Kit 触发器挂进来，自己不另开抽屉。 */
export function AskAiEntry({ className }: { className?: string }) {
  const place = useContext(AskAiPlaceContext);
  const slotRef = useRef<HTMLDivElement>(null);
  const placeRef = useRef(place);
  placeRef.current = place;

  useLayoutEffect(() => {
    place(slotRef.current);
  }, [place]);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    return () => {
      placeRef.current(null, slot);
    };
  }, []);

  return (
    <div
      ref={slotRef}
      data-ask-ai-slot
      className={["inline-flex shrink-0 items-center", className].filter(Boolean).join(" ")}
    />
  );
}

/** A 紧凑页头右侧：Ask AI + 主操作。 */
export function PageTitleActions({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AskAiEntry />
      {children}
    </div>
  );
}

/** B 正文页头：Kit PageTitleToolbar 与 Ask 同一条。 */
export function PageTitleToolbarWithAsk(props: ComponentProps<typeof PageTitleToolbar>) {
  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="min-w-0 flex-1">
        <PageTitleToolbar {...props} />
      </div>
      <AskAiEntry />
    </div>
  );
}
