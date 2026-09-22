"use client";

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
  filterAskAiSessions,
  pickAskAiModelId,
  sendAskAi,
  titleAskAiSession,
  writeStoredAskAiModelId,
  type AskAiClientResult,
  type AskAiRuntimeStatus,
  type AskAiTurn,
} from "@/lib/ask-ai";
import { AskAiTranscript } from "@/components/ask-ai-transcript";
import { queueAgentFormFill } from "@/lib/agent/fill";
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

  useEffect(() => {
    let cancelled = false;
    function load() {
      void fetchAskAiRuntime().then((next) => {
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

  const onSend = useCallback<AskAiProps["onSend"]>(async (message, request) => {
    if (busyRef.current) {
      return { text: "上一条还在处理" };
    }
    busyRef.current = true;
    const sessionId = currentSessionIdRef.current;
    const history = historyFromTurns(turnsRef.current[sessionId] ?? []);
    const id = turnId();
    setDraft("");
    setTurnsBySession((prev) => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] ?? []), { id, question: message, pending: true, result: null }],
    }));
    setSessions((prev) =>
      prev.map((item) =>
        item.id === sessionId && item.title === "新对话"
          ? { ...item, title: titleAskAiSession(message) }
          : item,
      ),
    );
    void fetchAskAiRuntime().then(applyRuntime);
    const finish = (result: AskAiClientResult) => {
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
        modelIdRef.current,
        history,
        `${shell.title} / ${pathname}`,
      );
      if (result.live && result.model) {
        setRuntime((prev) => (prev ? { ...prev, configured: true, model: result.model } : prev));
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
      return finish(failed);
    } finally {
      busyRef.current = false;
    }
  }, [applyRuntime, pathname, runtime?.model, shell.title]);

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

  const confirmIntent = useCallback((intent: string) => {
    if (busyRef.current || spentIntents.includes(intent)) return;
    busyRef.current = true;
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
    void confirmAskAi(intent)
      .then((result) => {
        setSpentIntents((prev) => (prev.includes(intent) ? prev : [...prev, intent]));
        setTurnsBySession((prev) => ({
          ...prev,
          [sessionId]: (prev[sessionId] ?? []).map((turn) =>
            turn.id === id ? { ...turn, pending: false, result } : turn,
          ),
        }));
        if (result.fill) {
          queueAgentFormFill(result.fill);
          const target = result.fill.href.endsWith("/") ? result.fill.href : `${result.fill.href}/`;
          const here = pathname.endsWith("/") ? pathname : `${pathname}/`;
          if (here !== target) router.push(target);
          toast.success(
            result.fill.mode === "delete"
              ? "已打开页面上的删除确认"
              : "已填入页面表单，请检查后保存",
          );
        } else {
          toast.success("已处理");
        }
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
      })
      .finally(() => {
        busyRef.current = false;
        setConfirmingIntent(null);
      });
  }, [pathname, router, spentIntents]);

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
    void fetchAskAiRuntime().then(applyRuntime);
  }, [applyRuntime]);

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
      suggestions: ASK_AI_SUGGESTIONS,
      placeholder: ASK_AI_PLACEHOLDER,
      landingTitle: ASK_AI_LANDING_TITLE,
      sessions: visibleSessions,
      currentSessionId,
      searchQuery,
      onSearchQueryChange: setSearchQuery,
      hasConversation: hasChat,
      messages: hasChat ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
          <AskAiTranscript
            turns={turns}
            runtime={runtime}
            spentIntents={spentIntents}
            confirmingIntent={confirmingIntent}
            onAsk={askFromHost}
            onConfirm={confirmIntent}
          />
        </div>
      ) : undefined,
      composer: (
        <div
          data-accent={siteConfig.accent}
          className="@container w-full min-w-0 max-w-full shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
        >
          <PromptBar
            className="w-full min-w-0 max-w-full overflow-hidden [&_button[aria-label=Attach]]:hidden [&_button[aria-label=Dictate]]:hidden @max-[440px]:[&_textarea]:h-[4.5rem] @max-[440px]:[&_textarea]:pt-3"
            value={draft}
            onChange={setDraft}
            onSend={askFromHost}
            placeholder={ASK_AI_PLACEHOLDER}
            models={askAiPromptModels(runtime)}
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
      confirmingIntent,
      confirmIntent,
      currentSessionId,
      draft,
      hasChat,
      modelId,
      onSend,
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
      {mountNode ? createPortal(<AskAi {...value} />, mountNode) : null}
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
