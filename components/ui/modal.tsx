"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { CloseIcon } from "@forge-ui-official/core";

/**
 * Starter overlay host. Reuse Core motion styles while keeping toasts and
 * existing app overlays in the same stacking context (native dialog is top-layer).
 */
export function Modal({
  open,
  onClose,
  title,
  width = "w-[560px]",
  children,
  className = "",
  overlayClassName = "",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: string;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
}) {
  const [present, setPresent] = useState(open);
  const surface = useRef<HTMLDivElement>(null);
  const lastChildren = useRef(children);
  useLayoutEffect(() => { if (open) lastChildren.current = children; }, [open, children]);
  useLayoutEffect(() => {
    if (open) { setPresent(true); return; }
    if (!present) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raw = surface.current ? getComputedStyle(surface.current).getPropertyValue("--forge-motion-exit-duration").trim() : "";
    const value = parseFloat(raw);
    const duration = Number.isFinite(value) ? value * (raw.endsWith("ms") ? 1 : 1000) : 120;
    const timer = setTimeout(() => setPresent(false), reduced ? 0 : Math.max(0, duration));
    return () => clearTimeout(timer);
  }, [open, present]);

  if (!open && !present) return null;

  return (
    <div
      className={`fixed inset-0 ${overlayClassName || "z-50"} flex items-center justify-center bg-black/30 p-4`}
      role="presentation"
      inert={!open || undefined}
      aria-hidden={!open || undefined}
      onClick={onClose}
    >
      <div
        ref={surface}
        data-motion="auto"
        data-state={open ? "open" : "closed"}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`forge-motion-surface flex max-h-[min(90vh,720px)] flex-col overflow-hidden rounded-card bg-white shadow-lg ${width} max-w-full ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <>
            <div className="flex items-center justify-between px-6 pt-6">
              <h3 className="text-xl font-semibold leading-8 tracking-fg text-fg-black">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="flex size-7 cursor-pointer items-center justify-center bg-transparent text-fg-black"
                aria-label="关闭"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="mt-6 h-px w-full bg-fg-grey-200" />
          </>
        ) : null}
        {open ? children : lastChildren.current}
      </div>
    </div>
  );
}
