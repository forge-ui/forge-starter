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
  /** True only after the server says the session is missing. Network errors do not count. */
  signedOut: boolean;
  error: string | null;
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
  const [signedOut, setSignedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me/");
      const data = await parseApiJson<MeResponse>(res);
      if (res.ok && data.ok && data.user) {
        setError(null);
        setSignedOut(false);
        setUser(data.user);
        setRoleName(data.role?.name ?? null);
        setRoleCode(data.role?.code ?? null);
        setAllowedModules(data.allowedModules ?? []);
        setPermissions(data.permissions ?? []);
        return;
      }
      if (res.status === 401) {
        setError(null);
        setSignedOut(true);
        setUser(null);
        setRoleName(null);
        setRoleCode(null);
        setAllowedModules([]);
        setPermissions([]);
      } else {
        setError("暂时无法获取登录状态，请重试");
      }
    } catch {
      // Preserve an established session across transient network failures.
      setError("网络连接失败，请重试");
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
    () => ({ ready, user, roleName, roleCode, allowedModules, canRead, can, signedOut, error, refresh }),
    [ready, user, roleName, roleCode, allowedModules, canRead, can, signedOut, error, refresh],
  );

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error("useAccess must be used within AccessStoreProvider");
  return ctx;
}
