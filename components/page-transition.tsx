"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Keep the persistent AppLayout outside the animated route surface. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const surface = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let recovery: ReturnType<typeof setTimeout> | undefined;
    const node = surface.current;
    if (!node) return;
    node.removeAttribute("data-leaving");

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.download || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href);
      if (destination.origin !== location.origin || destination.pathname === location.pathname || !moduleRoute(destination.pathname)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      event.stopPropagation();
      clearTimeout(timer);
      clearTimeout(recovery);
      node!.setAttribute("data-leaving", "");
      router.prefetch(destination.pathname + destination.search);
      timer = setTimeout(() => {
        router.push(destination.pathname + destination.search + destination.hash);
        // A failed/slow navigation must never leave the current page invisible.
        recovery = setTimeout(() => node!.removeAttribute("data-leaving"), 1500);
      }, 100);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimeout(timer);
      clearTimeout(recovery);
    };
  }, [pathname, router]);

  return <div key={pathname} ref={surface} className="starter-page-transition">{children}</div>;
}

function moduleRoute(path: string) {
  // Authentication and external destinations retain their own navigation behavior.
  return !/^\/(?:api|login|register|forgot-password|reset-password)(?:\/|$)/.test(path);
}
