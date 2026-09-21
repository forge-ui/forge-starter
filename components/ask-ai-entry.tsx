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
  type AskAiProps,
  type AskAiSessionItem,
} from "@forge-ui-official/core";
import { shellForPath, siteConfig } from "@/config/site";
import {
  ASK_AI_DEMO_SESSIONS,
  ASK_AI_LANDING_TITLE,
  ASK_AI_PLACEHOLDER,
  ASK_AI_SUGGESTIONS,
  createAskAiSession,
  filterAskAiSessions,
  sendAskAiDemo,
  titleAskAiSession,
} from "@/lib/ask-ai";

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
  const [sessions, setSessions] = useState<AskAiSessionItem[]>(ASK_AI_DEMO_SESSIONS);
  const [currentSessionId, setCurrentSessionId] = useState(ASK_AI_DEMO_SESSIONS[0]?.id ?? "demo-1");
  const [searchQuery, setSearchQuery] = useState("");
  const currentSessionIdRef = useRef(currentSessionId);
  currentSessionIdRef.current = currentSessionId;

  const visibleSessions = useMemo(
    () => filterAskAiSessions(sessions, searchQuery),
    [sessions, searchQuery],
  );

  const onSend = useCallback<AskAiProps["onSend"]>(async (message, request) => {
    setSessions((prev) =>
      prev.map((item) =>
        item.id === currentSessionIdRef.current && item.title === "新对话"
          ? { ...item, title: titleAskAiSession(message) }
          : item,
      ),
    );
    return sendAskAiDemo(message, request);
  }, []);

  const value = useMemo<AskAiProps>(
    () => ({
      color: siteConfig.accent,
      context: `${shell.title} / ${pathname}`,
      suggestions: ASK_AI_SUGGESTIONS,
      placeholder: ASK_AI_PLACEHOLDER,
      landingTitle: ASK_AI_LANDING_TITLE,
      sessions: visibleSessions,
      currentSessionId,
      searchQuery,
      onSearchQueryChange: setSearchQuery,
      onNewSession: () => {
        const next = createAskAiSession();
        setSessions((prev) => [next, ...prev].slice(0, 20));
        setCurrentSessionId(next.id);
        setSearchQuery("");
      },
      onSelectSession: (id) => {
        setCurrentSessionId(id);
        setSearchQuery("");
      },
      onSend,
    }),
    [currentSessionId, onSend, pathname, shell.title, visibleSessions, searchQuery],
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
