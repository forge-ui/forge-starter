"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@forge-ui-official/core";
import { siteConfig } from "@/config/site";

/** Own the viewport in both Kit layouts. Content growth follows the reader only
 * while they remain at the end; sending a turn explicitly resumes following. */
export function AskAiScrollArea({ children, sessionId, followKey }: {
  children: ReactNode;
  sessionId: string;
  followKey?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollToLatest = useRef<(animate: boolean) => void>(() => {});
  const [away, setAway] = useState(false);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    let following = true;
    let frame = 0;
    let animation: { from: number; started: number } | undefined;
    let contentHeight = content.offsetHeight;
    let viewportHeight = viewport.clientHeight;
    let scrollIntentUntil = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const bottom = () => Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const atBottom = () => bottom() - viewport.scrollTop <= 48;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      animation = undefined;
    };
    const tick = (now: number) => {
      frame = 0;
      if (!following || !animation) return;
      const progress = Math.min(1, (now - animation.started) / 180);
      viewport.scrollTop = animation.from + (bottom() - animation.from) * (1 - (1 - progress) ** 3);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else { animation = undefined; setAway(!atBottom()); }
    };
    const follow = (animate: boolean) => {
      if (!following) return;
      if (!animate || reducedMotion.matches) {
        stop();
        viewport.scrollTop = bottom();
        setAway(false);
      } else if (!animation && bottom() - viewport.scrollTop > 1) {
        animation = { from: viewport.scrollTop, started: performance.now() };
        frame = requestAnimationFrame(tick);
      }
    };
    scrollToLatest.current = (animate) => {
      scrollIntentUntil = 0;
      following = true;
      setAway(false);
      follow(animate);
    };
    const onScroll = () => {
      if (animation) return;
      if (atBottom()) { following = true; setAway(false); return; }
      const editing = viewport.contains(document.activeElement)
        && document.activeElement?.matches("input, textarea, select, [contenteditable=true]");
      if (editing) { following = false; setAway(true); return; }
      // Layout/focus adjustments can dispatch scroll before ResizeObserver.
      // Preserve the previous follow decision until the new geometry is handled.
      if (content.offsetHeight !== contentHeight || viewport.clientHeight !== viewportHeight) {
        if (following) follow(true);
        return;
      }
      if (performance.now() < scrollIntentUntil) {
        scrollIntentUntil = performance.now() + 1000;
        following = false;
      }
      if (following) follow(true);
      setAway(!following);
    };
    // Cancel our motion before native wheel/touch/keyboard scrolling takes over.
    const interrupt = () => {
      scrollIntentUntil = performance.now() + 1000;
      stop();
      following = atBottom();
      setAway(!following);
    };
    const onWheel = (event: WheelEvent) => { if (event.deltaY) interrupt(); };
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable=true]")) return;
      if (event.key === " " && (event.target as HTMLElement).closest("button, [role=button]")) return;
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) interrupt();
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.target === viewport) interrupt();
      else scrollIntentUntil = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.buttons && event.target === viewport) interrupt();
    };
    const onFocus = (event: FocusEvent) => {
      if ((event.target as HTMLElement).matches("input, textarea, select, [contenteditable=true]")) {
        stop();
        following = false;
      }
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("wheel", onWheel, { passive: true });
    viewport.addEventListener("pointerdown", onPointer, { passive: true });
    viewport.addEventListener("pointermove", onPointerMove, { passive: true });
    viewport.addEventListener("touchmove", interrupt, { passive: true });
    viewport.addEventListener("focusin", onFocus);
    viewport.addEventListener("keydown", onKey);
    const observer = new ResizeObserver(() => {
      contentHeight = content.offsetHeight;
      viewportHeight = viewport.clientHeight;
      if (following) follow(true);
      else if (atBottom()) { following = true; setAway(false); }
      else setAway(true);
    });
    observer.observe(content);
    observer.observe(viewport);
    follow(false);
    return () => {
      stop();
      observer.disconnect();
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerdown", onPointer);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("touchmove", interrupt);
      viewport.removeEventListener("focusin", onFocus);
      viewport.removeEventListener("keydown", onKey);
      scrollToLatest.current = () => {};
    };
  }, [sessionId]);

  useLayoutEffect(() => { scrollToLatest.current(true); }, [followKey]);

  return (
    <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        ref={viewportRef}
        data-ask-ai-scroll-viewport=""
        role="region"
        aria-label="对话消息"
        tabIndex={0}
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain [overflow-anchor:none] focus-visible:outline-2 focus-visible:outline-fg-grey-500"
      >
        <div ref={contentRef} className="min-w-0 pb-12">{children}</div>
      </div>
      {away ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <Button color={siteConfig.accent} size="sm" className="pointer-events-auto shadow-sm" onClick={() => scrollToLatest.current(true)}>回到最新</Button>
        </div>
      ) : null}
    </div>
  );
}
