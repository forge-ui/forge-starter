"use client";

import type { ReactNode } from "react";
import { CloseIcon } from "@forge-ui-official/core";

/**
 * Host Modal shell — same pattern as Forge templates/_shared/modal.
 * Core kit has ConfirmationDialog only; general form modals live in the app.
 */
export function Modal({
  open,
  onClose,
  title,
  width = "w-[560px]",
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: string;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-[min(90vh,720px)] flex-col overflow-hidden rounded-card bg-white shadow-lg ${width} max-w-full ${className}`}
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
        {children}
      </div>
    </div>
  );
}
