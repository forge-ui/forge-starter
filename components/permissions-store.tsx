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
import type { PermissionInput, PermissionRecord } from "@/lib/permissions/types";
import { RBAC_RESOURCES } from "@/lib/rbac/constants";

type PermissionsStoreValue = {
  permissions: PermissionRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => PermissionRecord | undefined;
  createPermission: (input: PermissionInput) => Promise<PermissionRecord>;
  updatePermission: (id: string, input: PermissionInput) => Promise<PermissionRecord>;
  deletePermission: (id: string) => Promise<void>;
  countsByResource: Record<string, number>;
};

const PermissionsStoreContext = createContext<PermissionsStoreValue | null>(null);

async function parseJson(res: Response) {
  return (await res.json()) as {
    ok: boolean;
    error?: string;
    permissions?: PermissionRecord[];
    permission?: PermissionRecord;
  };
}

export function PermissionsStoreProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/permissions/");
      const data = await parseJson(res);
      if (!res.ok || !data.ok) {
        setError(data.error ?? "加载权限失败");
        setPermissions([]);
        return;
      }
      setPermissions(data.permissions ?? []);
      setError(null);
    } catch {
      setError("网络错误，无法加载权限");
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getById = useCallback(
    (id: string) => permissions.find((item) => item.id === id),
    [permissions],
  );

  const createPermission = useCallback(async (input: PermissionInput) => {
    const res = await fetch("/api/permissions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseJson(res);
    if (!res.ok || !data.ok || !data.permission) {
      throw new Error(data.error ?? "创建失败");
    }
    setPermissions((prev) => {
      const next = [data.permission!, ...prev.filter((item) => item.id !== data.permission!.id)];
      return next;
    });
    return data.permission;
  }, []);

  const updatePermission = useCallback(async (id: string, input: PermissionInput) => {
    const res = await fetch(`/api/permissions/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseJson(res);
    if (!res.ok || !data.ok || !data.permission) {
      throw new Error(data.error ?? "更新失败");
    }
    setPermissions((prev) => prev.map((item) => (item.id === id ? data.permission! : item)));
    return data.permission;
  }, []);

  const deletePermission = useCallback(async (id: string) => {
    const res = await fetch(`/api/permissions/${id}/`, { method: "DELETE" });
    const data = await parseJson(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.error ?? "删除失败");
    }
    setPermissions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const countsByResource = useMemo(() => {
    const counts: Record<string, number> = { all: permissions.length };
    for (const key of RBAC_RESOURCES) counts[key] = 0;
    for (const item of permissions) {
      counts[item.resource] = (counts[item.resource] ?? 0) + 1;
    }
    return counts;
  }, [permissions]);

  const value = useMemo(
    () => ({
      permissions,
      loading,
      error,
      refresh,
      getById,
      createPermission,
      updatePermission,
      deletePermission,
      countsByResource,
    }),
    [
      permissions,
      loading,
      error,
      refresh,
      getById,
      createPermission,
      updatePermission,
      deletePermission,
      countsByResource,
    ],
  );

  return (
    <PermissionsStoreContext.Provider value={value}>{children}</PermissionsStoreContext.Provider>
  );
}

export function usePermissionsStore() {
  const ctx = useContext(PermissionsStoreContext);
  if (!ctx) throw new Error("usePermissionsStore must be used within PermissionsStoreProvider");
  return ctx;
}
