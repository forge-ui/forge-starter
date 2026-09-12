"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, parseApiJson } from "@/lib/api/browser";
import type {
  ApprovalCreateInput,
  ApprovalDecideInput,
  ApprovalRequest,
} from "@/lib/approvals/types";
import { useAccess } from "@/components/access-store";

type ApprovalsStoreValue = {
  items: ApprovalRequest[];
  me: string;
  loading: boolean;
  error: string | null;
  refresh: (scope?: "all" | "mine" | "todo") => Promise<void>;
  getById: (id: string) => ApprovalRequest | undefined;
  create: (input: ApprovalCreateInput) => Promise<ApprovalRequest>;
  decide: (id: string, input: ApprovalDecideInput) => Promise<ApprovalRequest>;
  cancel: (id: string) => Promise<ApprovalRequest>;
  counts: Record<string, number>;
};

const ApprovalsStoreContext = createContext<ApprovalsStoreValue | null>(null);

type ApprovalsResponse = {
  items?: ApprovalRequest[];
  item?: ApprovalRequest;
  me?: string;
};

export function ApprovalsStoreProvider({ children }: { children: ReactNode }) {
  const { ready, canRead } = useAccess();
  const [items, setItems] = useState<ApprovalRequest[]>([]);
  const [me, setMe] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<"all" | "mine" | "todo">("all");

  const refresh = useCallback(async (nextScope?: "all" | "mine" | "todo") => {
    const s = nextScope ?? scope;
    if (nextScope) setScope(nextScope);
    setLoading(true);
    try {
      const res = await apiFetch(`/api/approvals/?scope=${s}`);
      const data = await parseApiJson<ApprovalsResponse>(res);
      if (!res.ok || !data.ok) {
        setError(data.error ?? "加载审批失败");
        setItems([]);
        return;
      }
      setItems(data.items ?? []);
      setMe(data.me ?? "");
      setError(null);
    } catch {
      setError("网络错误，无法加载审批");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    if (!ready) return;
    if (!canRead("approvals")) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }
    void refresh("all");
  }, [ready, canRead, refresh]);

  const getById = useCallback(
    (id: string) => items.find((item) => item.id === id),
    [items],
  );

  const create = useCallback(async (input: ApprovalCreateInput) => {
    const res = await apiFetch("/api/approvals/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<ApprovalsResponse>(res);
    if (!res.ok || !data.ok || !data.item) {
      throw new Error(data.error ?? "发起失败");
    }
    setItems((prev) => [data.item!, ...prev.filter((item) => item.id !== data.item!.id)]);
    return data.item;
  }, []);

  const decide = useCallback(async (id: string, input: ApprovalDecideInput) => {
    const res = await apiFetch(`/api/approvals/${id}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<ApprovalsResponse>(res);
    if (!res.ok || !data.ok || !data.item) {
      throw new Error(data.error ?? "审批失败");
    }
    setItems((prev) => prev.map((item) => (item.id === id ? data.item! : item)));
    return data.item;
  }, []);

  const cancel = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/approvals/${id}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    const data = await parseApiJson<ApprovalsResponse>(res);
    if (!res.ok || !data.ok || !data.item) {
      throw new Error(data.error ?? "撤销失败");
    }
    setItems((prev) => prev.map((item) => (item.id === id ? data.item! : item)));
    return data.item;
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: items.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      mine: 0,
      todo: 0,
    };
    for (const item of items) {
      c[item.status] = (c[item.status] ?? 0) + 1;
      if (me && item.applicantUsername === me) c.mine += 1;
      if (item.status === "pending" && me && item.applicantUsername !== me) c.todo += 1;
    }
    return c;
  }, [items, me]);

  const value = useMemo(
    () => ({
      items,
      me,
      loading,
      error,
      refresh,
      getById,
      create,
      decide,
      cancel,
      counts,
    }),
    [items, me, loading, error, refresh, getById, create, decide, cancel, counts],
  );

  return (
    <ApprovalsStoreContext.Provider value={value}>{children}</ApprovalsStoreContext.Provider>
  );
}

export function useApprovalsStore() {
  const ctx = useContext(ApprovalsStoreContext);
  if (!ctx) throw new Error("useApprovalsStore must be used within ApprovalsStoreProvider");
  return ctx;
}
