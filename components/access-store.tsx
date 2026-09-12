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
import type { AppModuleId } from "@/config/apps";
import type { RbacAction, RbacResource } from "@/lib/rbac/constants";

type AccessUser = {
  id: string;
  username: string;
  email: string;
  displayName: string;
};

type AccessValue = {
  ready: boolean;
  user: AccessUser | null;
  roleName: string | null;
  roleCode: string | null;
  allowedModules: AppModuleId[] | null;
  canRead: (moduleId: AppModuleId) => boolean;
  can: (resource: RbacResource, action: RbacAction) => boolean;
  refresh: () => Promise<void>;
};

const AccessContext = createContext<AccessValue | null>(null);

type MeResponse = {
  user?: AccessUser | null;
  role?: { code: string; name: string };
  allowedModules?: AppModuleId[];
  permissions?: string[];
};

export function AccessStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AccessUser | null>(null);
  const [roleName, setRoleName] = useState<string | null>(null);
  const [roleCode, setRoleCode] = useState<string | null>(null);
  const [allowedModules, setAllowedModules] = useState<AppModuleId[] | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me/");
      const data = await parseApiJson<MeResponse>(res);
      if (res.ok && data.ok && data.user) {
        setUser(data.user);
        setRoleName(data.role?.name ?? null);
        setRoleCode(data.role?.code ?? null);
        setAllowedModules(data.allowedModules ?? []);
        setPermissions(data.permissions ?? []);
      } else {
        setUser(null);
        setRoleName(null);
        setRoleCode(null);
        setAllowedModules([]);
        setPermissions([]);
      }
    } catch {
      setUser(null);
      setAllowedModules([]);
      setPermissions([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const canRead = useCallback(
    (moduleId: AppModuleId) => Boolean(allowedModules?.includes(moduleId)),
    [allowedModules],
  );

  const can = useCallback(
    (resource: RbacResource, action: RbacAction) =>
      permissions.includes(`${resource}:${action}`),
    [permissions],
  );

  const value = useMemo(
    () => ({ ready, user, roleName, roleCode, allowedModules, canRead, can, refresh }),
    [ready, user, roleName, roleCode, allowedModules, canRead, can, refresh],
  );

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error("useAccess must be used within AccessStoreProvider");
  return ctx;
}
