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
import type { Supplier, SupplierInput } from "@/lib/suppliers/types";

type SuppliersStoreValue = {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => Supplier | undefined;
  createSupplier: (input: SupplierInput) => Promise<Supplier>;
  updateSupplier: (id: string, input: SupplierInput) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
  countsByStatus: Record<string, number>;
};

const SuppliersStoreContext = createContext<SuppliersStoreValue | null>(null);

async function parseJson(res: Response) {
  return (await res.json()) as {
    ok: boolean;
    error?: string;
    suppliers?: Supplier[];
    supplier?: Supplier;
  };
}

export function SuppliersStoreProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/suppliers/");
      const data = await parseJson(res);
      if (!res.ok || !data.ok) {
        setError(data.error ?? "加载供应商失败");
        setSuppliers([]);
        return;
      }
      setSuppliers(data.suppliers ?? []);
      setError(null);
    } catch {
      setError("网络错误，无法加载供应商");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getById = useCallback(
    (id: string) => suppliers.find((s) => s.id === id),
    [suppliers],
  );

  const createSupplier = useCallback(async (input: SupplierInput) => {
    const res = await fetch("/api/suppliers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseJson(res);
    if (!res.ok || !data.ok || !data.supplier) {
      throw new Error(data.error ?? "创建失败");
    }
    setSuppliers((prev) => [data.supplier!, ...prev.filter((s) => s.id !== data.supplier!.id)]);
    return data.supplier;
  }, []);

  const updateSupplier = useCallback(async (id: string, input: SupplierInput) => {
    const res = await fetch(`/api/suppliers/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseJson(res);
    if (!res.ok || !data.ok || !data.supplier) {
      throw new Error(data.error ?? "更新失败");
    }
    setSuppliers((prev) => prev.map((s) => (s.id === id ? data.supplier! : s)));
    return data.supplier;
  }, []);

  const deleteSupplier = useCallback(async (id: string) => {
    const res = await fetch(`/api/suppliers/${id}/`, { method: "DELETE" });
    const data = await parseJson(res);
    if (!res.ok || !data.ok) throw new Error(data.error ?? "删除失败");
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = {
      all: suppliers.length,
      active: 0,
      inactive: 0,
      pending: 0,
    };
    for (const s of suppliers) counts[s.status] = (counts[s.status] ?? 0) + 1;
    return counts;
  }, [suppliers]);

  const value = useMemo(
    () => ({
      suppliers,
      loading,
      error,
      refresh,
      getById,
      createSupplier,
      updateSupplier,
      deleteSupplier,
      countsByStatus,
    }),
    [
      suppliers,
      loading,
      error,
      refresh,
      getById,
      createSupplier,
      updateSupplier,
      deleteSupplier,
      countsByStatus,
    ],
  );

  return (
    <SuppliersStoreContext.Provider value={value}>
      {children}
    </SuppliersStoreContext.Provider>
  );
}

export function useSuppliersStore() {
  const ctx = useContext(SuppliersStoreContext);
  if (!ctx) throw new Error("useSuppliersStore must be used within SuppliersStoreProvider");
  return ctx;
}
