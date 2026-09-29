"use client";

import { useEffect } from "react";
import { ToastProvider as CoreToastProvider, useToast } from "@forge-ui-official/core";
import { toast } from "@/lib/toast";

const toneLabels = { success: "操作成功", error: "操作失败", info: "提示" } as const;

/** Preserve the global bus and its duration/clear semantics; Core owns animation. */
function ToastBridge() {
  const { toast: show, dismiss } = useToast();
  useEffect(() => {
    const displayed = new Map<string, string>();
    const unsubscribe = toast.subscribe((items) => {
      const current = new Set(items.map((item) => item.id));
      for (const [id, coreId] of displayed) {
        if (!current.has(id)) { dismiss(coreId); displayed.delete(id); }
      }
      for (const item of items) {
        if (!displayed.has(item.id)) {
          displayed.set(item.id, show({ title: toneLabels[item.tone], description: item.message, duration: 0 }));
        }
      }
    });
    return () => { unsubscribe(); displayed.forEach(dismiss); };
  }, [show, dismiss]);
  return null;
}

export function ToastProvider() {
  return <CoreToastProvider motion="auto"><ToastBridge /></CoreToastProvider>;
}
