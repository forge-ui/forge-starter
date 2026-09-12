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
import type { RoleInput, RoleRecord } from "@/lib/roles/types";

type RolesStoreValue = {
  roles: RoleRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => RoleRecord | undefined;
  createRole: (input: RoleInput) => Promise<RoleRecord>;
  updateRole: (id: string, input: RoleInput) => Promise<RoleRecord>;
  deleteRole: (id: string) => Promise<void>;
  countsByStatus: Record<string, number>;
};

const RolesStoreContext = createContext<RolesStoreValue | null>(null);

type RolesResponse = {
  roles?: RoleRecord[];
  role?: RoleRecord;
};

export function RolesStoreProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/roles/");
      const data = await parseApiJson<RolesResponse>(res);
      if (!res.ok || !data.ok) {
        setError(data.error ?? "加载角色失败");
        setRoles([]);
        return;
      }
      setRoles(data.roles ?? []);
      setError(null);
    } catch {
      setError("网络错误，无法加载角色");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getById = useCallback(
    (id: string) => roles.find((item) => item.id === id),
    [roles],
  );

  const createRole = useCallback(async (input: RoleInput) => {
    const res = await apiFetch("/api/roles/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<RolesResponse>(res);
    if (!res.ok || !data.ok || !data.role) {
      throw new Error(data.error ?? "创建失败");
    }
    setRoles((prev) => [data.role!, ...prev.filter((item) => item.id !== data.role!.id)]);
    return data.role;
  }, []);

  const updateRole = useCallback(async (id: string, input: RoleInput) => {
    const res = await apiFetch(`/api/roles/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<RolesResponse>(res);
    if (!res.ok || !data.ok || !data.role) {
      throw new Error(data.error ?? "更新失败");
    }
    setRoles((prev) => prev.map((item) => (item.id === id ? data.role! : item)));
    return data.role;
  }, []);

  const deleteRole = useCallback(async (id: string) => {
    const res = await apiFetch(`/api/roles/${id}/`, { method: "DELETE" });
    const data = await parseApiJson<RolesResponse>(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.error ?? "删除失败");
    }
    setRoles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: roles.length, active: 0, disabled: 0 };
    for (const item of roles) counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, [roles]);

  const value = useMemo(
    () => ({
      roles,
      loading,
      error,
      refresh,
      getById,
      createRole,
      updateRole,
      deleteRole,
      countsByStatus,
    }),
    [roles, loading, error, refresh, getById, createRole, updateRole, deleteRole, countsByStatus],
  );

  return <RolesStoreContext.Provider value={value}>{children}</RolesStoreContext.Provider>;
}

export function useRolesStore() {
  const ctx = useContext(RolesStoreContext);
  if (!ctx) throw new Error("useRolesStore must be used within RolesStoreProvider");
  return ctx;
}
