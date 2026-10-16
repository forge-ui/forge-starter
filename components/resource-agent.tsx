"use client";
import { resourceFormDraft, type DraftResource } from "@/lib/agent/resource-fields";
import { decodeAppDraft } from "@/lib/agent/app-fields";
import { useEffect, useRef, useState } from "react";
import type { AgentFormFill } from "@/lib/agent/types";
import { AGENT_PAGE_CANCEL_EVENT, abandonAgentContinuation, readContinuation, type AgentPageCancellation } from "@/lib/agent/fill";

/** Receives confirmed commands; the existing page still owns every save/delete. */
export function useResourceAgent<T extends { id: string; updatedAt: string }>(input: {
  resource: string; rows: T[]; loading: boolean; error: string | null; busy: boolean;
  create: () => void; edit: (id: string) => void; remove: (row: T) => void; close: () => void;
}) {
  const [fill, setFill] = useState<AgentFormFill | null>(null);
  const current = useRef(input); current.current = input;
  function clear(cancel = true) {
    if (cancel && fill?.operationId && readContinuation()?.operationId === fill.operationId) abandonAgentContinuation(fill.operationId);
    setFill(null);
  }
  useEffect(() => {
    const cancel = (event: Event) => {
      const detail = (event as CustomEvent<AgentPageCancellation>).detail;
      if (!detail?.operationId || detail.operationId !== fill?.operationId) return;
      setFill(null); current.current.close();
    };
    window.addEventListener(AGENT_PAGE_CANCEL_EVENT, cancel);
    return () => window.removeEventListener(AGENT_PAGE_CANCEL_EVENT, cancel);
  }, [fill?.operationId]);
  function receive(command: AgentFormFill) {
    if (input.loading) return false;
    if (input.error) throw new Error(input.error);
    if (input.busy) throw new Error("请先保存或关闭当前表单");
    if (!["create", "edit", "delete"].includes(command.mode)) throw new Error("不支持的页面操作");
    const row = input.rows.find(row => row.id === command.recordId);
    if (command.mode !== "create" && !row) throw new Error("目标不存在或已删除");
    if (row && command.expectedUpdatedAt !== row.updatedAt) throw new Error("记录已变化，请刷新后重新核对");
    if (input.resource === "settings") decodeAppDraft(command.fields);
    else resourceFormDraft(input.resource as DraftResource, command.fields, {});
    setFill(command);
    if (command.mode === "delete") input.remove(row!);
    else if (command.mode === "edit") input.edit(row!.id);
    else input.create();
    return true;
  }
  return { fill, clear, receive };
}
