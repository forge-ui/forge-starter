"use client";
import { resourceWriteHeaders, type ResourceSaveOptions, type ResourceSaved } from "@/lib/semantic/resource-save-options";
import type { Receipt } from "@/lib/semantic/operations";

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
import type { PermissionInput, PermissionRecord } from "@/lib/permissions/types";
import { useAccess } from "@/components/access-store";
import { RBAC_RESOURCES } from "@/lib/rbac/constants";

type PermissionsStoreValue = {
  permissions: PermissionRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => PermissionRecord | undefined;
  createPermission: (input: PermissionInput, options?: ResourceSaveOptions) => Promise<ResourceSaved<PermissionRecord>>;
  updatePermission: (id: string, input: PermissionInput, options?: ResourceSaveOptions) => Promise<ResourceSaved<PermissionRecord>>;
  deletePermission: (id: string, options?: ResourceSaveOptions) => Promise<Receipt | undefined>;
  countsByResource: Record<string, number>;
};

const PermissionsStoreContext = createContext<PermissionsStoreValue | null>(null);

type PermissionsResponse = {
  permissions?: PermissionRecord[];
  permission?: PermissionRecord;
  receipt?: Receipt;
};

export function PermissionsStoreProvider({ children }: { children: ReactNode }) {
  const { ready, canRead } = useAccess();
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/permissions/");
      const data = await parseApiJson<PermissionsResponse>(res);
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
    if (!ready) return;
    if (!canRead("permissions")) {
      setPermissions([]);
      setError(null);
      setLoading(false);
      return;
    }
    void refresh();
  }, [ready, canRead, refresh]);

  const getById = useCallback(
    (id: string) => permissions.find((item) => item.id === id),
    [permissions],
  );

  const createPermission = useCallback(async (input: PermissionInput, options?: ResourceSaveOptions) => {
    const res = await apiFetch("/api/permissions/", {
      method: "POST",
      headers: resourceWriteHeaders(options),
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<PermissionsResponse>(res);
    if (!res.ok || !data.ok || !data.permission) {
      throw new Error(data.error ?? "创建失败");
    }
    setPermissions((prev) => {
      const next = [data.permission!, ...prev.filter((item) => item.id !== data.permission!.id)];
      return next;
    });
    return { ...data.permission, receipt: data.receipt };
  }, []);

  const updatePermission = useCallback(async (id: string, input: PermissionInput, options?: ResourceSaveOptions) => {
    const res = await apiFetch(`/api/permissions/${id}/`, {
      method: "PATCH",
      headers: resourceWriteHeaders(options),
      body: JSON.stringify(input),
    });
    const data = await parseApiJson<PermissionsResponse>(res);
    if (!res.ok || !data.ok || !data.permission) {
      throw new Error(data.error ?? "更新失败");
    }
    setPermissions((prev) => prev.map((item) => (item.id === id ? data.permission! : item)));
    return { ...data.permission, receipt: data.receipt };
  }, []);

  const deletePermission = useCallback(async (id: string, options?: ResourceSaveOptions) => {
    const res = await apiFetch(`/api/permissions/${id}/`, { method: "DELETE", headers: resourceWriteHeaders(options) });
    const data = await parseApiJson<PermissionsResponse>(res);
    if (!res.ok || !data.ok) {
      throw new Error(data.error ?? "删除失败");
    }
    setPermissions((prev) => prev.filter((item) => item.id !== id));
    return data.receipt;
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
