"use client";

import { useEffect, useState } from "react";
import {
  CheckCircleLinear,
  CloseCircleLinear,
  InfoCircleLinear,
} from "solar-icon-set";
import { toast, type ToastItem, type ToastTone } from "@/lib/toast";

const toneStyles: Record<ToastTone, { wrap: string; icon: string }> = {
  success: {
    wrap: "border-fg-green-200 bg-fg-green-50 text-fg-green-700",
    icon: "text-fg-green-600",
  },
  error: {
    wrap: "border-fg-red/20 bg-fg-red/5 text-fg-red",
    icon: "text-fg-red",
  },
  info: {
    wrap: "border-fg-blue-200 bg-fg-blue-50 text-fg-blue-700",
    icon: "text-fg-blue-600",
  },
};

function ToastIcon({ tone }: { tone: ToastTone }) {
  const className = toneStyles[tone].icon;
  if (tone === "success") {
    return <CheckCircleLinear size={18} className={className} />;
  }
  if (tone === "error") {
    return <CloseCircleLinear size={18} className={className} />;
  }
  return <InfoCircleLinear size={18} className={className} />;
}

/**
 * Mount once in AppShell. Renders floating toasts from `toast.*` API.
 * Do not put success banners inside page content — call `toast.success()` instead.
 */
export function ToastProvider() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => toast.subscribe(setItems), []);

  if (!items.length) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
      aria-relevant="additions"
    >
      {items.map((item) => {
        const style = toneStyles[item.tone];
        return (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto flex max-w-md items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium shadow-[0_12px_40px_rgba(15,23,42,0.12)] ${style.wrap}`}
          >
            <ToastIcon tone={item.tone} />
            <span className="min-w-0 flex-1">{item.message}</span>
            <button
              type="button"
              aria-label="关闭"
              className="shrink-0 rounded-lg px-1.5 py-0.5 text-xs opacity-70 transition hover:opacity-100"
              onClick={() => toast.dismiss(item.id)}
            >
              关闭
            </button>
          </div>
        );
      })}
    </div>
  );
}
