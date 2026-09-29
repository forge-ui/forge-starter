"use client";
import { useEffect, useRef } from "react";
import { CONTRACT_VERSION, APPLICATION_BUILD_ID } from "@/lib/semantic/contracts";
import { pageContextSchema, type PageContext, type PageState } from "@/lib/semantic/context";
import type { AgentFormFill } from "@/lib/agent/types";
import { AGENT_FILL_EVENT, peekAgentFormFill, consumeAgentFormFill, discardAgentCommand } from "@/lib/agent/fill";

let current: PageContext | undefined;
export function currentPageContext() { return current; }
export const PAGE_ACK_EVENT = "forge:page-action-ack";

/** Explicit page state; no DOM scraping and no form values or secrets. */
export function useSemanticPage(state: PageState, formId?: string, apply?: (fill: AgentFormFill) => boolean) {
  const id = useRef<string>("");
  const revision = useRef(0);
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const encoded = JSON.stringify(state);
  useEffect(() => {
    if (!id.current) id.current = crypto.randomUUID();
    const parsed = pageContextSchema.safeParse({ ...JSON.parse(encoded), version: CONTRACT_VERSION, buildId: APPLICATION_BUILD_ID, instanceId: id.current, revision: ++revision.current });
    if (!parsed.success) return;
    current = parsed.data;
    return () => { if (current?.instanceId === id.current) current = undefined; };
  }, [encoded]);
  // Re-check pending commands when data/state finishes loading.
  useEffect(() => {
    if (!formId) return;
    const receive = () => {
      const fill = peekAgentFormFill(formId);
      if (!fill || !applyRef.current) return;
      try {
        if (!applyRef.current(fill)) return;
        consumeAgentFormFill(formId);
        window.dispatchEvent(new CustomEvent(PAGE_ACK_EVENT, { detail: { commandId: fill.commandId, ok: true } }));
        if (fill.operationId) void fetch(`/api/ask-ai/operations/${fill.operationId}/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: "awaiting-save" }) });
      } catch (error) {
        consumeAgentFormFill(formId);
        window.dispatchEvent(new CustomEvent(PAGE_ACK_EVENT, { detail: { commandId: fill.commandId, ok: false, error: error instanceof Error ? error.message : "页面操作失败" } }));
      }
    };
    receive();
    window.addEventListener(AGENT_FILL_EVENT, receive);
    return () => window.removeEventListener(AGENT_FILL_EVENT, receive);
  });
}

export function waitForPageAction(commandId: string, timeoutMs = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { cleanup(); discardAgentCommand(commandId); reject(new Error("页面尚未接收操作，请重新打开目标页面")); }, timeoutMs);
    const receive = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.commandId !== commandId) return;
      cleanup();
      if (detail.ok) resolve(); else reject(new Error(detail.error));
    };
    function cleanup() { clearTimeout(timer); window.removeEventListener(PAGE_ACK_EVENT, receive); }
    window.addEventListener(PAGE_ACK_EVENT, receive);
  });
}
