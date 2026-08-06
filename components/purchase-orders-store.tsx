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
import type {
  PurchaseOrder,
  PurchaseOrderCreateInput,
  PurchaseOrderDecideInput,
} from "@/lib/purchase-orders/types";

type PurchaseOrdersStoreValue = {
  items: PurchaseOrder[];
  me: string;
  loading: boolean;
  error: string | null;
  refresh: (scope?: "all" | "mine" | "todo") => Promise<void>;
  getById: (id: string) => PurchaseOrder | undefined;
  create: (input: PurchaseOrderCreateInput) => Promise<PurchaseOrder>;
  decide: (id: string, input: PurchaseOrderDecideInput) => Promise<PurchaseOrder>;
  cancel: (id: string) => Promise<PurchaseOrder>;
  markOrdered: (id: string) => Promise<PurchaseOrder>;
  counts: Record<string, number>;
};

const PurchaseOrdersStoreContext = createContext<PurchaseOrdersStoreValue | null>(null);

async function parseJson(res: Response) {
  return (await res.json()) as {
    ok: boolean;
    error?: string;
    items?: PurchaseOrder[];
    item?: PurchaseOrder;
    me?: string;
  };
}

export function PurchaseOrdersStoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PurchaseOrder[]>([]);
  const [me, setMe] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<"all" | "mine" | "todo">("all");

  const refresh = useCallback(async (nextScope?: "all" | "mine" | "todo") => {
    const s = nextScope ?? scope;
    if (nextScope) setScope(nextScope);
    setLoading(true);
    try {
      const res = await fetch(`/api/purchase-orders/?scope=${s}`);
      const data = await parseJson(res);
      if (!res.ok || !data.ok) {
        setError(data.error ?? "加载采购单失败");
        setItems([]);
        return;
      }
      setItems(data.items ?? []);
      setMe(data.me ?? "");
      setError(null);
    } catch {
      setError("网络错误");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    void refresh("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getById = useCallback(
    (id: string) => items.find((i) => i.id === id),
    [items],
  );

  const create = useCallback(async (input: PurchaseOrderCreateInput) => {
    const res = await fetch("/api/purchase-orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseJson(res);
    if (!res.ok || !data.ok || !data.item) throw new Error(data.error ?? "创建失败");
    setItems((prev) => [data.item!, ...prev.filter((i) => i.id !== data.item!.id)]);
    return data.item;
  }, []);

  const patch = useCallback(async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/purchase-orders/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await parseJson(res);
    if (!res.ok || !data.ok || !data.item) throw new Error(data.error ?? "操作失败");
    setItems((prev) => prev.map((i) => (i.id === id ? data.item! : i)));
    return data.item;
  }, []);

  const decide = useCallback(
    (id: string, input: PurchaseOrderDecideInput) =>
      patch(id, { action: input.action, comment: input.comment }),
    [patch],
  );

  const cancel = useCallback((id: string) => patch(id, { action: "cancel" }), [patch]);
  const markOrdered = useCallback(
    (id: string) => patch(id, { action: "mark_ordered" }),
    [patch],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: items.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      ordered: 0,
      cancelled: 0,
    };
    for (const i of items) c[i.status] = (c[i.status] ?? 0) + 1;
    return c;
  }, [items]);

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
      markOrdered,
      counts,
    }),
    [items, me, loading, error, refresh, getById, create, decide, cancel, markOrdered, counts],
  );

  return (
    <PurchaseOrdersStoreContext.Provider value={value}>
      {children}
    </PurchaseOrdersStoreContext.Provider>
  );
}

export function usePurchaseOrdersStore() {
  const ctx = useContext(PurchaseOrdersStoreContext);
  if (!ctx) {
    throw new Error("usePurchaseOrdersStore must be used within PurchaseOrdersStoreProvider");
  }
  return ctx;
}
